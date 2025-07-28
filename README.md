# **SkyExpense**

SkyExpense is a full-stack web application for personal finance management, allowing users to track expenses, income, debts, investments, and nd stay on top of recurring subscription payments via reminders. Built with a Node.js backend and React frontend, it provides a simple and intuitive way to organize financial data.

## **Features**

* **Expense Management**: Record, view, edit, and delete expenses with categories and types.
* **Income Management**: Track income with categories like salary or gifts.
* **Debt Management**: Manage debts with details like counterparty and repayment dates.
* **Investment Tracking**: Log and monitor investment records.
* **Subscription Management**: Track recurring subscriptions with email reminders for renewals.
* **User Profile Management**: Update personal details like name, date of birth, and gender.

## **Tech Stack**

* **Frontend**: React, Tailwind CSS, Axios
* **Backend**: Node.js, Express.js, PostgreSQL
* **Authentication**: JWT, bcrypt
* **Email Service**: Nodemailer for subscription reminders
* **Deployment**: Docker, hosted on AWS/Heroku

## **Prerequisites**

* Node.js (v18 or higher)
* PostgreSQL (v15 or higher)
* SendGrid API key for email reminders
* Docker (optional, for containerized deployment)

### Installation

   ```bash
   git clone https://github.com/exphassan/sky-expense-app.git
   ```

## **Running the Application**

1. **Start the Backend**:
   ```bash
   cd web-api
   ```
   **Environment Setup**
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
   DB_NAME=
   DB_USER=
   DB_PASS=
   
   # JWT Configuration
   JWT_SECRET=
   JWT_EXPIRES_IN=
   
   # Email Configuration (for reminders)
   EMAIL_HOST=
   EMAIL_PORT=
   EMAIL_USER=
   EMAIL_PASS=
   ```
   **Install dependencies**
   ```bash
   npm i
   ```
   **Install dependencies**
   ```bash
   npm run start
   ```
   The backend runs on http://localhost:3000 by default.

2. **Start the Frontend**:
   ```bash
   cd web-ui
   ```
   **Start application dependencies**
   ```bash
   npm i
   ```
   **Install dependencies**
   ```bash
   npm run start
   ```
3. **Access the App**:
   * Open http://localhost:3001 in your browser.
   * Register a new account or log in to start managing your finances.


## **Project Structure**

```
sky-expense-app/  
├── web-api/        \# Node.js/Express backend  
│   ├── src/        \# API routes, controllers, services  
│   └── .env        \# Environment variables  
├── web-ui/         \# React frontend  
│   ├── src/        \# React components, pages, and utilities  
│   └── .env        \# Frontend environment variables
```