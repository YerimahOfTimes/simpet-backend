const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * 🧩 REGISTER USER CONTROLLER
 */
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneCountryCode,
      phone,
      gender,
      age,
      address,
      password,
      confirmPassword,
      profileImage,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phoneCountryCode,
      phone,
      gender,
      age,
      address,
      password: hashedPassword,
      profileImage,
      role: "user", // default role
    });

    await newUser.save();

    // 👉 return redirect instruction instead of token
    res.status(201).json({
      success: true,
      message: "Registration successful. Please login to continue.",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🧩 LOGIN CONTROLLER — supports both Users and Admins
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    const model = isAdmin ? Admin : User;
    const account = await model.findOne({ email }).select("+password");

    if (!account) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: account._id, role: isAdmin ? "admin" : account.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: isAdmin ? "admin" : account.role,
        profileImage: account.profileImage || "", // 👈 added this
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


