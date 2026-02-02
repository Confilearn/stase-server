import mongoose from "mongoose";

/**
 * Transaction status options
 */
const TRANSACTION_STATUS = ["completed", "pending", "failed"];

/**
 * Transaction type options
 */
const TRANSACTION_TYPES = [
  "convert",
  "withdraw", 
  "deposit",
  "send",
  "receive"
];

/**
 * Supported transaction currencies
 */
const SUPPORTED_CURRENCIES = ["USD", "CAD", "EUR", "GBP"];

/**
 * Transaction schema for the Stase fintech application
 * Defines the structure for all financial transactions
 */
const TransactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: TRANSACTION_STATUS,
      default: "pending",
      index: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    transactionType: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      enum: SUPPORTED_CURRENCIES,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Transaction model - represents a financial transaction in the Stase system
 */
const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
