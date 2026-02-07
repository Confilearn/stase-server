import mongoose from "mongoose";
import bcrypt from "bcrypt";
import BankAccount from "../models/BankAccount.js";
import Transaction from "../models/Transaction.js";
import {
  generateAccountNumber,
  generateIBAN,
  generateSortCode,
  getBankName,
  getBankAddress,
  getSwiftCode,
  SUPPORTED_CURRENCIES,
} from "../utils/accountHelpers.js";
import { isValidEmail, isValidUsername } from "../utils/validate.js";
import {
  convertCurrency,
  getExchangeRate,
  isValidCurrencyPair,
} from "../utils/currencyRates.js";
import { getUserAccount, updateAccountBalance } from "./accountController.js";

/**
 * Transaction controller for handling all financial operations
 * Manages deposits, withdrawals, transfers, and currency conversions
 */

/**
 * Processes a money deposit into user's account
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function depositMoney(req, res) {
  try {
    const { amount, accountCurrency, transactionPin } = req.body;
    const user = req.user;

    // Validate required fields
    if (!amount || !accountCurrency || !transactionPin) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: amount, accountCurrency, transactionPin",
      });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Deposit amount must be greater than 0",
      });
    }

    // Validate maximum deposit limit
    if (amount > 100000) {
      return res.status(400).json({
        success: false,
        error: "Maximum deposit limit is $100,000",
      });
    }

    // Validate currency
    if (!SUPPORTED_CURRENCIES.includes(accountCurrency)) {
      return res.status(400).json({
        success: false,
        error: "Invalid currency. Supported currencies: USD, CAD, EUR, GBP",
      });
    }

    // Verify transaction PIN
    if (!user.transactionPin) {
      return res.status(400).json({
        success: false,
        error: "Transaction PIN not set. Please set up your PIN first.",
      });
    }

    const isPinValid = await bcrypt.compare(
      transactionPin,
      user.transactionPin,
    );
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid transaction PIN",
      });
    }

    // Find user's bank account for the specified currency
    const bankAccount = await getUserAccount(user._id, accountCurrency);
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        error: `No ${accountCurrency} account found for this user`,
      });
    }

    // Update account balance
    const updatedAccount = await updateAccountBalance(
      user._id,
      accountCurrency,
      amount,
    );
    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        error: `No ${accountCurrency} account found`,
      });
    }

    const newBalance = updatedAccount.balance;
    const previousBalance = newBalance - amount;

    // Generate unique transaction reference
    const transactionReference = `DEP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create transaction record
    const transaction = new Transaction({
      date: new Date(),
      status: "completed",
      reference: transactionReference,
      from: null, // External deposit
      to: user._id,
      transactionType: "deposit",
      currency: accountCurrency,
      amount: amount,
      metadata: {
        previousBalance: previousBalance,
        newBalance: newBalance,
        description: `Deposit of ${amount} ${accountCurrency}`,
      },
    });

    await transaction.save();

    // Fetch complete user data after successful transaction
    const allBankAccounts = await BankAccount.find({ userId: user._id });
    const allTransactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).sort({ date: -1 });

    // Build response with complete user data
    const response = {
      success: true,
      message: `Successfully deposited ${amount} ${accountCurrency}`,
      data: {
        transactionId: transaction._id,
        reference: transactionReference,
        amount: amount,
        currency: accountCurrency,
        newBalance: newBalance,
        timestamp: transaction.date,
      },
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        clerkUserId: user.clerkUserId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bankAccounts: allBankAccounts.map((account) => ({
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
        updatedAt: account.updatedAt,
      })),
      transactions: allTransactions.map((transaction) => ({
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
        updatedAt: transaction.updatedAt,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process deposit",
    });
  }
}

/**
 * Processes a money withdrawal from user's account
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function withdrawMoney(req, res) {
  try {
    const { amount, accountCurrency, transactionPin } = req.body;
    const user = req.user;

    // Validate required fields
    if (!amount || !accountCurrency || !transactionPin) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: amount, accountCurrency, transactionPin",
      });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Withdrawal amount must be greater than 0",
      });
    }

    // Validate currency
    if (!SUPPORTED_CURRENCIES.includes(accountCurrency)) {
      return res.status(400).json({
        success: false,
        error: "Invalid currency. Supported currencies: USD, CAD, EUR, GBP",
      });
    }

    // Verify transaction PIN
    if (!user.transactionPin) {
      return res.status(400).json({
        success: false,
        error: "Transaction PIN not set. Please set up your PIN first.",
      });
    }

    const isPinValid = await bcrypt.compare(
      transactionPin,
      user.transactionPin,
    );
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid transaction PIN",
      });
    }

    // Find user's bank account for the specified currency
    const bankAccount = await getUserAccount(user._id, accountCurrency);
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        error: `No ${accountCurrency} account found for this user`,
      });
    }

    // Check sufficient funds
    if (amount > bankAccount.balance) {
      return res.status(400).json({
        success: false,
        error: "Insufficient funds",
        details: {
          requestedAmount: amount,
          availableBalance: bankAccount.balance,
          currency: accountCurrency,
        },
      });
    }

    // Update account balance
    const updatedAccount = await updateAccountBalance(
      user._id,
      accountCurrency,
      -amount,
    );
    const newBalance = updatedAccount.balance;

    // Generate unique transaction reference
    const transactionReference = `WTH-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create transaction record
    const transaction = new Transaction({
      date: new Date(),
      status: "completed",
      reference: transactionReference,
      from: user._id,
      to: null, // External withdrawal
      transactionType: "withdraw",
      currency: accountCurrency,
      amount: amount,
      metadata: {
        previousBalance: bankAccount.balance,
        newBalance: newBalance,
        description: `Withdrawal of ${amount} ${accountCurrency}`,
      },
    });

    await transaction.save();

    // Fetch complete user data after successful transaction
    const allBankAccounts = await BankAccount.find({ userId: user._id });
    const allTransactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).sort({ date: -1 });

    // Build response with complete user data
    const response = {
      success: true,
      message: `Successfully withdrew ${amount} ${accountCurrency}`,
      data: {
        transactionId: transaction._id,
        reference: transactionReference,
        amount: amount,
        currency: accountCurrency,
        newBalance: newBalance,
        timestamp: transaction.date,
      },
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        clerkUserId: user.clerkUserId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bankAccounts: allBankAccounts.map((account) => ({
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
        updatedAt: account.updatedAt,
      })),
      transactions: allTransactions.map((transaction) => ({
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
        updatedAt: transaction.updatedAt,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process withdrawal",
    });
  }
}

/**
 * Processes money transfer between users
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function transferMoney(req, res) {
  const session = await mongoose.startSession();

  try {
    const { email, username, accountCurrency, amount } = req.body;
    const sender = req.user;

    // Validate receiver identification
    if (!email && !username) {
      return res.status(400).json({
        success: false,
        message: "Please provide either an email or username for the recipient",
      });
    }

    // Validate required fields
    if (!accountCurrency || amount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: accountCurrency and amount are required",
      });
    }

    // Validate currency
    if (!SUPPORTED_CURRENCIES.includes(accountCurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency. Supported currencies: USD, CAD, EUR, GBP",
      });
    }

    // Validate amount
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Transfer amount must be a valid number greater than zero",
      });
    }

    // Validate amount precision (max 2 decimal places)
    if (!Number.isInteger(amount * 100)) {
      return res.status(400).json({
        success: false,
        message: "Amount can have maximum 2 decimal places",
      });
    }

    // Validate email format if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format provided",
      });
    }

    // Validate username format if provided
    if (username && !isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid username format. Username must be 3-20 characters and contain only letters, numbers, and underscores",
      });
    }

    // Start transaction
    session.startTransaction();

    // Find receiver by email or username
    const receiverQuery = {};
    if (email) receiverQuery.email = email.toLowerCase();
    if (username) receiverQuery.username = username.toLowerCase();

    const receiver = await User.findOne(receiverQuery).session(session);
    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message:
          "Recipient not found. Please verify the email or username and try again",
      });
    }

    // Prevent self-transfer
    if (sender._id.toString() === receiver._id.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "You cannot transfer money to yourself",
      });
    }

    // Find sender's bank account
    const senderAccount = await BankAccount.findOne({
      userId: sender._id,
      accountCurrency: accountCurrency,
    }).session(session);

    if (!senderAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: `You don't have a ${accountCurrency} account. Please create one or select a different currency`,
      });
    }

    // Check sufficient balance
    if (senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Your ${accountCurrency} account balance is ${senderAccount.balance.toFixed(2)}`,
      });
    }

    // Find receiver's bank account
    const receiverAccount = await BankAccount.findOne({
      userId: receiver._id,
      accountCurrency: accountCurrency,
    }).session(session);

    if (!receiverAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: `Recipient doesn't have a ${accountCurrency} account. They need to create one first`,
      });
    }

    // Perform transfer
    const transactionDate = new Date();
    const senderReference = generateTransactionReference();
    const receiverReference = generateTransactionReference();

    // Update balances (use rounding to handle floating-point precision)
    senderAccount.balance =
      Math.round((senderAccount.balance - amount) * 100) / 100;
    receiverAccount.balance =
      Math.round((receiverAccount.balance + amount) * 100) / 100;

    // Save updated accounts
    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    // Create sender transaction (send)
    const senderTransaction = new Transaction({
      date: transactionDate,
      status: "completed",
      reference: senderReference,
      from: sender._id,
      to: receiver._id,
      transactionType: "send",
      currency: accountCurrency,
      amount: amount,
      metadata: {
        senderName: `${sender.firstName} ${sender.lastName}`,
        receiverName: `${receiver.firstName} ${receiver.lastName}`,
        description: `Money transfer to ${receiver.firstName} ${receiver.lastName}`,
      },
    });

    // Create receiver transaction (receive)
    const receiverTransaction = new Transaction({
      date: transactionDate,
      status: "completed",
      reference: receiverReference,
      from: sender._id,
      to: receiver._id,
      transactionType: "receive",
      currency: accountCurrency,
      amount: amount,
      metadata: {
        senderName: `${sender.firstName} ${sender.lastName}`,
        receiverName: `${receiver.firstName} ${receiver.lastName}`,
        description: `Money transfer from ${sender.firstName} ${sender.lastName}`,
      },
    });

    // Save transactions
    await senderTransaction.save({ session });
    await receiverTransaction.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Fetch complete user data after successful transaction
    const allBankAccounts = await BankAccount.find({ userId: user._id });
    const allTransactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).sort({ date: -1 });

    // Return success response with complete user data
    res.status(200).json({
      success: true,
      message: `Successfully transferred ${amount.toFixed(2)} ${accountCurrency} to ${receiver.firstName} ${receiver.lastName}`,
      data: {
        transactionReference: senderReference,
        amount: amount.toFixed(2),
        currency: accountCurrency,
        sender: {
          name: `${sender.firstName} ${sender.lastName}`,
          newBalance: senderAccount.balance.toFixed(2),
        },
        receiver: {
          name: `${receiver.firstName} ${receiver.lastName}`,
          newBalance: receiverAccount.balance.toFixed(2),
        },
        timestamp: transactionDate.toISOString(),
      },
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        clerkUserId: user.clerkUserId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bankAccounts: allBankAccounts.map((account) => ({
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
        updatedAt: account.updatedAt,
      })),
      transactions: allTransactions.map((transaction) => ({
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
        updatedAt: transaction.updatedAt,
      })),
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();

    console.error("Error transferring money:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Transaction reference conflict. Please try again",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred during the transfer. Please try again later",
    });
  } finally {
    // End session
    await session.endSession();
  }
}

/**
 * Processes currency conversion between user's accounts
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export async function convertMoney(req, res) {
  const session = await mongoose.startSession();

  try {
    const {
      convertFromAmount,
      convertFromAccountCurrency,
      convertToAmount,
      convertToAccountCurrency,
      currencyPairs,
    } = req.body;
    const user = req.user;

    // Validate required fields
    if (
      !convertFromAmount ||
      !convertFromAccountCurrency ||
      !convertToAmount ||
      !convertToAccountCurrency ||
      !currencyPairs
    ) {
      return res.status(400).json({
        success: false,
        message: "All conversion fields are required",
      });
    }

    // Validate amounts are positive numbers
    if (convertFromAmount <= 0 || convertToAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Conversion amounts must be positive numbers",
      });
    }

    // Validate currency pair format
    const expectedPair = `${convertFromAccountCurrency}-${convertToAccountCurrency}`;
    if (currencyPairs !== expectedPair) {
      return res.status(400).json({
        success: false,
        message: `Currency pair mismatch. Expected: ${expectedPair}, Provided: ${currencyPairs}`,
      });
    }

    // Validate supported currencies
    if (
      !isValidCurrencyPair(convertFromAccountCurrency, convertToAccountCurrency)
    ) {
      return res.status(400).json({
        success: false,
        message: `Unsupported currency pair: ${currencyPairs}`,
      });
    }

    // Validate conversion rate matches our static rates
    const expectedRate = getExchangeRate(
      convertFromAccountCurrency,
      convertToAccountCurrency,
    );
    const actualRate = convertToAmount / convertFromAmount;

    // Allow small rounding differences (0.001 tolerance)
    if (Math.abs(expectedRate - actualRate) > 0.001) {
      return res.status(400).json({
        success: false,
        message: `Invalid conversion rate. Expected rate: ${expectedRate}, Provided rate: ${actualRate}`,
      });
    }

    // Start transaction
    session.startTransaction();

    // Find source account
    const sourceAccount = await BankAccount.findOne({
      userId: user._id,
      accountCurrency: convertFromAccountCurrency,
    }).session(session);

    if (!sourceAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: `Source account not found for currency: ${convertFromAccountCurrency}`,
      });
    }

    // Find target account
    const targetAccount = await BankAccount.findOne({
      userId: user._id,
      accountCurrency: convertToAccountCurrency,
    }).session(session);

    if (!targetAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: `Target account not found for currency: ${convertToAccountCurrency}`,
      });
    }

    // Check if source account has sufficient balance
    if (sourceAccount.balance < convertFromAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient balance in ${convertFromAccountCurrency} account. Available: ${sourceAccount.balance}, Required: ${convertFromAmount}`,
      });
    }

    // Calculate the actual converted amount
    const actualConvertedAmount = convertCurrency(
      convertFromAmount,
      convertFromAccountCurrency,
      convertToAccountCurrency,
    );

    // Verify the calculated amount matches the requested amount
    if (Math.abs(actualConvertedAmount - convertToAmount) > 0.01) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Conversion amount mismatch. Calculated: ${actualConvertedAmount}, Requested: ${convertToAmount}`,
      });
    }

    // Update account balances atomically
    sourceAccount.balance -= convertFromAmount;
    targetAccount.balance += actualConvertedAmount;

    // Save updated account balances
    await sourceAccount.save({ session });
    await targetAccount.save({ session });

    // Create transactions
    const exchangeRate = getExchangeRate(
      convertFromAccountCurrency,
      convertToAccountCurrency,
    );
    const debitReference = generateTransactionReference();
    const creditReference = generateTransactionReference();

    // Create debit transaction for source account
    const debitTransaction = new Transaction({
      date: new Date(),
      status: "completed",
      reference: debitReference,
      from: user._id,
      to: user._id,
      transactionType: "convert",
      currency: convertFromAccountCurrency,
      amount: convertFromAmount,
      metadata: {
        conversionPair: currencyPairs,
        exchangeRate: exchangeRate,
        convertedAmount: actualConvertedAmount,
        convertedCurrency: convertToAccountCurrency,
        transactionType: "currency_conversion",
        description: `Currency conversion: ${convertFromAmount} ${convertFromAccountCurrency} → ${actualConvertedAmount} ${convertToAccountCurrency}`,
        direction: "debit",
      },
    });

    // Create credit transaction for target account
    const creditTransaction = new Transaction({
      date: new Date(),
      status: "completed",
      reference: creditReference,
      from: user._id,
      to: user._id,
      transactionType: "convert",
      currency: convertToAccountCurrency,
      amount: actualConvertedAmount,
      metadata: {
        conversionPair: currencyPairs,
        exchangeRate: exchangeRate,
        originalAmount: convertFromAmount,
        originalCurrency: convertFromAccountCurrency,
        transactionType: "currency_conversion",
        description: `Currency conversion received: ${convertFromAmount} ${convertFromAccountCurrency} → ${actualConvertedAmount} ${convertToAccountCurrency}`,
        direction: "credit",
      },
    });

    // Save both transactions
    await debitTransaction.save({ session });
    await creditTransaction.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Fetch complete user data after successful transaction
    const allBankAccounts = await BankAccount.find({ userId: user._id });
    const allTransactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).sort({ date: -1 });

    // Return success response with complete user data
    res.status(200).json({
      success: true,
      message: "Currency conversion completed successfully",
      data: {
        conversionDetails: {
          convertFromAmount,
          convertFromAccountCurrency,
          convertToAmount: actualConvertedAmount,
          convertToAccountCurrency,
          currencyPairs,
          exchangeRate,
        },
        updatedAccounts: {
          sourceAccount: {
            accountCurrency: sourceAccount.accountCurrency,
            balance: sourceAccount.balance,
            previousBalance: sourceAccount.balance + convertFromAmount,
          },
          targetAccount: {
            accountCurrency: targetAccount.accountCurrency,
            balance: targetAccount.balance,
            previousBalance: targetAccount.balance - actualConvertedAmount,
          },
        },
        transactions: {
          debitTransaction: {
            id: debitTransaction._id,
            reference: debitTransaction.reference,
            transactionType: debitTransaction.transactionType,
            amount: debitTransaction.amount,
            currency: debitTransaction.currency,
          },
          creditTransaction: {
            id: creditTransaction._id,
            reference: creditTransaction.reference,
            transactionType: creditTransaction.transactionType,
            amount: creditTransaction.amount,
            currency: creditTransaction.currency,
          },
        },
      },
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        clerkUserId: user.clerkUserId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bankAccounts: allBankAccounts.map((account) => ({
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
        updatedAt: account.updatedAt,
      })),
      transactions: allTransactions.map((transaction) => ({
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
        updatedAt: transaction.updatedAt,
      })),
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();

    console.error("Error converting currency:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Transaction reference conflict. Please try again",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred during the conversion. Please try again later",
      error: error.message,
    });
  } finally {
    // End session
    await session.endSession();
  }
}
