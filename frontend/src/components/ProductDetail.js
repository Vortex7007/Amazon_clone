import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, setCart } from "../redux/cart/cartSlice";
import Navbar from "./Navbar";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, backendUrl]);

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("authToken");
    
    if (token) {
      // User is logged in - sync with backend
      try {
        const response = await fetch(`${backendUrl}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: quantity,
          }),
        });

        if (response.ok) {
          // Fetch updated cart
          const cartResponse = await fetch(`${backendUrl}/api/cart`, {
            headers: {
              "auth-token": token,
            },
          });
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            dispatch(setCart({
              items: cartData.items,
              totalQuantity: cartData.totalQuantity,
              totalAmount: cartData.totalAmount
            }));
          }
          alert(`${product.name} added to cart!`);
        } else {
          throw new Error("Failed to add to cart");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart. Please try again.");
      }
    } else {
      // User not logged in - use local Redux only
      const cartItem = {
        productId: product._id,
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      };
      dispatch(addToCart(cartItem));
      alert(`${product.name} added to cart!`);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-lg">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-lg">★</span>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({product.ratingCount} {product.ratingCount === 1 ? "rating" : "ratings"})
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <Link
              to="/"
              className="text-yellow-600 hover:text-yellow-700 underline"
            >
              Go back to homepage
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm">
            <Link to="/" className="text-yellow-600 hover:text-yellow-700">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{product.category || "Product"}</span>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-100">
                <img
                  src={product.image || "https://via.placeholder.com/400"}
                  alt={product.name}
                  className="max-w-full max-h-96 object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="mb-4">
                    {renderStars(product.rating)}
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg mb-4 transition-colors"
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Buy Now
                </button>

                {/* Product Details */}
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                  {product.about && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">About this item:</h3>
                      <p className="text-gray-600 whitespace-pre-line">{product.about}</p>
                    </div>
                  )}
                  {product.productDescription && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Description:</h3>
                      <p className="text-gray-600 whitespace-pre-line">{product.productDescription}</p>
                    </div>
                  )}
                  {product.category && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">Category: </span>
                      <span className="text-sm font-medium text-gray-700">{product.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

