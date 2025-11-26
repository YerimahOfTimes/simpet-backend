// ==========================
// Backend Entry File: index.js
// ==========================

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db"); // your MongoDB connection file
const router = require("./routes"); // your routes

const app = express();

// ==========================
// Ensure uploads folder exists
// ==========================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Created uploads directory");
}

// ==========================
// Middleware
// ==========================
app.use(express.json()); // parse JSON request bodies

// ==========================
// CORS Configuration
// ==========================
// Allow local development + live frontend
const allowedOrigins = [
  "http://localhost:5173",         // Vite dev server
  "https://simpet.netlify.app"     // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ==========================
// Static Folder for Images
// ==========================
app.use("/uploads", express.static("uploads"));

// ==========================
// Main API Routes
// ==========================
app.use("/api", router);

// ==========================
// Default Test Route
// ==========================
app.get("/", (req, res) => {
  res.send("✅ Backend API is running...");
});

// ==========================
// PORT Setup
// ==========================
const PORT = process.env.PORT || 5000;

// ==========================
// Connect to MongoDB & Start Server
// ==========================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Connected to MongoDB");
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });



