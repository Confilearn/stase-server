/**
 * Test script for convertMoney API endpoint
 * This script tests currency conversion between different account currencies
 */

const BASE_URL = "http://localhost:3000/api";

// Test user token (replace with actual token / clerkId from your auth system)
const TEST_TOKEN = "user_1770028912566_t72t1i8y8";

const testConvertMoney = async () => {
  console.log("💱 Testing convertMoney API endpoint...\n");

  // Test 1: Convert USD to CAD
  console.log("🇺🇸→🇨🇦 Test 1: Convert USD to CAD");
  try {
    const convertResponse = await fetch(`${BASE_URL}/transactions/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        convertFromAmount: 100,
        convertFromAccountCurrency: "USD",
        convertToAmount: 136, // 100 USD * 1.36 CAD rate
        convertToAccountCurrency: "CAD",
        currencyPairs: "USD-CAD",
      }),
    });

    const convertData = await convertResponse.json();

    if (convertResponse.ok) {
      console.log("✅ Conversion successful!");
      console.log("💰 Conversion Details:");
      console.log(
        `   From: ${convertData.data.conversionDetails.convertFromAmount} ${convertData.data.conversionDetails.convertFromAccountCurrency}`,
      );
      console.log(
        `   To: ${convertData.data.conversionDetails.convertToAmount} ${convertData.data.conversionDetails.convertToAccountCurrency}`,
      );
      console.log(
        `   Rate: ${convertData.data.conversionDetails.exchangeRate}`,
      );
      console.log("💳 Updated Accounts:");
      console.log(
        `   Source Account (${convertData.data.updatedAccounts.sourceAccount.accountCurrency}):`,
      );
      console.log(
        `     Previous: ${convertData.data.updatedAccounts.sourceAccount.previousBalance}`,
      );
      console.log(
        `     New: ${convertData.data.updatedAccounts.sourceAccount.balance}`,
      );
      console.log(
        `   Target Account (${convertData.data.updatedAccounts.targetAccount.accountCurrency}):`,
      );
      console.log(
        `     Previous: ${convertData.data.updatedAccounts.targetAccount.previousBalance}`,
      );
      console.log(
        `     New: ${convertData.data.updatedAccounts.targetAccount.balance}`,
      );
      console.log("📄 Transactions:");
      console.log(
        `   Debit: ${convertData.data.transactions.debitTransaction.reference}`,
      );
      console.log(
        `   Credit: ${convertData.data.transactions.creditTransaction.reference}`,
      );
    } else {
      console.error("❌ Conversion failed:", convertData.message);
    }
  } catch (error) {
    console.error("💥 Error during conversion:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Convert EUR to GBP
  console.log("🇪🇺→🇬🇧 Test 2: Convert EUR to GBP");
  try {
    const convertResponse = await fetch(`${BASE_URL}/transactions/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        convertFromAmount: 85,
        convertFromAccountCurrency: "EUR",
        convertToAmount: 100, // 85 EUR / 0.85 * 0.73 = 73 GBP (approximately)
        convertToAccountCurrency: "GBP",
        currencyPairs: "EUR-GBP",
      }),
    });

    const convertData = await convertResponse.json();

    if (convertResponse.ok) {
      console.log("✅ Conversion successful!");
      console.log("💰 Conversion Details:");
      console.log(
        `   From: ${convertData.data.conversionDetails.convertFromAmount} ${convertData.data.conversionDetails.convertFromAccountCurrency}`,
      );
      console.log(
        `   To: ${convertData.data.conversionDetails.convertToAmount} ${convertData.data.conversionDetails.convertToAccountCurrency}`,
      );
      console.log(
        `   Rate: ${convertData.data.conversionDetails.exchangeRate}`,
      );
    } else {
      console.error("❌ Conversion failed:", convertData.message);
    }
  } catch (error) {
    console.error("💥 Error during conversion:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Invalid currency pair
  console.log("❌ Test 3: Invalid currency pair");
  try {
    const invalidResponse = await fetch(`${BASE_URL}/transactions/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        convertFromAmount: 100,
        convertFromAccountCurrency: "USD",
        convertToAmount: 100,
        convertToAccountCurrency: "XYZ", // Invalid currency
        currencyPairs: "USD-XYZ",
      }),
    });

    const invalidData = await invalidResponse.json();

    if (invalidResponse.ok) {
      console.log("❌ Unexpected: Invalid currency conversion succeeded!");
    } else {
      console.log("✅ Expected: Invalid currency conversion failed");
      console.log("📝 Message:", invalidData.message);
    }
  } catch (error) {
    console.error("💥 Error during invalid currency test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Mismatched currency pair
  console.log("⚠️ Test 4: Mismatched currency pair");
  try {
    const mismatchResponse = await fetch(`${BASE_URL}/transactions/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        convertFromAmount: 100,
        convertFromAccountCurrency: "USD",
        convertToAmount: 136,
        convertToAccountCurrency: "CAD",
        currencyPairs: "USD-EUR", // Mismatched pair
      }),
    });

    const mismatchData = await mismatchResponse.json();

    if (mismatchResponse.ok) {
      console.log("❌ Unexpected: Mismatched currency pair succeeded!");
    } else {
      console.log("✅ Expected: Mismatched currency pair failed");
      console.log("📝 Message:", mismatchData.message);
    }
  } catch (error) {
    console.error("💥 Error during mismatched pair test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 5: Invalid conversion rate
  console.log("🔢 Test 5: Invalid conversion rate");
  try {
    const invalidRateResponse = await fetch(
      `${BASE_URL}/transactions/convert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          convertFromAmount: 100,
          convertFromAccountCurrency: "USD",
          convertToAmount: 200, // Wrong rate (should be 136)
          convertToAccountCurrency: "CAD",
          currencyPairs: "USD-CAD",
        }),
      },
    );

    const invalidRateData = await invalidRateResponse.json();

    if (invalidRateResponse.ok) {
      console.log("❌ Unexpected: Invalid conversion rate succeeded!");
    } else {
      console.log("✅ Expected: Invalid conversion rate failed");
      console.log("📝 Message:", invalidRateData.message);
    }
  } catch (error) {
    console.error("💥 Error during invalid rate test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 6: Insufficient balance
  console.log("💸 Test 6: Insufficient balance");
  try {
    const insufficientResponse = await fetch(
      `${BASE_URL}/transactions/convert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          convertFromAmount: 10000, // Large amount
          convertFromAccountCurrency: "USD",
          convertToAmount: 13600,
          convertToAccountCurrency: "CAD",
          currencyPairs: "USD-CAD",
        }),
      },
    );

    const insufficientData = await insufficientResponse.json();

    if (insufficientResponse.ok) {
      console.log("❌ Unexpected: Insufficient balance conversion succeeded!");
    } else {
      console.log("✅ Expected: Insufficient balance conversion failed");
      console.log("📝 Message:", insufficientData.message);
    }
  } catch (error) {
    console.error("💥 Error during insufficient balance test:", error.message);
  }

  console.log("\n🎉 Convert money tests completed!");
};

// Run the test
testConvertMoney();

export { testConvertMoney };
