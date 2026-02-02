/**
 * Test script for checkUser API endpoint
 * Tests user lookup functionality by email and username
 */

const testCheckUser = async () => {
  const baseUrl = "http://localhost:3000/api";

  console.log("🔍 Testing checkUser API endpoint...\n");

  // Test 1: Check existing user by email
  console.log("📧 Test 1: Check user by email");
  try {
    const emailResponse = await fetch(`${baseUrl}/auth/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "john.doe@example.com",
      }),
    });

    const emailData = await emailResponse.json();

    if (emailResponse.ok) {
      console.log("✅ User found by email!");
      console.log("👤 User Info:", JSON.stringify(emailData.data, null, 2));
    } else {
      console.log("ℹ️ User not found by email:", emailData.message);
    }
  } catch (error) {
    console.error("💥 Error checking user by email:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Check existing user by username
  console.log("👤 Test 2: Check user by username");
  try {
    const usernameResponse = await fetch(`${baseUrl}/auth/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "johndoe",
      }),
    });

    const usernameData = await usernameResponse.json();

    if (usernameResponse.ok) {
      console.log("✅ User found by username!");
      console.log("👤 User Info:", JSON.stringify(usernameData.data, null, 2));
    } else {
      console.log("ℹ️ User not found by username:", usernameData.message);
    }
  } catch (error) {
    console.error("💥 Error checking user by username:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Check non-existent user
  console.log("❌ Test 3: Check non-existent user");
  try {
    const nonExistentResponse = await fetch(`${baseUrl}/auth/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nonexistent@example.com",
      }),
    });

    const nonExistentData = await nonExistentResponse.json();

    if (nonExistentResponse.ok) {
      console.log("✅ Unexpected: Non-existent user found!");
    } else {
      console.log("✅ Expected: Non-existent user not found");
      console.log("📝 Message:", nonExistentData.message);
    }
  } catch (error) {
    console.error("💥 Error checking non-existent user:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Invalid request (no email or username)
  console.log("⚠️ Test 4: Invalid request (no parameters)");
  try {
    const invalidResponse = await fetch(`${baseUrl}/auth/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const invalidData = await invalidResponse.json();

    if (invalidResponse.ok) {
      console.log("❌ Unexpected: Invalid request succeeded!");
    } else {
      console.log("✅ Expected: Invalid request failed");
      console.log("📝 Error:", invalidData.error || invalidData.message);
    }
  } catch (error) {
    console.error("💥 Error with invalid request:", error.message);
  }

  console.log("\n🎉 checkUser tests completed!");
};

// Run the test
testCheckUser();

export { testCheckUser };
