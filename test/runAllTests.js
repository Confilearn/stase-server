/**
 * Comprehensive test runner for all API endpoints
 * Runs all tests in sequence and provides a summary report
 */

import { testCreateAccount } from "./test-createAccount.js";
import { testCheckUser } from "./test-checkUser.js";
import { testCreateUserTransactionPin } from "./test-createUserTransactionPin.js";
import { testFetchUserDetails } from "./test-fetchUserDetails.js";
import { testDepositWithdraw } from "./test-depositWithdraw.js";
import { testTransferMoney } from "./test-transferMoney.js";
import { testConvertMoney } from "./test-convertMoney.js";
import { testHealth } from "./test-health.js";

const tests = [
  { name: "Health Check", fn: testHealth, critical: true },
  { name: "Create Account", fn: testCreateAccount, critical: true },
  { name: "Check User", fn: testCheckUser, critical: true },
  {
    name: "Create Transaction PIN",
    fn: testCreateUserTransactionPin,
    critical: true,
  },
  { name: "Fetch User Details", fn: testFetchUserDetails, critical: true },
  { name: "Deposit & Withdraw", fn: testDepositWithdraw, critical: true },
  { name: "Transfer Money", fn: testTransferMoney, critical: true },
  { name: "Convert Money", fn: testConvertMoney, critical: true },
];

const runAllTests = async () => {
  console.log("🚀 Starting Stase API Test Suite");
  console.log("=".repeat(60));
  console.log(`📊 Running ${tests.length} tests...\n`);

  const results = {
    passed: 0,
    failed: 0,
    total: tests.length,
    failures: [],
  };

  const startTime = Date.now();

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n📋 Test ${i + 1}/${tests.length}: ${test.name}`);
    console.log("-".repeat(40));

    try {
      await test.fn();
      results.passed++;
      console.log(`✅ ${test.name} - PASSED`);
    } catch (error) {
      results.failed++;
      results.failures.push({
        name: test.name,
        error: error.message,
        critical: test.critical,
      });
      console.log(`❌ ${test.name} - FAILED`);
      console.log(`   Error: ${error.message}`);

      if (test.critical) {
        console.log(`   ⚠️  This is a critical test!`);
      }
    }

    // Add a small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)} seconds`);

  if (results.failures.length > 0) {
    console.log("\n❌ FAILED TESTS:");
    results.failures.forEach((failure, index) => {
      console.log(
        `   ${index + 1}. ${failure.name} (${failure.critical ? "Critical" : "Non-critical"})`,
      );
      console.log(`${failure.error}`);
    });
  }

  // Critical failures check
  const criticalFailures = results.failures.filter((f) => f.critical);
  if (criticalFailures.length > 0) {
    console.log(`\n🚨 CRITICAL FAILURES: ${criticalFailures.length}`);
    console.log(
      "Some critical tests failed. Please check the server and database.",
    );
    process.exit(1);
  } else if (results.failed > 0) {
    console.log(
      "\n⚠️  Some non-critical tests failed, but all critical tests passed.",
    );
  } else {
    console.log("\n🎉 ALL TESTS PASSED! The API is working correctly.");
  }

  console.log("\n🏁 Test suite completed.");
};

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

// Run tests if this file is executed directly
runAllTests();

export { runAllTests };
