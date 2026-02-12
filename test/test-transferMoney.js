/**
 * Test script for transferMoney API endpoint
 * Tests money transfer functionality between users
 */

const testTransferMoney = async () => {
  const baseUrl = "http://localhost:3000/api";

  // Test user token (replace with actual token / clerkId from your auth system)
  const SENDER_TOKEN = "user_1770028912566_t72t1i8y8";
  const RECEIVER_EMAIL = "john.doe@example.com";
  const RECEIVER_USERNAME = "johndoe";

  console.log("💸 Testing transferMoney API endpoint...\n");

  // Test 1: Transfer money by email
  console.log("📧 Test 1: Transfer money by email");
  try {
    const emailTransferResponse = await fetch(
      `${baseUrl}/transactions/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDER_TOKEN}`,
        },
        body: JSON.stringify({
          email: RECEIVER_EMAIL,
          accountCurrency: "USD",
          amount: 50,
        }),
      },
    );

    const emailTransferData = await emailTransferResponse.json();

    if (emailTransferResponse.ok) {
      console.log("✅ Transfer by email successful!");
      console.log(
        "💰 Amount:",
        emailTransferData.data.amount,
        emailTransferData.data.currency,
      );
      console.log("🆔 Reference:", emailTransferData.data.transactionReference);
      console.log("👤 From:", emailTransferData.data.sender.name);
      console.log("👤 To:", emailTransferData.data.receiver.name);
      console.log(
        "💳 Sender New Balance:",
        emailTransferData.data.sender.newBalance,
      );
      console.log(
        "💳 Receiver New Balance:",
        emailTransferData.data.receiver.newBalance,
      );
      console.log("⏰ Timestamp:", emailTransferData.data.timestamp);
    } else {
      console.error("❌ Transfer by email failed:", emailTransferData.message);
    }
  } catch (error) {
    console.error("💥 Error during email transfer:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Transfer money by username
  console.log("👤 Test 2: Transfer money by username");
  try {
    const usernameTransferResponse = await fetch(
      `${baseUrl}/transactions/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDER_TOKEN}`,
        },
        body: JSON.stringify({
          username: RECEIVER_USERNAME,
          accountCurrency: "USD",
          amount: 25,
        }),
      },
    );

    const usernameTransferData = await usernameTransferResponse.json();

    if (usernameTransferResponse.ok) {
      console.log("✅ Transfer by username successful!");
      console.log(
        "💰 Amount:",
        usernameTransferData.data.amount,
        usernameTransferData.data.currency,
      );
      console.log(
        "🆔 Reference:",
        usernameTransferData.data.transactionReference,
      );
      console.log("👤 From:", usernameTransferData.data.sender.name);
      console.log("👤 To:", usernameTransferData.data.receiver.name);
      console.log(
        "💳 Sender New Balance:",
        usernameTransferData.data.sender.newBalance,
      );
      console.log(
        "💳 Receiver New Balance:",
        usernameTransferData.data.receiver.newBalance,
      );
      console.log("⏰ Timestamp:", usernameTransferData.data.timestamp);
    } else {
      console.error(
        "❌ Transfer by username failed:",
        usernameTransferData.message,
      );
    }
  } catch (error) {
    console.error("💥 Error during username transfer:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Transfer to non-existent user
  console.log("❌ Test 3: Transfer to non-existent user");
  try {
    const nonExistentTransferResponse = await fetch(
      `${baseUrl}/transactions/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDER_TOKEN}`,
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          accountCurrency: "USD",
          amount: 10,
        }),
      },
    );

    const nonExistentTransferData = await nonExistentTransferResponse.json();

    if (nonExistentTransferResponse.ok) {
      console.log("❌ Unexpected: Transfer to non-existent user succeeded!");
    } else {
      console.log("✅ Expected: Transfer to non-existent user failed");
      console.log("📝 Message:", nonExistentTransferData.message);
    }
  } catch (error) {
    console.error("💥 Error during non-existent user transfer:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Transfer insufficient funds
  console.log("💸 Test 4: Transfer insufficient funds");
  try {
    const insufficientFundsResponse = await fetch(
      `${baseUrl}/transactions/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDER_TOKEN}`,
        },
        body: JSON.stringify({
          email: RECEIVER_EMAIL,
          accountCurrency: "USD",
          amount: 10000,
        }),
      },
    );

    const insufficientFundsData = await insufficientFundsResponse.json();

    if (insufficientFundsResponse.ok) {
      console.log("❌ Unexpected: Transfer with insufficient funds succeeded!");
    } else {
      console.log("✅ Expected: Transfer with insufficient funds failed");
      console.log("📝 Message:", insufficientFundsData.message);
    }
  } catch (error) {
    console.error(
      "💥 Error during insufficient funds transfer:",
      error.message,
    );
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 5: Transfer to self (should fail)
  console.log("🔄 Test 5: Transfer to self");
  try {
    const selfTransferResponse = await fetch(
      `${baseUrl}/transactions/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDER_TOKEN}`,
        },
        body: JSON.stringify({
          email: "john.doe@example.com", // Assuming this is the sender's email
          accountCurrency: "USD",
          amount: 10,
        }),
      },
    );

    const selfTransferData = await selfTransferResponse.json();

    if (selfTransferResponse.ok) {
      console.log("❌ Unexpected: Transfer to self succeeded!");
    } else {
      console.log("✅ Expected: Transfer to self failed");
      console.log("📝 Message:", selfTransferData.message);
    }
  } catch (error) {
    console.error("💥 Error during self transfer test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 6: Transfer different currencies
  console.log("🌍 Test 6: Transfer different currencies");
  const currencies = ["USD", "CAD", "EUR", "GBP"];

  for (const currency of currencies) {
    try {
      const currencyTransferResponse = await fetch(
        `${baseUrl}/transactions/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SENDER_TOKEN}`,
          },
          body: JSON.stringify({
            email: RECEIVER_EMAIL,
            accountCurrency: currency,
            amount: 10,
          }),
        },
      );

      const currencyTransferData = await currencyTransferResponse.json();

      if (currencyTransferResponse.ok) {
        console.log(`✅ ${currency} transfer successful!`);
        console.log(
          `   Sender Balance: ${currencyTransferData.data.sender.newBalance}`,
        );
        console.log(
          `   Receiver Balance: ${currencyTransferData.data.receiver.newBalance}`,
        );
      } else {
        console.log(
          `❌ ${currency} transfer failed:`,
          currencyTransferData.message,
        );
      }
    } catch (error) {
      console.error(`💥 Error during ${currency} transfer:`, error.message);
    }
  }

  console.log("\n🎉 Transfer money tests completed!");
};

// Run the test
testTransferMoney();

export { testTransferMoney };
