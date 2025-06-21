require("dotenv").config();
const { sequelize } = require("./database/connection.js");
const { Role } = require("./models/role.model");
const { Estado } = require('./models/estado.model.js');


const seedRoles = async () => {
try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");

    // Estados
    const estadosData = [
        { id: 1, nombre: 'Activo', descripcion: 'Estado activo del registro'},
        { id: 2, nombre: 'Inactivo', descripcion: 'Estado inactivo del registro'}
    ];

    for (const estado of estadosData) {
        await Estado.findOrCreate({ where: { nombre: estado.nombre }, defaults: estado });
    }
    // Roles
    const roles = [
        { id: 1, nombre: "Administrador", estadoId: 1 },
        { id: 2, nombre: "Usuario", estadoId: 1 }
    ];

    for (const rol of roles) {
        await Role.findOrCreate({
        where: { id: rol.id },
        defaults: rol,
    });
    }

    console.log("🎉 Roles insertados o ya existentes.");
    process.exit(); // Finaliza el script correctamente
} catch (error) {
    console.error("❌ Error en el seeding:", error);
    process.exit(1);
}
};

seedRoles();
