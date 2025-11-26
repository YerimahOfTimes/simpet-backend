const express = require("express");
const { getChat, sendMessage, getAllChats } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Specific route first
router.get("/all/chats", protect, getAllChats);

// Then parameterized route
router.get("/:sellerId", protect, getChat);
router.post("/:sellerId", protect, sendMessage);

module.exports = router;
