const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Expense = sequelize.define('Expense', {
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
  type: {
    type: DataTypes.ENUM('Cash', 'Transfer', 'Card', 'Check'),
    defaultValue: 'Cash'
  },
  category: {
    type: DataTypes.ENUM(
      'Personal', 'Food', 'Home', 'Family', 'Transportation', 
      'Gifts', 'Utility', 'Investment', 'Savings', 'DebtRepayment', 'Others'
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
  tableName: 'expenses',
  timestamps: true
});

// Associations
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });

module.exports = Expense;