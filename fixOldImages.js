import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "./models/Product.js";

const backendUrl = process.env.BACKEND_URL || "https://simpet-backend-1.onrender.com";

async function fixOldImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected ✓");

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      const oldImage = product.image;

      // Only fix images starting with http:// or missing domain
      if (!oldImage || oldImage.startsWith("https://")) continue;

      let filename = oldImage.replace(/\\/g, "/").split("/").pop();
      const newImageUrl = `${backendUrl}/uploads/${filename}`;

      console.log(`Fixing: ${oldImage} → ${newImageUrl}`);

      // ❗ IMPORTANT: Use updateOne (bypasses all validations including seller)
      await Product.updateOne(
        { _id: product._id },
        { $set: { image: newImageUrl } }
      );
    }

    console.log("Image fixing completed ✓");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
}

fixOldImages();
