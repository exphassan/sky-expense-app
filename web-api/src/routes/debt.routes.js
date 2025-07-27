const express = require('express');
const DebtController = require('../controllers/debt.controller');
const { authenticate } = require('../middleware/auth');
const { validate, debtSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', validate(debtSchemas.create), DebtController.create);
router.get('/', DebtController.getAll);
router.get('/summary', DebtController.getSummary);
router.get('/overdue', DebtController.getOverdue);
router.get('/:id', DebtController.getById);
router.put('/:id', validate(debtSchemas.update), DebtController.update);
router.patch('/:id/mark-paid', DebtController.markAsPaid);
router.delete('/:id', DebtController.delete);

module.exports = router;