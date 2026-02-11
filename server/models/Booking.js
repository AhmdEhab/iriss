const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    specialistId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    specialistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    childName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'confirmed'
    }
});

module.exports = Booking;
