import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "./models/productModel.js"; // match actual file

const backendUrl = process.env.BACKEND_URL || "https://simpet-backend-1.onrender.com";

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
        // Skip already correct URLs
        if (!img || img.startsWith("http")) return img;

        // Extract filename
        const filename = img.replace(/\\/g, "/").split("/").pop();
        return `${backendUrl}/uploads/${filename}`;
      });

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: fixedImages } }
      );

      console.log(`Updated product ${product._id}`);
    }

    console.log("Image fixing completed ✓");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
}

fixOldImages();
