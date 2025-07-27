const { Debt } = require('../models');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class DebtController {
  // Create new debt
  static async create(req, res) {
    try {
      const debt = await Debt.create({
        ...req.body,
        userId: req.user.id
      });

      logger.info(`Debt created: ${debt.id} for user: ${req.user.id}`);
      return ApiResponse.success(res, { debt }, 'Debt created successfully', 201);
    } catch (error) {
      logger.error('Create debt error:', error);
      return ApiResponse.error(res, 'Failed to create debt', 500);
    }
  }

  // Get all debts for user
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status, direction, category, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const offset = (page - 1) * limit;
      const where = { userId: req.user.id };

      // Add filters
      if (status) {
        where.status = status;
      }

      if (direction) {
        where.direction = direction;
      }

      if (category) {
        where.category = category;
      }

      const { count, rows: debts } = await Debt.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + debts.length < count,
        hasPrev: page > 1
      };

      return ApiResponse.paginated(res, { debts }, pagination, 'Debts retrieved successfully');
    } catch (error) {
      logger.error('Get debts error:', error);
      return ApiResponse.error(res, 'Failed to retrieve debts', 500);
    }
  }

  // Get debt by ID
  static async getById(req, res) {
    try {
      const debt = await Debt.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!debt) {
        return ApiResponse.error(res, 'Debt not found', 404);
      }

      return ApiResponse.success(res, { debt }, 'Debt retrieved successfully');
    } catch (error) {
      logger.error('Get debt error:', error);
      return ApiResponse.error(res, 'Failed to retrieve debt', 500);
    }
  }

  // Update debt
  static async update(req, res) {
    try {
      const debt = await Debt.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!debt) {
        return ApiResponse.error(res, 'Debt not found', 404);
      }

      await debt.update(req.body);
      
      logger.info(`Debt updated: ${debt.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { debt }, 'Debt updated successfully');
    } catch (error) {
      logger.error('Update debt error:', error);
      return ApiResponse.error(res, 'Failed to update debt', 500);
    }
  }

  // Delete debt
  static async delete(req, res) {
    try {
      const debt = await Debt.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!debt) {
        return ApiResponse.error(res, 'Debt not found', 404);
      }

      await debt.destroy();
      
      logger.info(`Debt deleted: ${req.params.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, null, 'Debt deleted successfully');
    } catch (error) {
      logger.error('Delete debt error:', error);
      return ApiResponse.error(res, 'Failed to delete debt', 500);
    }
  }

  // Mark debt as paid
  static async markAsPaid(req, res) {
    try {
      const debt = await Debt.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!debt) {
        return ApiResponse.error(res, 'Debt not found', 404);
      }

      if (debt.status === 'Paid') {
        return ApiResponse.error(res, 'Debt is already marked as paid', 400);
      }

      await debt.update({ status: 'Paid' });
      
      logger.info(`Debt marked as paid: ${debt.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { debt }, 'Debt marked as paid successfully');
    } catch (error) {
      logger.error('Mark debt as paid error:', error);
      return ApiResponse.error(res, 'Failed to mark debt as paid', 500);
    }
  }

  // Get debt summary
  static async getSummary(req, res) {
    try {
      const summary = await Debt.findAll({
        where: { userId: req.user.id },
        attributes: [
          'status',
          'direction',
          [Debt.sequelize.fn('SUM', Debt.sequelize.col('amount')), 'totalAmount'],
          [Debt.sequelize.fn('COUNT', Debt.sequelize.col('id')), 'count']
        ],
        group: ['status', 'direction']
      });

      return ApiResponse.success(res, { summary }, 'Debt summary retrieved successfully');
    } catch (error) {
      logger.error('Get debt summary error:', error);
      return ApiResponse.error(res, 'Failed to retrieve debt summary', 500);
    }
  }

  // Get overdue debts
  static async getOverdue(req, res) {
    try {
      const today = new Date();
      const overdueDebts = await Debt.findAll({
        where: {
          userId: req.user.id,
          status: 'Active',
          repaymentDate: {
            [Op.lt]: today
          }
        },
        order: [['repaymentDate', 'ASC']]
      });

      // Update status to overdue
      await Debt.update(
        { status: 'Overdue' },
        {
          where: {
            userId: req.user.id,
            status: 'Active',
            repaymentDate: {
              [Op.lt]: today
            }
          }
        }
      );

      return ApiResponse.success(res, { overdueDebts }, 'Overdue debts retrieved successfully');
    } catch (error) {
      logger.error('Get overdue debts error:', error);
      return ApiResponse.error(res, 'Failed to retrieve overdue debts', 500);
    }
  }
}

module.exports = DebtController;