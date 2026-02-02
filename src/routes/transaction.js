import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  convertMoney,
} from "../controllers/transactionController.js";

const router = express.Router();

/**
 * Transaction routes
 * Handles all financial operations including deposits, withdrawals, transfers, and conversions
 */

/**
 * POST /api/transactions/deposit
 * Deposit money into user's account
 * Requires authentication and transaction PIN
 */
router.post("/deposit", verifyAuth, depositMoney);

/**
 * POST /api/transactions/withdraw
 * Withdraw money from user's account
 * Requires authentication and transaction PIN
 */
router.post("/withdraw", verifyAuth, withdrawMoney);

/**
 * POST /api/transactions/transfer
 * Transfer money between users
 * Requires authentication
 */
router.post("/transfer", verifyAuth, transferMoney);

/**
 * POST /api/transactions/convert
 * Convert currency between user's accounts
 * Requires authentication
 */
router.post("/convert", verifyAuth, convertMoney);

export default router;
