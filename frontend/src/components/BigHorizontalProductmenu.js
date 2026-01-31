import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BigHorizontalProductmenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Get products 9-16 for this section (or all if less than 9)
        setProducts(data.slice(8, 16));
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex mx-2 justify-center py-4">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex mx-2 justify-center py-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex mx-2 justify-center py-4">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex mx-2">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="min-w-[70px] rounded-lg flex flex-col items-center justify-center mt-2 cursor-pointer hover:bg-gray-100 p-2 transition-colors"
          >
            <p className="text-center mt-2 text-xs line-clamp-2">{product.name}</p>
            <img
              src={product.image || "https://via.placeholder.com/50"}
              alt={product.name}
              className="h-full object-cover rounded-md w-12"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/50";
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BigHorizontalProductmenu;
