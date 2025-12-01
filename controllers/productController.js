// backend/controllers/productController.js
const Product = require("../models/productModel");

// ================================================
// Helper: Build Full HTTPS URL for Uploaded Images
// ================================================
const buildImageURL = (file) => {
  if (!file) return null;
  const host = process.env.RENDER_EXTERNAL_URL || "https://simpet-backend-1.onrender.com";
  return `${host}/uploads/${file.filename}`;
};

// ================================================
// Helper: Ensure Existing Image URLs Are Valid HTTPS
// ================================================
const fixImageURLs = (images = []) => {
  if (!images.length) return [];
  const host = process.env.RENDER_EXTERNAL_URL || "https://simpet-backend-1.onrender.com";
  return images.map(img => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${host}/${img.replace(/\\/g, "/")}`;
  });
};

// ================================================
// Add Product
// ================================================
exports.addProduct = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    const imagePaths = req.files ? req.files.map(buildImageURL) : [];

    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      condition: req.body.condition || "New",
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

// ================================================
// Get All Products
// ================================================
exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: -1 }).populate("store");

    products = products.map(p => ({
      ...p._doc,
      images: fixImageURLs(p.images),
      sellerPhone: p.contactNumber || null,
      sellerEmail: p.email || null,
    }));

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

// ================================================
// Get Product By ID
// ================================================
exports.getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate("store");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product = {
      ...product._doc,
      images: fixImageURLs(product.images),
      sellerPhone: product.contactNumber || null,
      sellerEmail: product.email || null,
    };

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

// ================================================
// Update Product
// ================================================
exports.updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newImages = req.files && req.files.length > 0
      ? req.files.map(buildImageURL)
      : existingProduct.images;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: newImages,
        store: req.body.store || existingProduct.store,
      },
      { new: true }
    ).populate("store");

    updatedProduct.images = fixImageURLs(updatedProduct.images);
    updatedProduct.sellerPhone = updatedProduct.contactNumber || null;
    updatedProduct.sellerEmail = updatedProduct.email || null;

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

// ================================================
// Delete Product
// ================================================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
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

// ================================================
// Get Seller Products
// ================================================
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    let products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).populate("store");

    products = products.map(p => ({
      ...p._doc,
      images: fixImageURLs(p.images),
      sellerPhone: p.contactNumber || null,
      sellerEmail: p.email || null,
    }));

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("GET SELLER PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};
