// backend/routes/settingsRoutes.js
const express = require("express");
const {
  getProfile,
  updateProfile,
  updateBuyerSettings,
  updateSellerSettings,
  changePassword,
  deleteAccount,
} = require("../controllers/settingsController");

const router = express.Router();

router.get("/:id", getProfile);
router.put("/:id/profile", updateProfile);
router.put("/:id/buyer", updateBuyerSettings);
router.put("/:id/seller", updateSellerSettings);
router.put("/:id/password", changePassword);
router.delete("/:id", deleteAccount);

module.exports = router;
