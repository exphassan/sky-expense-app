const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Expense = require('./Expense');
const Income = require('./Income');
const Debt = require('./Debt');
const Investment = require('./Investment');
const Subscription = require('./Subscription');

// Initialize associations
const models = {
  User,
  Expense,
  Income,
  Debt,
  Investment,
  Subscription
};

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  ...models
};