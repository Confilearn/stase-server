# API Test Suite

This directory contains comprehensive test scripts for all API endpoints in the Stase backend server.

## Test Files

### Authentication Tests
- **`test-createAccount.js`** - Tests user account creation with automatic bank account generation
- **`test-checkUser.js`** - Tests user lookup by email and username
- **`test-createUserTransactionPin.js`** - Tests transaction PIN creation and validation

### Transaction Tests
- **`test-depositWithdraw.js`** - Tests deposit and withdrawal functionality with PIN verification
- **`test-transferMoney.js`** - Tests money transfers between users
- **`test-convertMoney.js`** - Tests currency conversion between different accounts

### Account Tests
- **`test-fetchUserDetails.js`** - Tests user details retrieval including accounts and transactions

### System Tests
- **`test-health.js`** - Tests server health and basic connectivity

## Running Tests

### Prerequisites
1. Ensure the Express server is running on `http://localhost:3000`
2. Update the `TEST_TOKEN` constants in test files with valid user tokens
3. Install dependencies if needed:
   ```bash
   npm install node-fetch
   ```

### Running Individual Tests
```bash
# Run a specific test
node test/test-createAccount.js

# Run health check
node test/test-health.js
```

### Running All Tests
```bash
# Run all tests in sequence
node test/test-createAccount.js && \
node test/test-checkUser.js && \
node test/test-createUserTransactionPin.js && \
node test/test-fetchUserDetails.js && \
node test/test-depositWithdraw.js && \
node test/test-transferMoney.js && \
node test/test-convertMoney.js && \
node test/test-health.js
```

## Test Coverage

### ✅ Covered Features
- User registration and account creation
- User authentication and PIN management
- Bank account management (multi-currency)
- Financial transactions (deposit, withdraw, transfer, convert)
- Transaction history and user details
- Error handling and validation
- Security (authentication, authorization)
- Health monitoring

### 🔍 Test Scenarios
- **Success Cases**: Valid requests with correct data
- **Error Cases**: Invalid data, missing fields, unauthorized access
- **Edge Cases**: Insufficient funds, invalid currencies, malformed requests
- **Security Tests**: Authentication bypass attempts, invalid tokens

## Configuration

### Test Tokens
Update the `TEST_TOKEN` constants in each test file with valid user tokens from your system:

```javascript
const TEST_TOKEN = "your_actual_user_token_here";
```

### Test Data
The tests use predefined test data:
- Test users: john.doe@example.com, jane.doe@example.com
- Default PIN: 1234
- Supported currencies: USD, CAD, EUR, GBP
- Exchange rates: USD→CAD (1.36), USD→EUR (0.85), USD→GBP (0.73)

## Expected Output

Each test provides detailed output including:
- ✅ Success indicators for passed tests
- ❌ Error indicators for failed tests
- 📊 Data summaries for successful operations
- 📝 Error messages for failed operations
- 💥 Exception details for connection errors

## Troubleshooting

### Common Issues
1. **Connection Refused**: Ensure the server is running on port 3000
2. **Authentication Errors**: Verify test tokens are valid and exist in the database
3. **Missing Dependencies**: Install `node-fetch` if running on Node.js < 18
4. **Database Errors**: Ensure MongoDB is running and accessible

### Debug Mode
Add console logging to test files to debug issues:
```javascript
console.log("Debug info:", { /* your data */ });
```

## Integration with CI/CD

These tests can be integrated into CI/CD pipelines:

```bash
# Example CI script
npm install
npm run dev &
sleep 5  # Wait for server to start
npm run test:api
pkill -f "npm run dev"
```

## Contributing

When adding new API endpoints:
1. Create corresponding test files
2. Follow the existing naming convention: `test-{endpointName}.js`
3. Include success, error, and edge case scenarios
4. Update this README with new test information
