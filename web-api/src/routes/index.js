const express = require('express');
const authRoutes = require('./auth.routes');
const expenseRoutes = require('./expense.routes');
const incomeRoutes = require('./income.routes');
const debtRoutes = require('./debt.routes');
const investmentRoutes = require('./investment.routes');
const subscriptionRoutes = require('./subscription.routes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/incomes', incomeRoutes);
router.use('/debts', debtRoutes);
router.use('/investments', investmentRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;