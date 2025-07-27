const express = require('express');
const ExpenseController = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth');
const { validate, expenseSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', validate(expenseSchemas.create), ExpenseController.create);
router.get('/', ExpenseController.getAll);
router.get('/summary', ExpenseController.getSummaryByCategory);
router.get('/:id', ExpenseController.getById);
router.put('/:id', validate(expenseSchemas.update), ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

module.exports = router;