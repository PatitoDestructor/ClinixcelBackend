const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { verificarToken } = require('../middlewares/auth');

// Rutas protegidas con token
router.post('/crearRol', verificarToken, roleController.crearRol);
router.get('/buscarRoles', verificarToken, roleController.obtenerRoles);
router.get('/buscarRol/:id', verificarToken, roleController.obtenerRol);
router.put('/actualizarRol/:id', verificarToken, roleController.actualizarRol);
router.delete('/eliminarRol/:id', verificarToken, roleController.eliminarRol);

module.exports = router;
