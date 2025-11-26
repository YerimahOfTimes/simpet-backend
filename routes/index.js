const express = require("express");
const router = express.Router();

// Import all route modules
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const paymentRoutes = require("./paymentRoutes");
const chatRoutes = require("./chatRoutes");
const settingsRoutes = require("./settingsRoutes");
const forgotPasswordRoutes = require("./forgotPasswordRoutes"); // ✅ Add this line
const storeRoutes = require("./storeRoutes");

// Mount all routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes);
router.use("/chat", chatRoutes);
router.use("/settings", settingsRoutes);
router.use("/password", forgotPasswordRoutes); // ✅ This now works
router.use("/store", storeRoutes);

module.exports = router;


