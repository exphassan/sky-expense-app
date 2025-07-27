# Xpensify API - Personal Finance Manager

A comprehensive RESTful API for personal finance management built with Node.js, Express, and PostgreSQL.

## 🌟 Features

- **User Authentication**: JWT-based secure authentication
- **Expense Tracking**: Categorized expense recording and management
- **Income Management**: Track various income sources
- **Debt Management**: Monitor debts with payment schedules and reminders
- **Investment Tracking**: Portfolio management with return calculations
- **Subscription Management**: Recurring payment tracking with automated reminders
- **Comprehensive Reporting**: Financial summaries and analytics
- **Security**: Rate limiting, CORS, input validation, and SQL injection protection

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xpensify-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=xpensify_db
   DB_USER=your_db_user
   DB_PASS=your_db_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (for reminders)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb xpensify_db
   
   # Start the application (database tables will be created automatically)
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Expense Endpoints

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Grocery shopping",
  "category": "Food",
  "type": "Card",
  "date": "2024-01-15",
  "notes": "Weekly groceries"
}
```

#### Get All Expenses
```http
GET /api/expenses?page=1&limit=10&category=Food&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <jwt_token>
```

#### Get Expense Summary
```http
GET /api/expenses/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <jwt_token>
```

### Income Endpoints

#### Create Income
```http
POST /api/incomes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 3000.00,
  "description": "Monthly salary",
  "category": "Paycheck",
  "date": "2024-01-01"
}
```

#### Get All Incomes
```http
GET /api/incomes?page=1&limit=10&category=Paycheck
Authorization: Bearer <jwt_token>
```

### Debt Endpoints

#### Create Debt
```http
POST /api/debts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 1000.00,
  "description": "Personal loan",
  "category": "Personal",
  "counterpartyName": "John Smith",
  "counterpartyEmail": "john@example.com",
  "repaymentDate": "2024-06-01",
  "direction": "OwedByMe"
}
```

#### Mark Debt as Paid
```http
PATCH /api/debts/:id/mark-paid
Authorization: Bearer <jwt_token>
```

#### Get Overdue Debts
```http
GET /api/debts/overdue
Authorization: Bearer <jwt_token>
```

### Investment Endpoints

#### Create Investment
```http
POST /api/investments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 5000.00,
  "investmentType": "Stocks",
  "description": "Tech stock portfolio",
  "startDate": "2024-01-01",
  "expectedReturnDate": "2025-01-01"
}
```

#### Get Portfolio Summary
```http
GET /api/investments/portfolio-summary
Authorization: Bearer <jwt_token>
```

#### Update Current Value
```http
PATCH /api/investments/:id/current-value
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentValue": 5500.00
}
```

### Subscription Endpoints

#### Create Subscription
```http
POST /api/subscriptions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Netflix",
  "amount": 15.99,
  "billingCycle": "Monthly",
  "nextPaymentDate": "2024-02-01",
  "category": "Streaming",
  "reminderEnabled": true
}
```

#### Get Upcoming Reminders
```http
GET /api/subscriptions/upcoming-reminders
Authorization: Bearer <jwt_token>
```

#### Get Subscriptions Due Today
```http
GET /api/subscriptions/due-today
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── config.js     # App configuration
│   └── database.js   # Database configuration
├── controllers/      # Request handlers
│   ├── auth.controller.js
│   ├── expense.controller.js
│   ├── income.controller.js
│   ├── debt.controller.js
│   ├── investment.controller.js
│   └── subscription.controller.js
├── middleware/       # Custom middleware
│   ├── auth.js       # JWT authentication
│   ├── validation.js # Input validation
│   └── errorHandler.js
├── models/          # Database models
│   ├── User.js
│   ├── Expense.js
│   ├── Income.js
│   ├── Debt.js
│   ├── Investment.js
│   ├── Subscription.js
│   └── index.js
├── routes/          # API routes
│   ├── auth.routes.js
│   ├── expense.routes.js
│   ├── income.routes.js
│   ├── debt.routes.js
│   ├── investment.routes.js
│   ├── subscription.routes.js
│   └── index.js
├── services/        # Business logic services
│   ├── email.service.js
│   └── reminder.service.js
├── utils/           # Utility functions
│   ├── apiResponse.js
│   └── logger.js
└── app.js           # Main application file
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation using Joi
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection
- **Password Hashing**: bcrypt for secure password storage
- **Helmet**: Security headers for Express apps

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName`, `middleName`, `lastName`
- `dateOfBirth` (Date)
- `gender` (Enum: Female, Male, Unknown)
- `isEmailVerified`, `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Expenses Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `amount` (Decimal)
- `description` (String)
- `type` (Enum: Cash, Transfer, Card, Check)
- `category` (Enum: Personal, Food, Home, etc.)
- `date` (Date)
- `notes` (Text)

### Incomes Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `amount` (Decimal)
- `description` (String)
- `category` (Enum: Paycheck, Interest, etc.)
- `date` (Date)
- `notes` (Text)

### Debts Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `amount` (Decimal)
- `description` (String)
- `category` (Enum: Personal, Food, Home, etc.)
- `counterpartyName`, `counterpartyEmail`
- `repaymentDate` (Date)
- `status` (Enum: Active, Paid, Overdue)
- `direction` (Enum: OwedByMe, OwedToMe)

### Investments Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `amount` (Decimal)
- `investmentType` (String)
- `description` (String)
- `startDate`, `expectedReturnDate` (Date)
- `currentValue`, `returnRate` (Decimal)

### Subscriptions Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `name` (String)
- `amount` (Decimal)
- `billingCycle` (Enum: Weekly, Monthly, Quarterly, Yearly)
- `nextPaymentDate` (Date)
- `category` (Enum: Streaming, Internet, etc.)
- `reminderEnabled`, `isActive` (Boolean)

## 🔄 Automated Features

### Subscription Reminders
- **Schedule**: Daily at 9:00 AM
- **Logic**: Sends email reminders 2 days before payment due date
- **Condition**: Only for active subscriptions with reminders enabled

### Debt Reminders
- **Schedule**: Daily at 10:00 AM
- **Logic**: Sends email reminders 3 days before repayment date
- **Condition**: Only for active debts

### Overdue Debt Updates
- **Schedule**: Daily at 11:00 PM
- **Logic**: Updates debt status from 'Active' to 'Overdue' for past due dates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed
```

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start src/app.js --name "xpensify-api"

# Monitor application
pm2 monit
```

### Using Docker
```dockerfile
# Create Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@xpensify.com or create an issue in the repository.

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Complete CRUD operations for all financial entities
- JWT authentication and authorization
- Automated reminder system
- Comprehensive validation and error handling
- RESTful API design with proper HTTP status codes
- Database relationships and constraints
- Security middleware implementation