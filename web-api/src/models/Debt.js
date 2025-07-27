const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Debt = sequelize.define('Debt', {
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
            'Personal', 'Food', 'Home', 'Family', 'Transportation',
            'Gifts', 'Utility', 'Investment', 'Others'
        ),
        allowNull: false
    },
    counterpartyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },
    counterpartyEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    repaymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Active', 'Paid', 'Overdue'),
        defaultValue: 'Active'
    },
    direction: {
        type: DataTypes.ENUM('OwedByMe', 'OwedToMe'),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'debts',
    timestamps: true
});

// Associations
Debt.belongsTo(User, {foreignKey: 'userId', as: 'user'});
User.hasMany(Debt, {foreignKey: 'userId', as: 'debts'});

module.exports = Debt;