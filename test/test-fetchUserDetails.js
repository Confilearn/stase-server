/**
 * Test script for fetchUserDetails API endpoint
 * Tests user details retrieval including accounts and transactions
 */

const BASE_URL = "http://localhost:3000/api";

// Test user token (replace with actual token / clerkId from your auth system)
const TEST_TOKEN = "user_1770028912566_t72t1i8y8";

const testFetchUserDetails = async () => {
  console.log("👤 Testing fetchUserDetails API endpoint...\n");

  // Test 1: Fetch user details successfully
  console.log("📊 Test 1: Fetch user details successfully");
  try {
    const response = await fetch(`${BASE_URL}/account/user-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ User details fetched successfully!");

      // Display user information
      console.log("👤 User Information:");
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Name: ${data.user.firstName} ${data.user.lastName}`);
      console.log(`   Username: ${data.user.username}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Clerk ID: ${data.user.clerkUserId}`);
      console.log(`   Created: ${data.user.createdAt}`);

      // Display bank accounts
      console.log("\n💳 Bank Accounts:");
      if (data.bankAccounts && data.bankAccounts.length > 0) {
        data.bankAccounts.forEach((account, index) => {
          console.log(`   ${index + 1}. ${account.accountCurrency} Account`);
          console.log(`      Account Number: ${account.accountNumber}`);
          console.log(`      Account Name: ${account.accountName}`);
          console.log(`      Bank: ${account.bankName}`);
          console.log(`      Balance: $${account.balance}`);
          console.log(`      IBAN: ${account.iban || "N/A"}`);
          console.log(`      SWIFT: ${account.swiftCode}`);
          console.log(`      Created: ${account.createdAt}`);
        });
      } else {
        console.log("   No bank accounts found");
      }

      // Display transactions
      console.log("\n📄 Recent Transactions:");
      if (data.transactions && data.transactions.length > 0) {
        data.transactions.slice(0, 5).forEach((transaction, index) => {
          console.log(
            `   ${index + 1}. ${transaction.transactionType.toUpperCase()} - ${transaction.currency} ${transaction.amount}`,
          );
          console.log(`      Reference: ${transaction.reference}`);
          console.log(`      Status: ${transaction.status}`);
          console.log(`      Date: ${transaction.date}`);
          console.log(`      From: ${transaction.from || "External"}`);
          console.log(`      To: ${transaction.to || "External"}`);
        });

        if (data.transactions.length > 5) {
          console.log(
            `   ... and ${data.transactions.length - 5} more transactions`,
          );
        }
      } else {
        console.log("   No transactions found");
      }

      console.log(`\n📈 Summary:`);
      console.log(`   Total Accounts: ${data.bankAccounts?.length || 0}`);
      console.log(`   Total Transactions: ${data.transactions?.length || 0}`);

      // Calculate total balance across all currencies
      if (data.bankAccounts && data.bankAccounts.length > 0) {
        const totalBalance = data.bankAccounts.reduce(
          (sum, account) => sum + account.balance,
          0,
        );
        console.log(
          `   Total Balance (USD equivalent): $${totalBalance.toFixed(2)}`,
        );
      }
    } else {
      console.error("❌ Failed to fetch user details:", data.error);
    }
  } catch (error) {
    console.error("💥 Error fetching user details:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Unauthorized request (no token)
  console.log("🔒 Test 2: Unauthorized request (no token)");
  try {
    const unauthorizedResponse = await fetch(
      `${BASE_URL}/account/user-details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const unauthorizedData = await unauthorizedResponse.json();

    if (unauthorizedResponse.ok) {
      console.log("❌ Unexpected: Unauthorized request succeeded!");
    } else {
      console.log("✅ Expected: Unauthorized request failed");
      console.log("📝 Error:", unauthorizedData.error);
    }
  } catch (error) {
    console.error("💥 Error with unauthorized request:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Invalid token
  console.log("🚫 Test 3: Invalid token");
  try {
    const invalidTokenResponse = await fetch(
      `${BASE_URL}/account/user-details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid_token_12345",
        },
      },
    );

    const invalidTokenData = await invalidTokenResponse.json();

    if (invalidTokenResponse.ok) {
      console.log("❌ Unexpected: Invalid token succeeded!");
    } else {
      console.log("✅ Expected: Invalid token failed");
      console.log("📝 Error:", invalidTokenData.error);
    }
  } catch (error) {
    console.error("💥 Error with invalid token:", error.message);
  }

  console.log("\n🎉 Fetch user details tests completed!");
};

// Run the test
testFetchUserDetails();

export { testFetchUserDetails };
