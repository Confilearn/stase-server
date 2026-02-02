/**
 * Test script for health check API endpoint
 * Tests server health and basic connectivity
 */

const testHealth = async () => {
  console.log("🏥 Testing health check API endpoint...\n");

  // Test 1: Basic health check
  console.log("❤️ Test 1: Basic health check");
  try {
    const response = await fetch("http://localhost:3000/api/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Health check successful!");
      console.log("📊 Health Status:");
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      console.log(`   Uptime: ${data.uptime} seconds`);
    } else {
      console.error("❌ Health check failed:", data.error || data.message);
    }
  } catch (error) {
    console.error("💥 Error during health check:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Root health check (backward compatibility)
  console.log("🔄 Test 2: Root health check (backward compatibility)");
  try {
    const response = await fetch("http://localhost:3000/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Root health check successful!");
      console.log("📊 Health Status:");
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Timestamp: ${data.timestamp}`);
    } else {
      console.error("❌ Root health check failed:", data.error || data.message);
    }
  } catch (error) {
    console.error("💥 Error during root health check:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: POST request (should fail - only GET allowed)
  console.log("⚠️ Test 3: POST request (should fail)");
  try {
    const response = await fetch("http://localhost:3000/api/health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: "data" }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("⚠️ Unexpected: POST request succeeded");
    } else {
      console.log("✅ Expected: POST request failed");
      console.log("📝 Error:", data.error || data.message);
    }
  } catch (error) {
    console.error("💥 Error during POST test:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Invalid endpoint
  console.log("❌ Test 4: Invalid endpoint");
  try {
    const response = await fetch("http://localhost:3000/api/invalid-endpoint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("❌ Unexpected: Invalid endpoint succeeded");
    } else {
      console.log("✅ Expected: Invalid endpoint failed");
      console.log("📝 Error:", data.error);
      console.log("📝 Message:", data.message);
    }
  } catch (error) {
    console.error("💥 Error during invalid endpoint test:", error.message);
  }

  console.log("\n🎉 Health check tests completed!");
};

// Run the test
testHealth();

export { testHealth };
