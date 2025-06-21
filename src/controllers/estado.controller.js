const { Estado } = require('../models/estado.model');

const estadoController = {
    
// Crear estado
crearEstado: async (req, res) => {
try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
    return res.status(400).json({ mensaje: "Nombre y descripción son requeridos" });
    }

    const nuevoEstado = await Estado.create({ nombre, descripcion });
    res.status(201).json(nuevoEstado);
} catch (error) {
    res.status(500).json({ mensaje: "Error al crear el estado", error });
}
},

// Obtener todos los estados
obtenerEstados: async (req, res) => {
    try {
    const estados = await Estado.findAll();
    res.status(200).json(estados);
    } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los estados", error });
    }
},

// Obtener estado por ID
obtenerEstado: async (req, res) => {
try {
    const { id } = req.params;
    const estado = await Estado.findByPk(id);

    if (!estado) {
    return res.status(404).json({ mensaje: "Estado no encontrado" });
    }

    res.status(200).json(estado);
} catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el estado", error });
}
},

// Actualizar estado
    actualizarEstado: async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const estado = await Estado.findByPk(id);
        if (!estado) {
        return res.status(404).json({ mensaje: "Estado no encontrado" });
        }

        estado.nombre = nombre || estado.nombre;
        estado.descripcion = descripcion || estado.descripcion;
        await estado.save();

        res.status(200).json(estado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el estado", error });
    }
},

// Eliminar estado
eliminarEstado: async (req, res) => {
    try {
        const { id } = req.params;

        const estado = await Estado.findByPk(id);
        if (!estado) {
            return res.status(404).json({ mensaje: 'Estado no encontrado' });
        }

        // Verificamos si está asociado a algún usuario o rol
        const usuariosAsociados = await estado.countUsuarios();
        const rolesAsociados = await estado.countRoles();

        if (usuariosAsociados > 0 || rolesAsociados > 0) {
            return res.status(400).json({
            mensaje: 'No se puede eliminar el estado porque está asociado a uno o más usuarios o roles.',
            });
        }

        await estado.destroy();
        res.status(200).json({ mensaje: 'Estado eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar estado', error });
    }
},
}

module.exports = estadoController;
