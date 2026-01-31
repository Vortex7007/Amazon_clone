const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Products");

const router = express.Router();

// Helper function to get image URL
const getImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${imagePath}`;
};

// ✅ POST /api/orders/create - Create new order
router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!userId || !items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate items and get current product details
    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      validatedItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: getImageUrl(req, product.image)
      });
    }

    const newOrder = await Order.create({
      userId,
      items: validatedItems,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET /api/orders - Get user's orders
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET /api/orders/:id - Get order details
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ PUT /api/orders/:id/status - Update order status (for sellers)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET /api/seller/orders - Get seller's orders
router.get("/seller/orders", async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId is required" });
    }

    // Find orders where any item belongs to the seller
    const orders = await Order.find({
      "items.productId": { $exists: true }
    }).populate({
      path: 'items.productId',
      match: { sellerId: sellerId }
    }).sort({ orderDate: -1 });

    // Filter out orders where no items match the seller
    const sellerOrders = orders.filter(order =>
      order.items.some(item => item.productId && item.productId.sellerId === sellerId)
    );

    res.status(200).json(sellerOrders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
