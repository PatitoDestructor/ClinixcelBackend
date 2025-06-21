const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Catalogo } = require('./catalogo.model.js');

const Categoria = sequelize.define('Categoria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'categoria',
    timestamps: false,
});

// Relación entre Categoria y Catalogo
Categoria.hasMany(Catalogo, { foreignKey: 'categoriaId', sourceKey: 'id', as: 'catalogo' });
Catalogo.belongsTo(Categoria, { foreignKey: 'categoriaId', targetKey: 'id', as: 'categoria' });

module.exports = { Categoria };