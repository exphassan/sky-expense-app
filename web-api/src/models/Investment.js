const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Investment = sequelize.define('Investment', {
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
  investmentType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expectedReturnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  currentValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  returnRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'investments',
  timestamps: true
});

// Associations
Investment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Investment, { foreignKey: 'userId', as: 'investments' });

module.exports = Investment;