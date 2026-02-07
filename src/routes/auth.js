import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  createAccount,
  checkUser,
  createUserTransactionPin,
  checkTransactionPin,
  validateTransactionPin,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Authentication routes
 * Handles user registration, user lookup, and PIN management
 */

/**
 * POST /api/auth/create-account
 * Create a new user account with default transaction PIN
 */
router.post("/create-account", createAccount);

/**
 * POST /api/auth/check-user
 * Check if a user exists by email or username
 */
router.post("/check-user", verifyAuth, checkUser);

/**
 * POST /api/auth/create-transaction-pin
 * Create or update user's transaction PIN (requires authentication)
 */
router.post("/create-transaction-pin", verifyAuth, createUserTransactionPin);

/**
 * GET /api/auth/check-transaction-pin
 * Check if user has a transaction PIN set (requires authentication)
 */
router.get("/check-transaction-pin", verifyAuth, checkTransactionPin);

/**
 * POST /api/auth/validate-transaction-pin
 * Validate a user's transaction PIN (requires authentication)
 */
router.post("/validate-transaction-pin", verifyAuth, validateTransactionPin);

export default router;
