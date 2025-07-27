const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return ApiResponse.error(res, 'Resource already exists', 409);
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.error(res, 'Referenced resource not found', 400);
  }

  // JWT errors are handled in auth middleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Authentication failed', 401);
  }

  // Default error
  return ApiResponse.error(res, 'Internal Server Error', 500);
};

// 404 handler
const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFoundHandler };