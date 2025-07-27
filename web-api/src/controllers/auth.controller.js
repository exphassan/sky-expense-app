const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { email, password, firstName, middleName, lastName, dateOfBirth, gender } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return ApiResponse.error(res, 'User already exists with this email', 409);
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info(`New user registered: ${email}`);
      
      return ApiResponse.success(res, {
        user,
        token
      }, 'User registered successfully', 201);

    } catch (error) {
      logger.error('Registration error:', error);
      return ApiResponse.error(res, 'Registration failed', 500);
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        return ApiResponse.error(res, 'Account is deactivated', 401);
      }

      // Verify password
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info(`User logged in: ${email}`);
      
      return ApiResponse.success(res, {
        user,
        token
      }, 'Login successful');

    } catch (error) {
      logger.error('Login error:', error);
      return ApiResponse.error(res, 'Login failed', 500);
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      return ApiResponse.success(res, { user }, 'Profile retrieved successfully');
    } catch (error) {
      logger.error('Get profile error:', error);
      return ApiResponse.error(res, 'Failed to retrieve profile', 500);
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { firstName, middleName, lastName, dateOfBirth, gender } = req.body;
      
      await req.user.update({
        firstName: firstName || req.user.firstName,
        middleName: middleName || req.user.middleName,
        lastName: lastName || req.user.lastName,
        dateOfBirth: dateOfBirth || req.user.dateOfBirth,
        gender: gender || req.user.gender
      });

      return ApiResponse.success(res, { user: req.user }, 'Profile updated successfully');
    } catch (error) {
      logger.error('Update profile error:', error);
      return ApiResponse.error(res, 'Failed to update profile', 500);
    }
  }
}

module.exports = AuthController;