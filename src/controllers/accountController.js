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

/**
 * Account controller for managing user bank accounts and fetching account details
 * Handles account creation, balance management, and account information retrieval
 */

/**
 * Fetches complete user details including bank accounts and transactions
 * @param {Request} req - Express request object (with authenticated user)
 * @param {Response} res - Express response object
 */
export async function fetchUserDetails(req, res) {
  try {
    const user = req.user;

    // Fetch all bank accounts for this user
    const bankAccounts = await BankAccount.find({ userId: user._id });

    // Fetch all transactions where user is sender or receiver
    const transactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).sort({ date: -1 });

    // Helper function to get username by user ID
    const getUsernameById = async (userId) => {
      if (!userId) return null;
      try {
        const user = await User.findById(userId);
        return user ? user.username : null;
      } catch (error) {
        console.error("Error fetching username:", error);
        return null;
      }
    };

    // Populate usernames for transactions
    const transactionsWithUsernames = await Promise.all(
      transactions.map(async (transaction) => {
        const fromUsername = await getUsernameById(transaction.from);
        const toUsername = await getUsernameById(transaction.to);

        return {
          id: transaction._id,
          date: transaction.date,
          status: transaction.status,
          reference: transaction.reference,
          from: fromUsername,
          to: toUsername,
          transactionType: transaction.transactionType,
          currency: transaction.currency,
          amount: transaction.amount,
          metadata: transaction.metadata,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        };
      }),
    );

    // Build response
    const response = {
      success: true,
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
        updatedAt: account.updatedAt,
      })),
      transactions: transactionsWithUsernames,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * Creates bank accounts for a user in all supported currencies
 * This is typically called after user registration
 * @param {string} userId - User ID to create accounts for
 * @param {string} firstName - User's first name for account naming
 * @param {string} lastName - User's last name for account naming
 * @returns {Promise<Array>} Array of created bank accounts
 */
export async function createBankAccounts(userId, firstName, lastName) {
  const bankAccounts = [];

  for (const currency of SUPPORTED_CURRENCIES) {
    const bankAccount = new BankAccount({
      userId: userId,
      accountNumber: generateAccountNumber(currency),
      accountName: `${firstName} ${lastName}`,
      bankName: getBankName(currency),
      bankAddress: getBankAddress(currency),
      accountCurrency: currency,
      swiftCode: getSwiftCode(currency),
      ...(currency === "EUR" && { iban: generateIBAN() }),
      ...(currency === "GBP" && { sortCode: generateSortCode() }),
    });

    const savedAccount = await bankAccount.save();
    bankAccounts.push(savedAccount);
  }

  return bankAccounts;
}

/**
 * Gets a user's bank account for a specific currency
 * @param {string} userId - User ID
 * @param {string} currency - Currency code
 * @returns {Promise<Object>} Bank account document
 */
export async function getUserAccount(userId, currency) {
  return await BankAccount.findOne({
    userId: userId,
    accountCurrency: currency,
  });
}

/**
 * Updates account balance atomically
 * @param {string} userId - User ID
 * @param {string} currency - Currency code
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 * @returns {Promise<Object>} Updated bank account
 */
export async function updateAccountBalance(userId, currency, amount) {
  return await BankAccount.findOneAndUpdate(
    { userId: userId, accountCurrency: currency },
    { $inc: { balance: amount } },
    { new: true },
  );
}
