import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import { fetchUserDetails } from "../controllers/accountController.js";

const router = express.Router();

/**
 * Account routes
 * Handles user account management and information retrieval
 */

/**
 * GET /api/account/user-details
 * Fetch complete user details including bank accounts and transactions
 * Requires authentication
 */
router.get("/user-details", verifyAuth, fetchUserDetails);

export default router;
