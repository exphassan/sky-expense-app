const cron = require('node-cron');
const { Subscription, Debt, User } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class ReminderService {
  static init() {
    // Run subscription reminders daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      await this.sendSubscriptionReminders();
    });

    // Run debt reminders daily at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
      await this.sendDebtReminders();
    });

    // Update overdue debts daily at 11:00 PM
    cron.schedule('0 23 * * *', async () => {
      await this.updateOverdueDebts();
    });

    logger.info('Reminder service scheduled jobs initialized');
  }

  static async sendSubscriptionReminders() {
    try {
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
      
      const subscriptionsToRemind = await Subscription.findAll({
        where: {
          reminderEnabled: true,
          isActive: true,
          nextPaymentDate: twoDaysFromNow.toISOString().split('T')[0]
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstName']
        }]
      });

      for (const subscription of subscriptionsToRemind) {
        try {
          await emailService.sendSubscriptionReminder(subscription.user, subscription);
          logger.info(`Subscription reminder sent for: ${subscription.name} to user: ${subscription.user.email}`);
        } catch (error) {
          logger.error(`Failed to send subscription reminder for ${subscription.name}:`, error);
        }
      }

      logger.info(`Processed ${subscriptionsToRemind.length} subscription reminders`);
    } catch (error) {
      logger.error('Error in sendSubscriptionReminders:', error);
    }
  }

  static async sendDebtReminders() {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      
      const debtsToRemind = await Debt.findAll({
        where: {
          status: 'Active',
          repaymentDate: threeDaysFromNow.toISOString().split('T')[0]
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstName']
        }]
      });

      for (const debt of debtsToRemind) {
        try {
          await emailService.sendDebtReminder(debt.user, debt);
          logger.info(`Debt reminder sent for: ${debt.description} to user: ${debt.user.email}`);
        } catch (error) {
          logger.error(`Failed to send debt reminder for ${debt.description}:`, error);
        }
      }

      logger.info(`Processed ${debtsToRemind.length} debt reminders`);
    } catch (error) {
      logger.error('Error in sendDebtReminders:', error);
    }
  }

  static async updateOverdueDebts() {
    try {
      const today = new Date();
      const [updatedRows] = await Debt.update(
        { status: 'Overdue' },
        {
          where: {
            status: 'Active',
            repaymentDate: {
              [Op.lt]: today
            }
          }
        }
      );

      logger.info(`Updated ${updatedRows} debts to overdue status`);
    } catch (error) {
      logger.error('Error in updateOverdueDebts:', error);
    }
  }
}

module.exports = ReminderService;