const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return ApiResponse.error(res, 'Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return ApiResponse.error(res, 'Invalid token or user not found.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.error(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token expired.', 401);
    }
    return ApiResponse.error(res, 'Authentication failed.', 500);
  }
};

module.exports = { authenticate };