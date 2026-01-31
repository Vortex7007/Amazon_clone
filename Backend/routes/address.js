const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
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

// POST /api/address/add - Add new address
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { name, mobile, address, city, state, pincode, isDefault = false } = req.body;

    if (!name || !mobile || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.userId, isDefault: true },
        { isDefault: false }
      );
    }

    const newAddress = await Address.create({
      userId: req.userId,
      name,
      mobile,
      address,
      city,
      state,
      pincode,
      isDefault
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/address - Get user addresses
router.get("/", authenticateUser, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/address/:id - Update address
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, address, city, state, pincode, isDefault = false } = req.body;

    const addressDoc = await Address.findOne({ _id: id, userId: req.userId });
    if (!addressDoc) {
      return res.status(404).json({ error: "Address not found" });
    }

    // If setting as default, unset other default addresses
    if (isDefault && !addressDoc.isDefault) {
      await Address.updateMany(
        { userId: req.userId, isDefault: true },
        { isDefault: false }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { name, mobile, address, city, state, pincode, isDefault },
      { new: true }
    );

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/address/:id - Delete address
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({
      message: "Address deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/address/:id/set-default - Set default address
router.put("/:id/set-default", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Unset all default addresses for this user
    await Address.updateMany(
      { userId: req.userId, isDefault: true },
      { isDefault: false }
    );

    // Set the specified address as default
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({
      message: "Default address updated successfully",
      address: updatedAddress
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
