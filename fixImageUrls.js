// fixImageUrls.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel");

// ❗ Change this to your actual Render backend domain
const OLD_DOMAIN = "simpet-backend-1.onrender.com";
const NEW_DOMAIN = "simpet-backend.onrender.com"; // <-- correct domain

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find();
    console.log(`🔍 Found ${products.length} products`);

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue;

      const updatedImages = product.images.map((url) =>
        url.replace(OLD_DOMAIN, NEW_DOMAIN)
      );

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: updatedImages } }
      );

      console.log(`✔ Updated product ${product._id}`);
    }

    console.log("🎉 All product image URLs have been updated!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

fixImages();
