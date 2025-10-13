import React, { useState } from "react";


function AddproductPage (){
  const backendUrl = process.env.REACT_APP_BACKEND_SERVER_LINK;
  const [formData, setFormData] = useState({
    sellerId:"",
    name: "",
    price: "",
    productDescription: "",
    about: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  try {
    const res = await fetch(`${backendUrl}/api/products/addproduct`, {
      method: "POST",
      body: data, // ✅ send formData directly
    });

    const result = await res.json();
    console.log("Response from backend:", result);

    if (res.ok) {
      alert("Product added successfully!");
      // Optionally reset form
      setFormData({
        sellerId: "",
        name: "",
        price: "",
        productDescription: "",
        about: "",
        category: "",
        image: null,
      });
    } else {
      alert(result.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Error uploading product:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Add Product
        </h2>

        {/* Seller ID (Read-only) */}
        <div>
          <label className="block text-gray-600 mb-1">Seller ID</label>
          <input
            type="text"
            name="sellerId"
            value={formData.sellerId}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-gray-600 mb-1">Product Description</label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            required
          ></textarea>
        </div>

        {/* About */}
        <div>
          <label className="block text-gray-600 mb-1">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Write about the product"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="2"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
            <option value="sports">Sports</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-600 mb-1">Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default AddproductPage;
