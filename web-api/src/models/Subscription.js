const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  billingCycle: {
    type: DataTypes.ENUM('Weekly', 'Monthly', 'Quarterly', 'Yearly'),
    allowNull: false,
    defaultValue: 'Monthly'
  },
  nextPaymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'Streaming', 'Internet', 'Utility', 'Software', 'News', 
      'Gaming', 'Fitness', 'Music', 'Education', 'Other'
    ),
    defaultValue: 'Other'
  },
  reminderEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

// Associations
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });

module.exports = Subscription;