const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = { TokenBlacklist };
