import bcrypt from "bcrypt";
import User from "../models/User.js";
import BankAccount from "../models/BankAccount.js";
import Transaction from "../models/Transaction.js";
import { verifyAuth } from "../middleware/auth.js";
import { createBankAccounts } from "./accountController.js";

/**
 * Authentication controller for user management and PIN operations
 * Handles user creation, PIN management, and authentication
 */

/**
 * Creates a new user account with default transaction PIN
 * Generates bank accounts for all supported currencies
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function createAccount(req, res) {
  try {
    const { firstName, lastName, username, email } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: firstName, lastName, username, email",
      });
    }

    // Extract clerkUserId from Authorization header for account creation
    let clerkUserId = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      clerkUserId = authHeader.substring(7); // Remove "Bearer " prefix
    }

    if (!clerkUserId) {
      return res.status(400).json({
        success: false,
        error: "Missing clerkUserId in Authorization header",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email or username already exists",
      });
    }

    // Create user without PIN (will default to empty string)
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      clerkUserId,
    });

    const savedUser = await user.save();

    // Create bank accounts for all supported currencies
    const bankAccounts = await createBankAccounts(
      savedUser._id,
      firstName,
      lastName,
    );

    // Get transactions (should be empty for new user)
    const transactions = await Transaction.find({
      $or: [{ from: savedUser._id }, { to: savedUser._id }],
    });

    // Return complete user data (excluding sensitive information)
    const response = {
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        username: savedUser.username,
        email: savedUser.email,
        clerkUserId: savedUser.clerkUserId,
        createdAt: savedUser.createdAt,
      },
      bankAccounts: bankAccounts.map((account) => ({
        id: account._id,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        bankName: account.bankName,
        bankAddress: account.bankAddress,
        accountCurrency: account.accountCurrency,
        swiftCode: account.swiftCode,
        iban: account.iban,
        sortCode: account.sortCode,
        balance: account.balance,
        createdAt: account.createdAt,
      })),
      transactions: transactions.map((transaction) => ({
        id: transaction._id,
        date: transaction.date,
        status: transaction.status,
        reference: transaction.reference,
        from: transaction.from,
        to: transaction.to,
        transactionType: transaction.transactionType,
        currency: transaction.currency,
        amount: transaction.amount,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
      })),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating account:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "User with this email or username already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}

/**
 * Checks if a user exists by email or username
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function checkUser(req, res) {
  try {
    const { email, username } = req.body;

    // Validate input - at least one identifier must be provided
    if (!email && !username) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide either an email or username to search for a user",
      });
    }

    // Build search query
    const searchQuery = {};
    if (email) searchQuery.email = email.toLowerCase();
    if (username) searchQuery.username = username.toLowerCase();

    const user = await User.findOne(searchQuery).select(
      "firstName lastName email username",
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist, please try again",
      });
    }

    // Return user's full name
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: {
        fullName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later",
    });
  }
}

/**
 * Creates or updates a user's transaction PIN
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function createUserTransactionPin(req, res) {
  try {
    const { pin } = req.body;

    // Validate required fields
    if (!pin) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: pin",
      });
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        error: "PIN must be exactly 4 digits",
      });
    }

    // Hash and update PIN
    const hashedPin = await bcrypt.hash(pin, 12);
    req.user.transactionPin = hashedPin;
    await req.user.save();

    // Build response
    const response = {
      success: true,
      message: "Transaction PIN updated successfully",
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        email: req.user.email,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating transaction PIN:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * Checks if a user has a transaction PIN set
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function checkTransactionPin(req, res) {
  try {
    // Get user from middleware (already authenticated)
    const user = req.user;

    // Check if transactionPin exists and is not empty
    const hasPin = user.transactionPin && user.transactionPin.trim() !== "";

    res.status(200).json({
      success: true,
      hasTransactionPin: hasPin,
    });
  } catch (error) {
    console.error("Error checking transaction PIN:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
