const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Product = require("../models/productModel");
const Event = require("../models/eventModel");
const Seller = require("../models/sellerModel");
const Withdrawal = require("../models/withdrawalModel");

// ---------------- Users ----------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Products ----------------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Events ----------------
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.admin._id });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Sellers ----------------
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sellers.length, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });
    seller.verified = true;
    await seller.save();
    res.status(200).json({ success: true, message: "Seller verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Withdrawals ----------------
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("seller", "name email")
      .sort({ requestedAt: -1 });
    res.status(200).json({ success: true, count: withdrawals.length, withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.processWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ success: false, message: "Withdrawal not found" });
    withdrawal.status = status;
    withdrawal.processedAt = Date.now();
    await withdrawal.save();
    res.status(200).json({ success: true, message: "Withdrawal updated", withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
