const { Income } = require('../models');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class IncomeController {
  // Create new income
  static async create(req, res) {
    try {
      const income = await Income.create({
        ...req.body,
        userId: req.user.id
      });

      logger.info(`Income created: ${income.id} for user: ${req.user.id}`);
      return ApiResponse.success(res, { income }, 'Income created successfully', 201);
    } catch (error) {
      logger.error('Create income error:', error);
      return ApiResponse.error(res, 'Failed to create income', 500);
    }
  }

  // Get all incomes for user
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, category, startDate, endDate, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const offset = (page - 1) * limit;
      const where = { userId: req.user.id };

      // Add filters
      if (category) {
        where.category = category;
      }

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const { count, rows: incomes } = await Income.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + incomes.length < count,
        hasPrev: page > 1
      };

      return ApiResponse.paginated(res, { incomes }, pagination, 'Incomes retrieved successfully');
    } catch (error) {
      logger.error('Get incomes error:', error);
      return ApiResponse.error(res, 'Failed to retrieve incomes', 500);
    }
  }

  // Get income by ID
  static async getById(req, res) {
    try {
      const income = await Income.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!income) {
        return ApiResponse.error(res, 'Income not found', 404);
      }

      return ApiResponse.success(res, { income }, 'Income retrieved successfully');
    } catch (error) {
      logger.error('Get income error:', error);
      return ApiResponse.error(res, 'Failed to retrieve income', 500);
    }
  }

  // Update income
  static async update(req, res) {
    try {
      const income = await Income.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!income) {
        return ApiResponse.error(res, 'Income not found', 404);
      }

      await income.update(req.body);
      
      logger.info(`Income updated: ${income.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { income }, 'Income updated successfully');
    } catch (error) {
      logger.error('Update income error:', error);
      return ApiResponse.error(res, 'Failed to update income', 500);
    }
  }

  // Delete income
  static async delete(req, res) {
    try {
      const income = await Income.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!income) {
        return ApiResponse.error(res, 'Income not found', 404);
      }

      await income.destroy();
      
      logger.info(`Income deleted: ${req.params.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, null, 'Income deleted successfully');
    } catch (error) {
      logger.error('Delete income error:', error);
      return ApiResponse.error(res, 'Failed to delete income', 500);
    }
  }

  // Get income summary by category
  static async getSummaryByCategory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const where = { userId: req.user.id };

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const summary = await Income.findAll({
        where,
        attributes: [
          'category',
          [Income.sequelize.fn('SUM', Income.sequelize.col('amount')), 'totalAmount'],
          [Income.sequelize.fn('COUNT', Income.sequelize.col('id')), 'count']
        ],
        group: ['category'],
        order: [[Income.sequelize.fn('SUM', Income.sequelize.col('amount')), 'DESC']]
      });

      return ApiResponse.success(res, { summary }, 'Income summary retrieved successfully');
    } catch (error) {
      logger.error('Get income summary error:', error);
      return ApiResponse.error(res, 'Failed to retrieve income summary', 500);
    }
  }
}

module.exports = IncomeController;