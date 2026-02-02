import mongoose from "mongoose";

/**
 * Supported account currencies in Stase
 * Each user can have one account per currency
 */
const SUPPORTED_CURRENCIES = ["USD", "CAD", "EUR", "GBP"];

/**
 * BankAccount schema for the Stase fintech application
 * Defines the structure for user bank accounts across different currencies
 */
const BankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    iban: {
      type: String,
      trim: true,
    },
    sortCode: {
      type: String,
      trim: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    swiftCode: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    bankAddress: {
      type: String,
      trim: true,
    },
    accountCurrency: {
      type: String,
      required: true,
      enum: SUPPORTED_CURRENCIES,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure each user can only have one account per currency
BankAccountSchema.index({ userId: 1, accountCurrency: 1 }, { unique: true });

/**
 * BankAccount model - represents a user's bank account for a specific currency
 */
const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

export default BankAccount;
