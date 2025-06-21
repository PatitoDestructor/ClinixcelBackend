const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');

const Usuario = sequelize.define('Usuario',
{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    codigoVerificacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codigoExpiracion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    codigoRecuperacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codigoRecuperacionExpira: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    authProvider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local', // 'local' o 'google'
    }

},  
{
    timestamps: true,
},
);

module.exports = { Usuario };