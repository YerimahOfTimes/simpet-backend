const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  superAdminOnly
} = require("../middleware/authMiddleware");

const adminController = require("../controllers/adminController");

// ======================
// 📌 Dashboard
// ======================
router.get(
  "/dashboard",
  protect,
  adminOnly,
  adminController.getDashboardStats
);

// ======================
// 📌 Users
// ======================
router.get(
  "/users",
  protect,
  adminOnly,
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  protect,
  adminOnly,
  adminController.getUserById
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  adminController.deleteUser
);

// ======================
// 📌 User Role Management (Only Super Admin)
// ======================
router.put(
  "/users/:id/make-admin",
  protect,
  superAdminOnly,
  adminController.makeAdmin   // <-- FIXED PARAM MATCH
);

router.put(
  "/users/:id/remove-admin",
  protect,
  superAdminOnly,
  adminController.removeAdmin
);

router.put(
  "/users/:id/make-super-admin",
  protect,
  superAdminOnly,
  adminController.makeSuperAdmin
);

// (Optional) Remove super admin
router.put(
  "/users/:id/remove-super-admin",
  protect,
  superAdminOnly,
  adminController.removeSuperAdmin
);

// ======================
// 📌 Products
// ======================
router.get(
  "/products",
  protect,
  adminOnly,
  adminController.getAllProducts
);

// ======================
// 📌 Events
// ======================
router.get(
  "/events",
  protect,
  adminOnly,
  adminController.getAllEvents
);

router.post(
  "/events",
  protect,
  adminOnly,
  adminController.createEvent
);

router.delete(
  "/events/:id",
  protect,
  adminOnly,
  adminController.deleteEvent
);

// ======================
// 📌 Sellers
// ======================
router.get(
  "/sellers",
  protect,
  adminOnly,
  adminController.getAllSellers
);

router.put(
  "/sellers/:id/verify",
  protect,
  adminOnly,
  adminController.verifySeller
);

// ======================
// 📌 Withdrawals
// ======================
router.get(
  "/withdrawals",
  protect,
  adminOnly,
  adminController.getAllWithdrawals
);

router.put(
  "/withdrawals/:id",
  protect,
  adminOnly,
  adminController.processWithdrawal
);

// ======================
// 📌 Admin Settings
// ======================
router.get(
  "/settings",
  protect,
  adminOnly,
  adminController.getAdminSettings
);

router.put(
  "/settings",
  protect,
  adminOnly,
  adminController.updateAdminSettings
);

// ======================
// 📌 Change Admin Password
// ======================
router.put(
  "/change-password",
  protect,
  adminOnly,
  adminController.changeAdminPassword
);

// ======================
// 📌 Upload Avatar
// ======================
router.post(
  "/upload-avatar",
  protect,
  adminOnly,
  adminController.uploadAdminAvatar
);

module.exports = router;

