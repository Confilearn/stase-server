# Stase Backend Server

Express.js backend server for the Stase fintech application.

## Features

- **User Management**: Account creation, authentication, PIN management
- **Bank Accounts**: Multi-currency account management (USD, CAD, EUR, GBP)
- **Transactions**: Deposits, withdrawals, transfers, currency conversions
- **Security**: Transaction PIN verification, Bearer token authentication
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: RESTful API with proper error handling
- **Testing**: Comprehensive test suite for all endpoints

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/create-account` - Create new user account
- `POST /api/auth/check-user` - Check if user exists
- `POST /api/auth/create-transaction-pin` - Set/update transaction PIN

### Account Management (`/api/account`)

- `GET /api/account/user-details` - Get user details with accounts and transactions

### Transactions (`/api/transactions`)

- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer money to another user
- `POST /api/transactions/convert` - Convert between currencies

### Health Check (`/api/health`)

- `GET /api/health` - Server health status

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository and navigate to the server directory
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env
   ```

4. Update `.env` with your configuration:

   ```
   MONGODB_URI=mongodb://localhost:27017/stase
   PORT=3000
   API_PREFIX=/api
   NODE_ENV=development
   ```

5. Start the server:

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## Project Structure

```
src/
├── config/
│   ├── db.js          # Database connection
│   └── index.js       # Configuration management
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── accountController.js   # Account management
│   ├── transactionController.js # Transaction logic
│   └── healthController.js    # Health checks
├── middleware/
│   └── auth.js        # Authentication middleware
├── models/
│   ├── User.js        # User schema
│   ├── BankAccount.js # Bank account schema
│   └── Transaction.js # Transaction schema
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── account.js     # Account routes
│   ├── transaction.js # Transaction routes
│   └── health.js      # Health check routes
├── utils/
│   ├── validate.js           # Input validation
│   ├── currencyRates.js      # Currency conversion utilities
│   ├── TxReference.js        # Transaction reference generation
│   └── accountHelpers.js     # Account management helpers
└── app.js            # Main application file
```

## Authentication

The API uses a Bearer token system where the token is the user's `clerkUserId`. Include it in the Authorization header:

```
Authorization: Bearer <clerkUserId>
```

## Supported Currencies

- USD (US Dollar)
- CAD (Canadian Dollar)
- EUR (Euro)
- GBP (British Pound)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Testing

The server includes a comprehensive test suite:

### Running Tests

```bash
# Run all tests
npm run test:api

# Run specific test suites
npm run test:auth          # Authentication tests
npm run test:transactions  # Transaction tests
npm run test:accounts      # Account tests
npm test                   # Health check test only
```

### Test Coverage

- **Authentication Tests**: Account creation, user validation, PIN management
- **Transaction Tests**: Deposits, withdrawals, transfers, currency conversions
- **Account Tests**: User details fetching
- **Health Tests**: Server health checks

## Development

The server includes:

- Comprehensive error handling
- Request validation
- Transaction support for database operations
- CORS support for cross-origin requests
- Environment-based configuration

## Security Features

- Transaction PIN verification for sensitive operations
- Input validation and sanitization
- MongoDB transaction support for data consistency
- Secure password hashing with bcrypt
- Bearer token authentication using clerkUserId

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Bearer tokens (clerkUserId)
- **Security**: bcrypt for password hashing
- **Development**: nodemon for hot reloading
- **Testing**: Custom test suite

## License

MIT License - see LICENSE file for details.

## Author

Confilearn
