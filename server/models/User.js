const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Additional fields for child profile
    motherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    moduleProgress: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '{}'
    },
    earnedBadges: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '["explorer", "beginner"]'
    },
    assessmentResult: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'null'
    },
    activities: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]'
    },
    dailyTimeSpent: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '{}'
    }
});

module.exports = User;
