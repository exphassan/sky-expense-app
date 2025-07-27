const express = require('express');
const SubscriptionController = require('../controllers/subscription.controller');
const { authenticate } = require('../middleware/auth');
const { validate, subscriptionSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', validate(subscriptionSchemas.create), SubscriptionController.create);
router.get('/', SubscriptionController.getAll);
router.get('/upcoming-reminders', SubscriptionController.getUpcomingReminders);
router.get('/due-today', SubscriptionController.getDueToday);
router.get('/spending-summary', SubscriptionController.getSpendingSummary);
router.get('/:id', SubscriptionController.getById);
router.put('/:id', validate(subscriptionSchemas.update), SubscriptionController.update);
router.patch('/:id/update-payment-date', SubscriptionController.updateNextPaymentDate);
router.delete('/:id', SubscriptionController.delete);

module.exports = router;