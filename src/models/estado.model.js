const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const {Usuario} = require('../models/usuario.model.js')
const {Role} = require('../models/role.model.js')
const {Catalogo} = require('../models/catalogo.model.js')
const { Categoria } = require('./categoria.model.js');



const Estado = sequelize.define('Estado',
{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    timestamps: false,
},
);
module.exports = { Estado };

//Relación de usuario a estados
Usuario.belongsTo(Estado, { foreignKey: 'estadoId', as: 'estadoUsuario' });
Estado.hasMany(Usuario, { foreignKey: 'estadoId', as: 'usuarios' });

//Relación de roles a estados
Role.belongsTo(Estado, {foreignKey: 'estadoId', sourceKey: 'id', as: 'estadoRoles'});
Estado.hasMany(Role, {foreignKey: 'estadoId', targetKey: 'id', as: 'roles'});

//Relación de catalogo a estados
Catalogo.belongsTo(Estado, {foreignKey: 'estadoId', sourceKey: 'id', as: 'estadoCatalogo'});
Estado.hasMany(Catalogo, {foreignKey: 'estadoId', targetKey: 'id', as: 'catalogos'});

// Relación de categoria a estados
Categoria.belongsTo(Estado, {foreignKey: 'estadoId', sourceKey: 'id', as: 'estadoCategoria'});
Estado.hasMany(Categoria, {foreignKey: 'estadoId', targetKey: 'id', as: 'categoria'});