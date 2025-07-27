const { Expense } = require('../models');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class ExpenseController {
  // Create new expense
  static async create(req, res) {
    try {
      const expense = await Expense.create({
        ...req.body,
        userId: req.user.id
      });

      logger.info(`Expense created: ${expense.id} for user: ${req.user.id}`);
      return ApiResponse.success(res, { expense }, 'Expense created successfully', 201);
    } catch (error) {
      logger.error('Create expense error:', error);
      return ApiResponse.error(res, 'Failed to create expense', 500);
    }
  }

  // Get all expenses for user
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

      const { count, rows: expenses } = await Expense.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + expenses.length < count,
        hasPrev: page > 1
      };

      return ApiResponse.paginated(res, { expenses }, pagination, 'Expenses retrieved successfully');
    } catch (error) {
      logger.error('Get expenses error:', error);
      return ApiResponse.error(res, 'Failed to retrieve expenses', 500);
    }
  }

  // Get expense by ID
  static async getById(req, res) {
    try {
      const expense = await Expense.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!expense) {
        return ApiResponse.error(res, 'Expense not found', 404);
      }

      return ApiResponse.success(res, { expense }, 'Expense retrieved successfully');
    } catch (error) {
      logger.error('Get expense error:', error);
      return ApiResponse.error(res, 'Failed to retrieve expense', 500);
    }
  }

  // Update expense
  static async update(req, res) {
    try {
      const expense = await Expense.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!expense) {
        return ApiResponse.error(res, 'Expense not found', 404);
      }

      await expense.update(req.body);
      
      logger.info(`Expense updated: ${expense.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { expense }, 'Expense updated successfully');
    } catch (error) {
      logger.error('Update expense error:', error);
      return ApiResponse.error(res, 'Failed to update expense', 500);
    }
  }

  // Delete expense
  static async delete(req, res) {
    try {
      const expense = await Expense.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!expense) {
        return ApiResponse.error(res, 'Expense not found', 404);
      }

      await expense.destroy();
      
      logger.info(`Expense deleted: ${req.params.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, null, 'Expense deleted successfully');
    } catch (error) {
      logger.error('Delete expense error:', error);
      return ApiResponse.error(res, 'Failed to delete expense', 500);
    }
  }

  // Get expense summary by category
  static async getSummaryByCategory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const where = { userId: req.user.id };

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const summary = await Expense.findAll({
        where,
        attributes: [
          'category',
          [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'totalAmount'],
          [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count']
        ],
        group: ['category'],
        order: [[Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'DESC']]
      });

      return ApiResponse.success(res, { summary }, 'Expense summary retrieved successfully');
    } catch (error) {
      logger.error('Get expense summary error:', error);
      return ApiResponse.error(res, 'Failed to retrieve expense summary', 500);
    }
  }
}

module.exports = ExpenseController;