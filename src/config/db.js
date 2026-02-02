import mongoose from "mongoose";
import config from "./index.js";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
