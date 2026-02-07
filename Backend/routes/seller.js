const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Products");
const Order = require("../models/Order");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Middleware to verify seller JWT token
const authenticateSeller = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!decoded.seller || !decoded.seller.id) {
      return res.status(403).json({ error: "Invalid seller token." });
    }
    req.sellerId = decoded.seller.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Configure multer storage for product images
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
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${protocol}://${host}/${imagePath}`;
};

// ✅ GET /api/seller/products - Get seller's products
router.get("/products", authenticateSeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.sellerId });

    // Transform image paths to URLs
    const productsWithUrls = products.map(product => ({
      ...product.toObject(),
      image: getImageUrl(req, product.image)
    }));

    res.status(200).json(productsWithUrls);
  } catch (err) {
    console.error("Error fetching seller products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ PUT /api/seller/products/:id - Update product
router.put("/products/:id", authenticateSeller, upload.single("image"), async (req, res) => {
  try {
    const { name, price, productDescription, about, category } = req.body;
    const productId = req.params.id;

    // Check if product exists and belongs to seller
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId !== req.sellerId) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    // Update product
    const updateData = {
      name,
      price: parseFloat(price),
      productDescription,
      about,
      category
    };

    // If new image uploaded, update image path
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    // Transform image path to URL
    const productWithUrl = {
      ...updatedProduct.toObject(),
      image: getImageUrl(req, updatedProduct.image)
    };

    res.status(200).json({
      message: "Product updated successfully",
      product: productWithUrl
    });
  } catch (err) {
    console.error("Error updating product:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE /api/seller/products/:id - Delete product
router.delete("/products/:id", authenticateSeller, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists and belongs to seller
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId !== req.sellerId) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET /api/seller/analytics - Sales statistics
router.get("/analytics", authenticateSeller, async (req, res) => {
  try {
    // Get all products by this seller
    const products = await Product.find({ sellerId: req.sellerId });
    const productIds = products.map(p => p._id.toString());

    // Get all orders containing seller's products
    const orders = await Order.find({
      "items.productId": { $in: productIds }
    });

    // Calculate analytics
    let totalSales = 0;
    let totalOrders = 0;
    let totalProductsSold = 0;
    const monthlySales = {};
    const productSales = {};

    orders.forEach(order => {
      // Filter items that belong to this seller
      const sellerItems = order.items.filter(item =>
        productIds.includes(item.productId)
      );

      if (sellerItems.length > 0) {
        totalOrders += 1;

        sellerItems.forEach(item => {
          const itemTotal = item.price * item.quantity;
          totalSales += itemTotal;
          totalProductsSold += item.quantity;

          // Track product sales
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.name,
              sold: 0,
              revenue: 0
            };
          }
          productSales[item.productId].sold += item.quantity;
          productSales[item.productId].revenue += itemTotal;
        });

        // Track monthly sales
        const orderDate = new Date(order.orderDate);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlySales[monthKey]) {
          monthlySales[monthKey] = 0;
        }
        monthlySales[monthKey] += sellerItems.reduce((sum, item) =>
          sum + (item.price * item.quantity), 0
        );
      }
    });

    // Get order status breakdown
    const orderStatusCounts = {};
    orders.forEach(order => {
      const sellerItems = order.items.filter(item =>
        productIds.includes(item.productId)
      );

      if (sellerItems.length > 0) {
        if (!orderStatusCounts[order.status]) {
          orderStatusCounts[order.status] = 0;
        }
        orderStatusCounts[order.status] += 1;
      }
    });

    const analytics = {
      totalSales,
      totalOrders,
      totalProductsSold,
      totalProducts: products.length,
      monthlySales,
      productSales: Object.values(productSales),
      orderStatusBreakdown: orderStatusCounts
    };

    res.status(200).json(analytics);
  } catch (err) {
    console.error("Error fetching seller analytics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET /api/seller/orders - Get seller's orders (pending orders to fulfill)
router.get("/orders", authenticateSeller, async (req, res) => {
  try {
    // Get all products by this seller
    const products = await Product.find({ sellerId: req.sellerId });
    const productIds = products.map(p => p._id.toString());

    // Get orders containing seller's products
    const orders = await Order.find({
      "items.productId": { $in: productIds }
    }).sort({ orderDate: -1 });

    // Filter and transform orders to only include seller's items
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item =>
        productIds.includes(item.productId)
      );

      return {
        ...order.toObject(),
        items: sellerItems, // Only seller's items
        sellerTotal: sellerItems.reduce((sum, item) =>
          sum + (item.price * item.quantity), 0
        )
      };
    }).filter(order => order.items.length > 0); // Remove orders with no seller items

    res.status(200).json(sellerOrders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
