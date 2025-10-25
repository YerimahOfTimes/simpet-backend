const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/forgotPasswordController");

const router = express.Router();

/**
 * @route   POST /api/forgot-password
 * @desc    Send a password reset link to user email
 * @access  Public
 */
router.post("/", forgotPassword);

/**
 * @route   PUT /api/forgot-password/reset/:token
 * @desc    Reset user password using token
 * @access  Public
 */
router.put("/reset/:token", resetPassword);

module.exports = router;

