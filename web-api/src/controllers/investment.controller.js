const { Investment } = require('../models');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class InvestmentController {
  // Create new investment
  static async create(req, res) {
    try {
      const investment = await Investment.create({
        ...req.body,
        userId: req.user.id
      });

      logger.info(`Investment created: ${investment.id} for user: ${req.user.id}`);
      return ApiResponse.success(res, { investment }, 'Investment created successfully', 201);
    } catch (error) {
      logger.error('Create investment error:', error);
      return ApiResponse.error(res, 'Failed to create investment', 500);
    }
  }

  // Get all investments for user
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, investmentType, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const offset = (page - 1) * limit;
      const where = { userId: req.user.id };

      // Add filters
      if (investmentType) {
        where.investmentType = {
          [Op.iLike]: `%${investmentType}%`
        };
      }

      const { count, rows: investments } = await Investment.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + investments.length < count,
        hasPrev: page > 1
      };

      return ApiResponse.paginated(res, { investments }, pagination, 'Investments retrieved successfully');
    } catch (error) {
      logger.error('Get investments error:', error);
      return ApiResponse.error(res, 'Failed to retrieve investments', 500);
    }
  }

  // Get investment by ID
  static async getById(req, res) {
    try {
      const investment = await Investment.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!investment) {
        return ApiResponse.error(res, 'Investment not found', 404);
      }

      return ApiResponse.success(res, { investment }, 'Investment retrieved successfully');
    } catch (error) {
      logger.error('Get investment error:', error);
      return ApiResponse.error(res, 'Failed to retrieve investment', 500);
    }
  }

  // Update investment
  static async update(req, res) {
    try {
      const investment = await Investment.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!investment) {
        return ApiResponse.error(res, 'Investment not found', 404);
      }

      await investment.update(req.body);
      
      logger.info(`Investment updated: ${investment.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { investment }, 'Investment updated successfully');
    } catch (error) {
      logger.error('Update investment error:', error);
      return ApiResponse.error(res, 'Failed to update investment', 500);
    }
  }

  // Delete investment
  static async delete(req, res) {
    try {
      const investment = await Investment.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!investment) {
        return ApiResponse.error(res, 'Investment not found', 404);
      }

      await investment.destroy();
      
      logger.info(`Investment deleted: ${req.params.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, null, 'Investment deleted successfully');
    } catch (error) {
      logger.error('Delete investment error:', error);
      return ApiResponse.error(res, 'Failed to delete investment', 500);
    }
  }

  // Get investment portfolio summary
  static async getPortfolioSummary(req, res) {
    try {
      const summary = await Investment.findAll({
        where: { userId: req.user.id },
        attributes: [
          'investmentType',
          [Investment.sequelize.fn('SUM', Investment.sequelize.col('amount')), 'totalInvested'],
          [Investment.sequelize.fn('SUM', Investment.sequelize.col('currentValue')), 'totalCurrentValue'],
          [Investment.sequelize.fn('COUNT', Investment.sequelize.col('id')), 'count'],
          [Investment.sequelize.fn('AVG', Investment.sequelize.col('returnRate')), 'averageReturn']
        ],
        group: ['investmentType'],
        order: [[Investment.sequelize.fn('SUM', Investment.sequelize.col('amount')), 'DESC']]
      });

      const totalStats = await Investment.findOne({
        where: { userId: req.user.id },
        attributes: [
          [Investment.sequelize.fn('SUM', Investment.sequelize.col('amount')), 'totalInvested'],
          [Investment.sequelize.fn('SUM', Investment.sequelize.col('currentValue')), 'totalCurrentValue'],
          [Investment.sequelize.fn('COUNT', Investment.sequelize.col('id')), 'totalInvestments']
        ]
      });

      return ApiResponse.success(res, { 
        summary, 
        totalStats 
      }, 'Investment portfolio summary retrieved successfully');
    } catch (error) {
      logger.error('Get investment portfolio summary error:', error);
      return ApiResponse.error(res, 'Failed to retrieve investment portfolio summary', 500);
    }
  }

  // Update investment current value
  static async updateCurrentValue(req, res) {
    try {
      const { currentValue } = req.body;
      
      const investment = await Investment.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!investment) {
        return ApiResponse.error(res, 'Investment not found', 404);
      }

      // Calculate return rate if both amounts are available
      let returnRate = null;
      if (currentValue && investment.amount) {
        returnRate = ((currentValue - investment.amount) / investment.amount * 100).toFixed(2);
      }

      await investment.update({ 
        currentValue,
        returnRate: returnRate || investment.returnRate
      });
      
      logger.info(`Investment current value updated: ${investment.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { investment }, 'Investment current value updated successfully');
    } catch (error) {
      logger.error('Update investment current value error:', error);
      return ApiResponse.error(res, 'Failed to update investment current value', 500);
    }
  }
}

module.exports = InvestmentController;