import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import config from "./config/index.js";

// Initialize app
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes

// Error handling
app.use((err, req, res) => {
  res.status(500).json({ message: err.message || "Something went wrong" });
});

app.get("/health", (req, res) => res.send("OK"));

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port  http://localhost:${PORT}`);
});
