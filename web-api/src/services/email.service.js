const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendSubscriptionReminder(user, subscription) {
    try {
      const mailOptions = {
        from: config.email.user,
        to: user.email,
        subject: `Subscription Payment Reminder - ${subscription.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Subscription Payment Reminder</h2>
            <p>Hello ${user.firstName},</p>
            <p>This is a friendly reminder that your subscription payment is due soon:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>${subscription.name}</h3>
              <p><strong>Amount:</strong> $${subscription.amount}</p>
              <p><strong>Next Payment Date:</strong> ${subscription.nextPaymentDate}</p>
              <p><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
            </div>
            
            <p>Please ensure you have sufficient funds in your account to avoid any service interruption.</p>
            
            <p>Best regards,<br>The Xpensify Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Subscription reminder email sent to ${user.email}`);
    } catch (error) {
      logger.error('Failed to send subscription reminder email:', error);
      throw error;
    }
  }

  async sendDebtReminder(user, debt) {
    try {
      const mailOptions = {
        from: config.email.user,
        to: user.email,
        subject: `Debt Payment Reminder - ${debt.description}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Debt Payment Reminder</h2>
            <p>Hello ${user.firstName},</p>
            <p>This is a reminder about your upcoming debt payment:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>${debt.description}</h3>
              <p><strong>Amount:</strong> $${debt.amount}</p>
              <p><strong>Counterparty:</strong> ${debt.counterpartyName}</p>
              <p><strong>Due Date:</strong> ${debt.repaymentDate}</p>
              <p><strong>Direction:</strong> ${debt.direction === 'OwedByMe' ? 'You owe' : 'Owed to you'}</p>
            </div>
            
            <p>Please make arrangements to settle this debt on time.</p>
            
            <p>Best regards,<br>The Xpensify Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Debt reminder email sent to ${user.email}`);
    } catch (error) {
      logger.error('Failed to send debt reminder email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();