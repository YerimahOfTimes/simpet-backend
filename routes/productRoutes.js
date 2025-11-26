const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts, // ✅ Import seller dashboard controller
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware"); // ✅ JWT auth middleware

const router = express.Router();

/* -------------------- MULTER SETUP -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

/* -------------------- PRODUCT ROUTES -------------------- */
// Public routes
router.get("/", getProducts);

// Seller dashboard route (must be logged in)
router.get("/seller/me", protect, getSellerProducts); // ✅ placed BEFORE :id

// Public route for specific product by ID
router.get("/:id", getProductById);

// Protected routes (must be logged in)
router.post("/", protect, upload.array("images", 5), addProduct);
router.put("/:id", protect, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
