const express = require('express');
const InvestmentController = require('../controllers/investment.controller');
const { authenticate } = require('../middleware/auth');
const { validate, investmentSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', validate(investmentSchemas.create), InvestmentController.create);
router.get('/', InvestmentController.getAll);
router.get('/portfolio-summary', InvestmentController.getPortfolioSummary);
router.get('/:id', InvestmentController.getById);
router.put('/:id', validate(investmentSchemas.update), InvestmentController.update);
router.patch('/:id/current-value', InvestmentController.updateCurrentValue);
router.delete('/:id', InvestmentController.delete);

module.exports = router;