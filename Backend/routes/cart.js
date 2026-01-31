const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token and get user ID
const authenticateUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.userId = decoded.user.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Helper function to calculate cart total
const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};

// ✅ GET user's cart
router.get("/", authenticateUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({
        userId: req.userId,
        items: [],
        totalAmount: 0
      });
    }

    // Calculate total with current prices
    cart.totalAmount = await calculateTotal(cart.items);
    await cart.save();

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      const protocol = req.protocol;
      const host = req.get('host');
      return `${protocol}://${host}/${imagePath}`;
    };

    // Transform to include product details
    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return null;
        
        return {
          _id: item._id,
          productId: product._id.toString(), // Ensure productId is a string
          name: product.name,
          price: product.price,
          image: getImageUrl(product.image),
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        };
      })
    );

    // Filter out null items (products that no longer exist)
    const validItems = cartItems.filter(item => item !== null);

    res.status(200).json({
      items: validItems,
      totalAmount: cart.totalAmount,
      totalQuantity: validItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ POST add item to cart
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [],
        totalAmount: 0
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    // Calculate total
    cart.totalAmount = await calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart: cart
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ PUT update item quantity
router.put("/update", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Convert productId to string for comparison
    const productIdStr = productId.toString();

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productIdStr
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalAmount = await calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({
      message: "Cart updated",
      cart: cart
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE remove item from cart
router.delete("/remove/:productId", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    cart.totalAmount = await calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart: cart
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ POST clear cart
router.post("/clear", authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      cart: cart
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

