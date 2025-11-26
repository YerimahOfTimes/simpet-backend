// ==========================
// Backend Entry File: index.js
// ==========================

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db"); // Mongo connect
const router = require("./routes");       // Main API router

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
// CORS FIX — Supports Local + Netlify + Production
// ==========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // local dev
      "http://localhost:3000",                 // if needed
      "https://simpet-frontend.onrender.com",  // Render frontend
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// ==========================
// Middleware
// ==========================
app.use(express.json());
app.use(cookieParser());

// ==========================
// Static Folder for Uploaded Images
// ==========================
app.use("/uploads", express.static("uploads"));

// ==========================
// Main API Routes (FIXED)
// Removed `/api` so frontend routes match:
// /auth/login
// /auth/register
// ==========================
app.use("/", router);

// ==========================
// Default Route
// ==========================
app.get("/", (req, res) => {
  res.send("✅ SIMPET Backend Running...");
});

// ==========================
// Start Server AFTER DB Connect
// ==========================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("✅ MongoDB Connected");
    console.log("🚀 Server running on " + PORT);
  });
});
