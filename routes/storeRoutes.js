const express = require("express");
const { createStore, getStores, getStoreDetails } = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create store (user must be logged in)
router.post("/create", protect, createStore);

// Get all stores
router.get("/", getStores);

// Get store details + products
router.get("/:id", getStoreDetails);

module.exports = router;



