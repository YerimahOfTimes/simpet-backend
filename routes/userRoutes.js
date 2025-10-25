const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

// 👤 Protected route to get user profile
router.get("/profile", protect, getUserProfile);

module.exports = router;
