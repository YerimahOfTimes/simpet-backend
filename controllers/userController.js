const User = require("../models/userModel");

// 👤 Get logged-in user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is available because of the protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
