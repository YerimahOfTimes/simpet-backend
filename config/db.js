const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Use your .env variable name

    // Check if it's missing
    if (!mongoURI) {
      throw new Error("MongoDB connection string (MONGO_URI) is missing in .env file");
    }

    console.log("✅ Connecting to MongoDB...");

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
