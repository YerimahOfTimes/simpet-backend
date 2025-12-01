// fixImages.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "./models/productModel.js";

const backendUrl = process.env.RENDER_EXTERNAL_URL || "https://simpet-backend-1.onrender.com";

async function fixOldImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected ✓");

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue;

      const fixedImages = product.images.map((img) => {
        if (!img) return null;
        if (img.startsWith("http")) return img;
        const filename = img.replace(/\\/g, "/").split("/").pop();
        return `${backendUrl}/uploads/${filename}`;
      });

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: fixedImages } }
      );

      console.log(`Updated images for product ${product._id}`);
    }

    console.log("✅ All product images fixed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error fixing images:", err);
    mongoose.connection.close();
  }
}

fixOldImages();

