const { Subscription } = require('../models');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class SubscriptionController {
  // Create new subscription
  static async create(req, res) {
    try {
      const subscription = await Subscription.create({
        ...req.body,
        userId: req.user.id
      });

      logger.info(`Subscription created: ${subscription.id} for user: ${req.user.id}`);
      return ApiResponse.success(res, { subscription }, 'Subscription created successfully', 201);
    } catch (error) {
      logger.error('Create subscription error:', error);
      return ApiResponse.error(res, 'Failed to create subscription', 500);
    }
  }

  // Get all subscriptions for user
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, category, isActive, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const offset = (page - 1) * limit;
      const where = { userId: req.user.id };

      // Add filters
      if (category) {
        where.category = category;
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const { count, rows: subscriptions } = await Subscription.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + subscriptions.length < count,
        hasPrev: page > 1
      };

      return ApiResponse.paginated(res, { subscriptions }, pagination, 'Subscriptions retrieved successfully');
    } catch (error) {
      logger.error('Get subscriptions error:', error);
      return ApiResponse.error(res, 'Failed to retrieve subscriptions', 500);
    }
  }

  // Get subscription by ID
  static async getById(req, res) {
    try {
      const subscription = await Subscription.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!subscription) {
        return ApiResponse.error(res, 'Subscription not found', 404);
      }

      return ApiResponse.success(res, { subscription }, 'Subscription retrieved successfully');
    } catch (error) {
      logger.error('Get subscription error:', error);
      return ApiResponse.error(res, 'Failed to retrieve subscription', 500);
    }
  }

  // Update subscription
  static async update(req, res) {
    try {
      const subscription = await Subscription.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!subscription) {
        return ApiResponse.error(res, 'Subscription not found', 404);
      }

      await subscription.update(req.body);
      
      logger.info(`Subscription updated: ${subscription.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { subscription }, 'Subscription updated successfully');
    } catch (error) {
      logger.error('Update subscription error:', error);
      return ApiResponse.error(res, 'Failed to update subscription', 500);
    }
  }

  // Delete subscription
  static async delete(req, res) {
    try {
      const subscription = await Subscription.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!subscription) {
        return ApiResponse.error(res, 'Subscription not found', 404);
      }

      await subscription.destroy();
      
      logger.info(`Subscription deleted: ${req.params.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, null, 'Subscription deleted successfully');
    } catch (error) {
      logger.error('Delete subscription error:', error);
      return ApiResponse.error(res, 'Failed to delete subscription', 500);
    }
  }

  // Get upcoming subscription reminders (next 7 days)
  static async getUpcomingReminders(req, res) {
    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcomingSubscriptions = await Subscription.findAll({
        where: {
          userId: req.user.id,
          isActive: true,
          reminderEnabled: true,
          nextPaymentDate: {
            [Op.between]: [today, nextWeek]
          }
        },
        order: [['nextPaymentDate', 'ASC']]
      });

      return ApiResponse.success(res, { upcomingSubscriptions }, 'Upcoming subscription reminders retrieved successfully');
    } catch (error) {
      logger.error('Get upcoming reminders error:', error);
      return ApiResponse.error(res, 'Failed to retrieve upcoming reminders', 500);
    }
  }

  // Get subscriptions due for payment today
  static async getDueToday(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      const dueToday = await Subscription.findAll({
        where: {
          userId: req.user.id,
          isActive: true,
          nextPaymentDate: today
        },
        order: [['nextPaymentDate', 'ASC']]
      });

      return ApiResponse.success(res, { dueToday }, 'Subscriptions due today retrieved successfully');
    } catch (error) {
      logger.error('Get subscriptions due today error:', error);
      return ApiResponse.error(res, 'Failed to retrieve subscriptions due today', 500);
    }
  }

  // Update next payment date after payment
  static async updateNextPaymentDate(req, res) {
    try {
      const subscription = await Subscription.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!subscription) {
        return ApiResponse.error(res, 'Subscription not found', 404);
      }

      // Calculate next payment date based on billing cycle
      const currentDate = new Date(subscription.nextPaymentDate);
      let nextDate = new Date(currentDate);

      switch (subscription.billingCycle) {
        case 'Weekly':
          nextDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Monthly':
          nextDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'Quarterly':
          nextDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'Yearly':
          nextDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          nextDate.setMonth(currentDate.getMonth() + 1);
      }

      await subscription.update({ nextPaymentDate: nextDate.toISOString().split('T')[0] });
      
      logger.info(`Subscription next payment date updated: ${subscription.id} by user: ${req.user.id}`);
      return ApiResponse.success(res, { subscription }, 'Next payment date updated successfully');
    } catch (error) {
      logger.error('Update next payment date error:', error);
      return ApiResponse.error(res, 'Failed to update next payment date', 500);
    }
  }

  // Get subscription spending summary
  static async getSpendingSummary(req, res) {
    try {
      const summary = await Subscription.findAll({
        where: { 
          userId: req.user.id,
          isActive: true
        },
        attributes: [
          'billingCycle',
          'category',
          [Subscription.sequelize.fn('SUM', Subscription.sequelize.col('amount')), 'totalAmount'],
          [Subscription.sequelize.fn('COUNT', Subscription.sequelize.col('id')), 'count']
        ],
        group: ['billingCycle', 'category'],
        order: [[Subscription.sequelize.fn('SUM', Subscription.sequelize.col('amount')), 'DESC']]
      });

      const monthlyTotal = await Subscription.sum('amount', {
        where: { 
          userId: req.user.id,
          isActive: true,
          billingCycle: 'Monthly'
        }
      });

      const yearlyTotal = await Subscription.sum('amount', {
        where: { 
          userId: req.user.id,
          isActive: true,
          billingCycle: 'Yearly'
        }
      });

      return ApiResponse.success(res, { 
        summary, 
        monthlyTotal: monthlyTotal || 0,
        yearlyTotal: yearlyTotal || 0
      }, 'Subscription spending summary retrieved successfully');
    } catch (error) {
      logger.error('Get subscription spending summary error:', error);
      return ApiResponse.error(res, 'Failed to retrieve subscription spending summary', 500);
    }
  }
}

module.exports = SubscriptionController;