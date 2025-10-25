const Product = require("../models/productModel");

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      condition: req.body.condition,
      deliveryOption: req.body.deliveryOption,
      location: req.body.location,
      tags: req.body.tags,
      description: req.body.description,
      images: imagePaths,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add product", error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch product", error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    const imagePaths = req.files ? req.files.map((file) => file.path) : existingProduct.images;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: imagePaths },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update product", error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};

