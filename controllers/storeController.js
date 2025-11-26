const Store = require("../models/storeModel");
const Product = require("../models/productModel");

// @desc Create a store
// @route POST /api/stores/create
// @access Private
exports.createStore = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    // Check if user already has a store
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore) {
      return res
        .status(400)
        .json({ success: false, message: "You already have a store" });
    }

    const newStore = new Store({
      name,
      owner: req.user._id,
      description,
      logo,
    });

    await newStore.save();
    res.status(201).json({ success: true, store: newStore });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create store", error: error.message });
  }
};

// @desc Get all stores
// @route GET /api/stores
// @access Public
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("owner", "name email");
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch stores", error: error.message });
  }
};

// @desc Get store details + products
// @route GET /api/stores/:id
// @access Public
exports.getStoreDetails = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate("owner", "name email");
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    const products = await Product.find({ store: store._id });
    res.status(200).json({ success: true, store, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch store details", error: error.message });
  }
};
