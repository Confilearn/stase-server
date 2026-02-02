/**
 * Test script for createUserTransactionPin API endpoint
 * Tests transaction PIN creation and update functionality
 */

const BASE_URL = "http://localhost:3000/api";

// Test user token (replace with actual token / clerkId from your auth system)
const TEST_TOKEN = "user_1770028912566_t72t1i8y8";

const testCreateUserTransactionPin = async () => {
  console.log("🔐 Testing createUserTransactionPin API endpoint...\n");

  // Test 1: Create/update transaction PIN
  console.log("🔑 Test 1: Create/update transaction PIN");
  try {
    const pinResponse = await fetch(`${BASE_URL}/auth/create-transaction-pin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify({
        pin: "5678",
      }),
    });

    const pinData = await pinResponse.json();

    if (pinResponse.ok) {
      console.log("✅ Transaction PIN created/updated successfully!");
      console.log("👤 User Info:");
      console.log(
        `   Name: ${pinData.user.firstName} ${pinData.user.lastName}`,
      );
      console.log(`   Username: ${pinData.user.username}`);
      console.log(`   Email: ${pinData.user.email}`);
      console.log("📝 Message:", pinData.message);
    } else {
      console.error("❌ PIN creation failed:", pinData.error);
    }
  } catch (error) {
    console.error("💥 Error creating PIN:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Invalid PIN format (non-numeric)
  console.log("❌ Test 2: Invalid PIN format (non-numeric)");
  try {
    const invalidPinResponse = await fetch(
      `${BASE_URL}/auth/create-transaction-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          pin: "abcd",
        }),
      },
    );

    const invalidPinData = await invalidPinResponse.json();

    if (invalidPinResponse.ok) {
      console.log("❌ Unexpected: Invalid PIN format succeeded!");
    } else {
      console.log("✅ Expected: Invalid PIN format failed");
      console.log("📝 Error:", invalidPinData.error);
    }
  } catch (error) {
    console.error("💥 Error with invalid PIN format:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Invalid PIN length (too short)
  console.log("📏 Test 3: Invalid PIN length (too short)");
  try {
    const shortPinResponse = await fetch(
      `${BASE_URL}/auth/create-transaction-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          pin: "123",
        }),
      },
    );

    const shortPinData = await shortPinResponse.json();

    if (shortPinResponse.ok) {
      console.log("❌ Unexpected: Short PIN succeeded!");
    } else {
      console.log("✅ Expected: Short PIN failed");
      console.log("📝 Error:", shortPinData.error);
    }
  } catch (error) {
    console.error("💥 Error with short PIN:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Invalid PIN length (too long)
  console.log("📏 Test 4: Invalid PIN length (too long)");
  try {
    const longPinResponse = await fetch(
      `${BASE_URL}/auth/create-transaction-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({
          pin: "12345",
        }),
      },
    );

    const longPinData = await longPinResponse.json();

    if (longPinResponse.ok) {
      console.log("❌ Unexpected: Long PIN succeeded!");
    } else {
      console.log("✅ Expected: Long PIN failed");
      console.log("📝 Error:", longPinData.error);
    }
  } catch (error) {
    console.error("💥 Error with long PIN:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 5: Missing PIN
  console.log("❌ Test 5: Missing PIN");
  try {
    const missingPinResponse = await fetch(
      `${BASE_URL}/auth/create-transaction-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
        body: JSON.stringify({}),
      },
    );

    const missingPinData = await missingPinResponse.json();

    if (missingPinResponse.ok) {
      console.log("❌ Unexpected: Missing PIN succeeded!");
    } else {
      console.log("✅ Expected: Missing PIN failed");
      console.log("📝 Error:", missingPinData.error);
    }
  } catch (error) {
    console.error("💥 Error with missing PIN:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 6: Unauthorized request (no token)
  console.log("🔒 Test 6: Unauthorized request (no token)");
  try {
    const unauthorizedResponse = await fetch(
      `${BASE_URL}/auth/create-transaction-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin: "9999",
        }),
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

  console.log("\n🎉 Create user transaction PIN tests completed!");
};

// Run the test
testCreateUserTransactionPin();

export { testCreateUserTransactionPin };
