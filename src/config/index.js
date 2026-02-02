// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Configuration object for the application
const config = {
  // Server settings
  port: process.env.PORT || 3000,
  apiPrefix: process.env.API_PREFIX || "/api",

  // MongoDB connection URI
  databaseUri: process.env.MONGODB_URI,
};

export default config;
