import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import config from "./config/index.js";

// Import routes
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/account.js";
import transactionRoutes from "./routes/transaction.js";
import healthRoutes from "./routes/health.js";

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
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/account`, accountRoutes);
app.use(`${config.apiPrefix}/transactions`, transactionRoutes);
app.use(`${config.apiPrefix}/health`, healthRoutes);

// Root health check for backward compatibility
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(
    `API endpoints available at: http://localhost:${PORT}${config.apiPrefix}`,
  );
});
