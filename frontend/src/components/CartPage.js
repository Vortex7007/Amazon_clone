import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart, setCart } from "../redux/cart/cartSlice";
import Navbar from "./Navbar";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/cart`, {
          headers: {
            "auth-token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setCart({
            items: data.items,
            totalQuantity: data.totalQuantity,
            totalAmount: data.totalAmount
          }));
        } else {
          throw new Error("Failed to fetch cart");
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch, backendUrl]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to update cart");
      return;
    }

    try {
      // Convert productId to string if it's an object
      const productIdStr = typeof productId === 'object' ? productId.toString() : productId;
      
      const response = await fetch(`${backendUrl}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ productId: productIdStr, quantity: newQuantity }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh cart
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
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(removeFromCart(productId));
      return;
    }

    try {
      // Convert productId to string if it's an object
      const productIdStr = typeof productId === 'object' ? productId.toString() : productId;
      
      const response = await fetch(`${backendUrl}/api/cart/remove/${productIdStr}`, {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh cart
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
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch(`${backendUrl}/api/cart/clear`, {
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });

        if (response.ok) {
          dispatch(clearCart());
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    } else {
      dispatch(clearCart());
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  const items = cart.items || [];
  const totalAmount = cart.totalAmount || 0;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link
                to="/"
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.productId || item._id}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-4"
                      >
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between">
                        <div className="flex-1 mb-4 sm:mb-0">
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-lg font-semibold text-gray-900 hover:text-yellow-600 mb-2 block"
                          >
                            {item.name}
                          </Link>
                          <p className="text-lg font-bold text-gray-900 mb-4">
                            ₹{item.price?.toLocaleString("en-IN")}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex flex-col items-end justify-between">
                          <p className="text-lg font-bold text-gray-900 mb-4">
                            ₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg mb-3 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="block text-center text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
