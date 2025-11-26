// backend/models/productModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: "New" },
    deliveryOption: { type: String },
    location: { type: String },        
    contactNumber: { type: String },   
    email: { type: String },           
    tags: { type: String },
    description: { type: String, required: true },
    images: [{ type: String }],

    seller: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // ✅ Reference to Store
    store: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Store",
      default: null 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
