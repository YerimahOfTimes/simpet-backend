const express = require("express");
const { getChat, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:sellerId", protect, getChat);
router.post("/:sellerId", protect, sendMessage);

module.exports = router;
