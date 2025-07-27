const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validate(userSchemas.register), AuthController.register);
router.post('/login', validate(userSchemas.login), AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);

module.exports = router;