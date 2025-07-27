const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Income = sequelize.define('Income', {
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
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'Paycheck', 'Interest', 'InvestmentReturn', 'Dividend', 
      'Gift', 'Allowance', 'Other'
    ),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'incomes',
  timestamps: true
});

// Associations
Income.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Income, { foreignKey: 'userId', as: 'incomes' });

module.exports = Income;