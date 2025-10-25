const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// Users
router.get("/users", protect, adminOnly, adminController.getAllUsers);
router.get("/users/:id", protect, adminOnly, adminController.getUserById);
router.delete("/users/:id", protect, adminOnly, adminController.deleteUser);

// Products
router.get("/products", protect, adminOnly, adminController.getAllProducts);

// Events
router.get("/events", protect, adminOnly, adminController.getAllEvents);
router.post("/events", protect, adminOnly, adminController.createEvent);
router.delete("/events/:id", protect, adminOnly, adminController.deleteEvent);

// Sellers
router.get("/sellers", protect, adminOnly, adminController.getAllSellers);
router.put("/sellers/:id/verify", protect, adminOnly, adminController.verifySeller);

// Withdrawals
router.get("/withdrawals", protect, adminOnly, adminController.getAllWithdrawals);
router.put("/withdrawals/:id", protect, adminOnly, adminController.processWithdrawal);

module.exports = router;
