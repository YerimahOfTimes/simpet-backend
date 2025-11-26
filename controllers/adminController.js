const User = require("../models/userModel");
const Product = require("../models/productModel");
const Event = require("../models/eventModel");
const Seller = require("../models/sellerModel");
const Withdrawal = require("../models/withdrawalModel");
const bcrypt = require("bcrypt");

// ---------------- Check Super Admin ----------------
const requireSuperAdmin = (user) => {
  if (user.role !== "super_admin") {
    const err = new Error("Only Super Admin can perform this action");
    err.status = 403;
    throw err;
  }
};

// ---------------- Dashboard ----------------
exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = 0; 
    const revenue = 0;

    res.status(200).json({ users, products, orders, revenue });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// ---------------- Users ----------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const exists = await User.findById(req.params.id);
    if (!exists) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- ROLE MANAGEMENT ----------------
exports.makeAdmin = async (req, res) => {
  try {
    requireSuperAdmin(req.user);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") return res.json({ message: "User is already an admin" });

    user.role = "admin";
    await user.save();

    res.json({ message: `${user.name} is now an admin` });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    requireSuperAdmin(req.user);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "user";
    await user.save();

    res.json({ message: "Admin role removed", user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.makeSuperAdmin = async (req, res) => {
  try {
    requireSuperAdmin(req.user);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "super_admin";
    await user.save();

    res.json({ message: "User promoted to Super Admin", user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.removeSuperAdmin = async (req, res) => {
  try {
    requireSuperAdmin(req.user);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "Super Admin role removed", user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ---------------- Products ----------------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Events ----------------
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.status(200).json(events);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: "Failed to create event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Sellers ----------------
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json(sellers);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.verified = true;
    await seller.save();

    res.status(200).json({ message: "Seller verified" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Withdrawals ----------------
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("seller", "name email")
      .sort({ requestedAt: -1 });

    res.status(200).json(withdrawals);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.processWithdrawal = async (req, res) => {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) return res.status(404).json({ message: "Withdrawal not found" });

    w.status = req.body.status;
    w.processedAt = Date.now();
    await w.save();

    res.status(200).json({ message: "Withdrawal updated", withdrawal: w });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Admin Settings / Password / Avatar ----------------
exports.getAdminSettings = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    res.status(200).json(admin);
  } catch {
    res.status(500).json({ message: "Failed to fetch admin settings" });
  }
};

exports.updateAdminSettings = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    await admin.save();

    res.status(200).json({ message: "Admin settings updated", admin });
  } catch {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(req.body.currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    admin.password = await bcrypt.hash(req.body.newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch {
    res.status(500).json({ message: "Failed to change password" });
  }
};

exports.uploadAdminAvatar = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    admin.profileImage = req.file.path;
    await admin.save();

    res.status(200).json({ message: "Avatar uploaded successfully", admin });
  } catch {
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

