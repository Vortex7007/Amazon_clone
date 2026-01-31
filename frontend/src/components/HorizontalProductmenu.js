import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HorizontalProductmenu = () => {
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
        // Limit to first 8 products for horizontal menu
        setProducts(data.slice(0, 8));
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
            <img
              // CHANGE 1: Use placehold.co instead of via.placeholder.com
              src={product.image || "https://placehold.co/50"}
              alt={product.name}
              className="h-full object-cover rounded-md w-12"
              // CHANGE 2: The fix for the infinite loop
              onError={(e) => {
                e.target.onerror = null; // <--- CRITICAL: This stops the loop
                e.target.src = "https://placehold.co/50"; // Fallback image
              }}
            />
            <p className="text-center mt-2 text-xs line-clamp-2">{product.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalProductmenu;
