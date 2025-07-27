const Joi = require('joi');
const ApiResponse = require('../utils/apiResponse');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(1).max(50).required(),
    middleName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).required(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('Female', 'Male', 'Unknown').optional()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Expense validation schemas
const expenseSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().min(1).max(255).required(),
    type: Joi.string().valid('Cash', 'Transfer', 'Card', 'Check').optional(),
    category: Joi.string().valid(
      'Personal', 'Food', 'Home', 'Family', 'Transportation', 
      'Gifts', 'Utility', 'Investment', 'Savings', 'DebtRepayment', 'Others'
    ).required(),
    date: Joi.date().optional(),
    notes: Joi.string().optional()
  }),
  
  update: Joi.object({
    amount: Joi.number().positive().precision(2).optional(),
    description: Joi.string().min(1).max(255).optional(),
    type: Joi.string().valid('Cash', 'Transfer', 'Card', 'Check').optional(),
    category: Joi.string().valid(
      'Personal', 'Food', 'Home', 'Family', 'Transportation', 
      'Gifts', 'Utility', 'Investment', 'Savings', 'DebtRepayment', 'Others'
    ).optional(),
    date: Joi.date().optional(),
    notes: Joi.string().optional()
  })
};

// Income validation schemas
const incomeSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().min(1).max(255).required(),
    category: Joi.string().valid(
      'Paycheck', 'Interest', 'InvestmentReturn', 'Dividend', 
      'Gift', 'Allowance', 'Other'
    ).required(),
    date: Joi.date().optional(),
    notes: Joi.string().optional()
  }),
  
  update: Joi.object({
    amount: Joi.number().positive().precision(2).optional(),
    description: Joi.string().min(1).max(255).optional(),
    category: Joi.string().valid(
      'Paycheck', 'Interest', 'InvestmentReturn', 'Dividend', 
      'Gift', 'Allowance', 'Other'
    ).optional(),
    date: Joi.date().optional(),
    notes: Joi.string().optional()
  })
};

// Debt validation schemas
const debtSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().min(1).max(255).required(),
    category: Joi.string().valid(
      'Personal', 'Food', 'Home', 'Family', 'Transportation', 
      'Gifts', 'Utility', 'Investment', 'Others'
    ).required(),
    counterpartyName: Joi.string().min(1).max(100).required(),
    counterpartyEmail: Joi.string().email().optional(),
    repaymentDate: Joi.date().required(),
    direction: Joi.string().valid('OwedByMe', 'OwedToMe').required(),
    notes: Joi.string().optional()
  }),
  
  update: Joi.object({
    amount: Joi.number().positive().precision(2).optional(),
    description: Joi.string().min(1).max(255).optional(),
    category: Joi.string().valid(
      'Personal', 'Food', 'Home', 'Family', 'Transportation', 
      'Gifts', 'Utility', 'Investment', 'Others'
    ).optional(),
    counterpartyName: Joi.string().min(1).max(100).optional(),
    counterpartyEmail: Joi.string().email().optional(),
    repaymentDate: Joi.date().optional(),
    status: Joi.string().valid('Active', 'Paid', 'Overdue').optional(),
    direction: Joi.string().valid('OwedByMe', 'OwedToMe').optional(),
    notes: Joi.string().optional()
  })
};

// Investment validation schemas
const investmentSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    investmentType: Joi.string().min(1).max(100).required(),
    description: Joi.string().min(1).max(255).required(),
    startDate: Joi.date().optional(),
    expectedReturnDate: Joi.date().optional(),
    currentValue: Joi.number().positive().precision(2).optional(),
    returnRate: Joi.number().precision(2).optional(),
    notes: Joi.string().optional()
  }),
  
  update: Joi.object({
    amount: Joi.number().positive().precision(2).optional(),
    investmentType: Joi.string().min(1).max(100).optional(),
    description: Joi.string().min(1).max(255).optional(),
    startDate: Joi.date().optional(),
    expectedReturnDate: Joi.date().optional(),
    currentValue: Joi.number().positive().precision(2).optional(),
    returnRate: Joi.number().precision(2).optional(),
    notes: Joi.string().optional()
  })
};

// Subscription validation schemas
const subscriptionSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    amount: Joi.number().positive().precision(2).required(),
    billingCycle: Joi.string().valid('Weekly', 'Monthly', 'Quarterly', 'Yearly').required(),
    nextPaymentDate: Joi.date().required(),
    category: Joi.string().valid(
      'Streaming', 'Internet', 'Utility', 'Software', 'News', 
      'Gaming', 'Fitness', 'Music', 'Education', 'Other'
    ).optional(),
    reminderEnabled: Joi.boolean().optional(),
    notes: Joi.string().optional()
  }),
  
  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    amount: Joi.number().positive().precision(2).optional(),
    billingCycle: Joi.string().valid('Weekly', 'Monthly', 'Quarterly', 'Yearly').optional(),
    nextPaymentDate: Joi.date().optional(),
    category: Joi.string().valid(
      'Streaming', 'Internet', 'Utility', 'Software', 'News', 
      'Gaming', 'Fitness', 'Music', 'Education', 'Other'
    ).optional(),
    reminderEnabled: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    notes: Joi.string().optional()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiResponse.error(
        res, 
        'Validation failed', 
        400, 
        error.details.map(detail => detail.message)
      );
    }
    next();
  };
};

module.exports = {
  validate,
  userSchemas,
  expenseSchemas,
  incomeSchemas,
  debtSchemas,
  investmentSchemas,
  subscriptionSchemas
};