const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS Configuration (very important for frontend-backend communication)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allows cookies and authentication headers
  })
);

// ✅ Static folder for image uploads
app.use("/uploads", express.static("uploads"));

// ✅ Main API route
app.use("/api", router);

// ✅ Default route (optional but useful for testing)
app.get("/", (req, res) => {
  res.send("✅ Backend API is running...");
});

// ✅ PORT setup
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB, then start server
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
