// backend/controllers/settingsController.js
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");


// 🧩 Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧱 Update user profile (name, email, phone, avatar)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.body.avatar,
      },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧭 Update buyer settings
exports.updateBuyerSettings = async (req, res) => {
  try {
    const { notification, paymentPreference, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { notification, paymentPreference, addresses },
      { new: true }
    ).select("-password");

    res.json({ message: "Buyer settings updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🏪 Update seller settings
exports.updateSellerSettings = async (req, res) => {
  try {
    const { isSeller, shop, bank, sellerAgreementAccepted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSeller, shop, bank, sellerAgreementAccepted },
      { new: true }
    ).select("-password");

    res.json({ message: "Seller settings updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
