/**
 * Test script for depositMoney and withdrawMoney API endpoints
 * Tests deposit and withdrawal functionality with PIN verification
 */

const BASE_URL = "http://localhost:3000/api";

// Test user token (replace with actual token / clerkId from your auth system)
const TEST_TOKEN = "user_1770028912566_t72t1i8y8";

const testDepositWithdraw = async () => {
  console.log("💰 Testing deposit and withdraw API endpoints...\n");

  // Test 1: Deposit money
  console.log("📥 Test 1: Deposit money");
  try {
    const depositResponse = await fetch(`${BASE_URL}/transactions/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        amount: 500,
        accountCurrency: "USD",
        transactionPin: "5678",
      }),
    });

    const depositData = await depositResponse.json();

    if (depositResponse.ok) {
      console.log("✅ Deposit successful!");
      console.log(
        "💵 Amount:",
        depositData.data.amount,
        depositData.data.currency,
      );
      console.log("🆔 Reference:", depositData.data.reference);
      console.log("💳 New Balance:", depositData.data.newBalance);
      console.log("⏰ Timestamp:", depositData.data.timestamp);
    } else {
      console.error("❌ Deposit failed:", depositData.error);
    }
  } catch (error) {
    console.error("💥 Error during deposit:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Withdraw money
  console.log("📤 Test 2: Withdraw money");
  try {
    const withdrawResponse = await fetch(`${BASE_URL}/transactions/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        amount: 200,
        accountCurrency: "USD",
        transactionPin: "5678",
      }),
    });

    const withdrawData = await withdrawResponse.json();

    if (withdrawResponse.ok) {
      console.log("✅ Withdrawal successful!");
      console.log(
        "💵 Amount:",
        withdrawData.data.amount,
        withdrawData.data.currency,
      );
      console.log("🆔 Reference:", withdrawData.data.reference);
      console.log("💳 New Balance:", withdrawData.data.newBalance);
      console.log("⏰ Timestamp:", withdrawData.data.timestamp);
    } else {
      console.error("❌ Withdrawal failed:", withdrawData.error);
    }
  } catch (error) {
    console.error("💥 Error during withdrawal:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Deposit with invalid PIN
  console.log("🔒 Test 3: Deposit with invalid PIN");
  try {
    const invalidPinResponse = await fetch(`${BASE_URL}/transactions/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        amount: 100,
        accountCurrency: "USD",
        transactionPin: "9999",
      }),
    });

    const invalidPinData = await invalidPinResponse.json();

    if (invalidPinResponse.ok) {
      console.log("❌ Unexpected: Deposit with invalid PIN succeeded!");
    } else {
      console.log("✅ Expected: Deposit with invalid PIN failed");
      console.log("📝 Error:", invalidPinData.error);
    }
  } catch (error) {
    console.error("💥 Error during invalid PIN test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Withdraw insufficient funds
  console.log("💸 Test 4: Withdraw insufficient funds");
  try {
    const insufficientFundsResponse = await fetch(
      `${BASE_URL}/transactions/withdraw`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          amount: 10000,
          accountCurrency: "USD",
          transactionPin: "1234",
        }),
      },
    );

    const insufficientFundsData = await insufficientFundsResponse.json();

    if (insufficientFundsResponse.ok) {
      console.log(
        "❌ Unexpected: Withdrawal with insufficient funds succeeded!",
      );
    } else {
      console.log("✅ Expected: Withdrawal with insufficient funds failed");
      console.log("📝 Error:", insufficientFundsData.error);
      if (insufficientFundsData.details) {
        console.log(
          "💰 Details:",
          JSON.stringify(insufficientFundsData.details, null, 2),
        );
      }
    }
  } catch (error) {
    console.error("💥 Error during insufficient funds test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 5: Deposit to different currencies
  console.log("🌍 Test 5: Deposit to different currencies");
  const currencies = ["USD", "CAD", "EUR", "GBP"];

  for (const currency of currencies) {
    try {
      const currencyResponse = await fetch(`${BASE_URL}/transactions/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          amount: 100,
          accountCurrency: currency,
          transactionPin: "5678",
        }),
      });

      const currencyData = await currencyResponse.json();

      if (currencyResponse.ok) {
        console.log(
          `✅ ${currency} deposit successful! New Balance: ${currencyData.data.newBalance}`,
        );
      } else {
        console.log(`❌ ${currency} deposit failed:`, currencyData.error);
      }
    } catch (error) {
      console.error(`💥 Error during ${currency} deposit:`, error.message);
    }
  }

  console.log("\n🎉 Deposit and withdraw tests completed!");
};

// Run the test
testDepositWithdraw();

export { testDepositWithdraw };
