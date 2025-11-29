// backend/controllers/productController.js
const Product = require("../models/productModel");

// =============================================================
// Helper: Build PUBLIC image URL (Render or Localhost)
// =============================================================
const buildImageURL = (file) => {
  if (!file) return null;

  const host =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL || 
    "http://localhost:5000";

  // Ensure no backslashes on Windows
  const normalizedPath = file.path.replace(/\\/g, "/");

  return `${host}/${normalizedPath}`;
};

// =============================================================
// Ensure ALL product images have correct HTTPS URLs
// =============================================================
const fixProductImageURLs = (product) => {
  if (!product.images || product.images.length === 0) return product;

  product.images = product.images.map((img) => {
    // If already full URL → keep it
    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    // If only filename stored, convert
    return `${process.env.RENDER_EXTERNAL_URL || "http://localhost:5000"}/uploads/${img}`;
  });

  return product;
};

// =============================================================
// Add Product
// =============================================================
exports.addProduct = async (req, res) => {
  try {
    const imagePaths = req.files?.length
      ? req.files.map((file) => buildImageURL(file))
      : [];

    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      condition: req.body.condition ?? "New",
      deliveryOption: req.body.deliveryOption,
      location: req.body.location,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      tags: req.body.tags,
      description: req.body.description,
      images: imagePaths,
      seller: req.user._id,
      store: req.body.store || null, // store support preserved
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// =============================================================
// Get All Products
// =============================================================
exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("store");

    // Fix URLs before sending
    products = products.map((p) => fixProductImageURLs(p));

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// =============================================================
// Get Product by ID
// =============================================================
exports.getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate("store");

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product = fixProductImageURLs(product);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// =============================================================
// Update Product
// =============================================================
exports.updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Product not found" });

    const newImages = req.files?.length
      ? req.files.map((file) => buildImageURL(file))
      : existing.images;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: newImages,
        store: req.body.store || existing.store,
      },
      { new: true }
    ).populate("store");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: fixProductImageURLs(updatedProduct),
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// =============================================================
// Delete Product
// =============================================================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// =============================================================
// Seller Dashboard: Fetch Seller Products
// =============================================================
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    let products = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("store");

    products = products.map((p) => fixProductImageURLs(p));

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Seller Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};



