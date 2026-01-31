const express = require("express");
const multer = require("multer");
const Product = require("../models/Products"); // your mongoose model
const path = require("path");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Helper function to get image URL
const getImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${imagePath}`;
};

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    // Transform image paths to URLs
    const productsWithUrls = products.map(product => ({
      ...product.toObject(),
      image: getImageUrl(req, product.image)
    }));
    res.status(200).json(productsWithUrls);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET products by category (must come before /:id route)
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    // Transform image paths to URLs
    const productsWithUrls = products.map(product => ({
      ...product.toObject(),
      image: getImageUrl(req, product.image)
    }));
    res.status(200).json(productsWithUrls);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET single product by ID (must come after /category route)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Transform image path to URL
    const productWithUrl = {
      ...product.toObject(),
      image: getImageUrl(req, product.image)
    };
    res.status(200).json(productWithUrl);
  } catch (err) {
    console.error("Error fetching product:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ POST route
router.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const { sellerId, name, price, productDescription, about, category } = req.body;

    // Multer puts file info in req.file
    const imagePath = req.file ? req.file.path : null;

    const newProduct = await Product.create({
      sellerId,
      name,
      price,
      productDescription,
      about,
      category,
      image: imagePath, // ✅ store image path
    });

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
