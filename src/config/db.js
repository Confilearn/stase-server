import mongoose from "mongoose";
import config from "./index.js";

// Connect to MongoDB with retry logic
export const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(config.databaseUri, options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit process, let it retry naturally
    console.log("Retrying database connection...");
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};
