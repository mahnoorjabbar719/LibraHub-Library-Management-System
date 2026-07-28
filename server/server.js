import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";

import { verifyEmailConnection } from "./utils/sendEmail.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import path from "path";
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Use auth routes

verifyEmailConnection().catch((error) => {
  console.error("❌ Gmail connection failed:", error.message);
});
// Create Express app
const app = express();
app.use("/uploads", express.static("uploads"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 Library Management System API is Running Successfully!"
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
