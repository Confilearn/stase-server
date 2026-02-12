/**
 * Test script for createAccount API endpoint
 * Tests user account creation functionality
 */

// NOTE: To create another user in the database, change the test user token and update the body of the testCreateAccount route

// Test user token (replace with actual token / clerkId from your auth system)
const TEST_TOKEN = "user_1770028912566_t72t1i8y8";

const testCreateAccount = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/create-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          firstName: "Confidence",
          lastName: "Emeka",
          username: "confidence",
          email: "confidence@example.com",
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Account created successfully!");
      console.log("📊 User Data:", JSON.stringify(data.user, null, 2));
      console.log(
        "💳 Bank Accounts:",
        data.bankAccounts?.length || 0,
        "accounts created",
      );

      if (data.bankAccounts && data.bankAccounts.length > 0) {
        console.log("💰 Account Details:");
        data.bankAccounts.forEach((account, index) => {
          console.log(
            `   ${index + 1}. ${account.accountCurrency}: $${account.balance} (${account.accountNumber})`,
          );
        });
      }

      console.log(
        "🔄 Transactions:",
        data.transactions?.length || 0,
        "transactions",
      );
      return data;
    } else {
      console.error("❌ Failed to create account:", data.error || data.message);
      return null;
    }
  } catch (error) {
    console.error("💥 Error testing createAccount:", error.message);
    return null;
  }
};

// Run the test
testCreateAccount();

export { testCreateAccount };
