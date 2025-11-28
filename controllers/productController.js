// backend/controllers/productController.js
const Product = require("../models/productModel");

// ============================
// Helper: Force HTTPS on Render
// ============================
const buildImageURL = (req, file) => {
  const host = process.env.RENDER_EXTERNAL_URL || req.get("host");
  return `https://${host}/${file.path.replace(/\\/g, "/")}`;
};

// ============================
// Add Product
// ============================
exports.addProduct = async (req, res) => {
  try {
    const imagePaths = req.files
      ? req.files.map((file) => buildImageURL(req, file))
      : [];

    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      condition: req.body.condition,
      deliveryOption: req.body.deliveryOption,
      location: req.body.location,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      tags: req.body.tags,
      description: req.body.description,
      images: imagePaths,
      seller: req.user._id,
      store: req.body.store || null,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// ============================
// Get all products
// ============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("store");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ============================
// Get product by ID
// ============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("store");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ============================
// Update product
// ============================
exports.updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const imagePaths = req.files
      ? req.files.map((file) => buildImageURL(req, file))
      : existingProduct.images;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imagePaths,
        store: req.body.store || existingProduct.store,
      },
      { new: true }
    ).populate("store");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ============================
// Delete product
// ============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ============================
// Get seller products
// ============================
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("store");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("SELLER PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};
