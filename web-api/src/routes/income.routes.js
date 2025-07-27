const express = require('express');
const IncomeController = require('../controllers/income.controller');
const { authenticate } = require('../middleware/auth');
const { validate, incomeSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', validate(incomeSchemas.create), IncomeController.create);
router.get('/', IncomeController.getAll);
router.get('/summary', IncomeController.getSummaryByCategory);
router.get('/:id', IncomeController.getById);
router.put('/:id', validate(incomeSchemas.update), IncomeController.update);
router.delete('/:id', IncomeController.delete);

module.exports = router;