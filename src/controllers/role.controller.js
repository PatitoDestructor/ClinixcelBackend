const { Role } = require('../models/role.model');

// Crear un nuevo rol
exports.crearRol = async (req, res) => {
    try {
    const { nombre, estadoId } = req.body;

    if (!nombre || !estadoId) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const nuevoRol = await Role.create({ nombre, estadoId });
    res.status(201).json(nuevoRol);
    } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Obtener todos los roles
exports.obtenerRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        console.error("Error al obtener roles:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Obtener un rol por ID
exports.obtenerRol = async (req, res) => {
try {
    const { id } = req.params;
    const rol = await Role.findByPk(id);
    if (!rol) {
        return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json(rol);
} catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
}
};

// Actualizar un rol
exports.actualizarRol = async (req, res) => {
try {
    const { id } = req.params;
    const { nombre, estadoId } = req.body;

    const rol = await Role.findByPk(id);
    if (!rol) {
        return res.status(404).json({ mensaje: "Rol no encontrado" });
    }

    rol.nombre = nombre ?? rol.nombre;
    rol.estadoId = estadoId ?? rol.estadoId;
    await rol.save();

    res.json({ mensaje: "Rol actualizado correctamente", rol });
} catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
}
};

// Eliminar un rol
exports.eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await Role.findByPk(id);

        if (!rol) {
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }

        // Estado "inactivo"
        const estadoInactivo = 2;

        // Actualizar estado del rol y de los usuarios que lo tienen
        await Usuario.update({ estadoId: estadoInactivo }, { where: { roleId: id } });
        await rol.update({ estadoId: estadoInactivo });

        res.status(200).json({ mensaje: "Rol desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al desactivar el rol", error });
    }
};
