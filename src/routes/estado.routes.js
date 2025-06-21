const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estado.controller');
const { verificarToken } = require('../middlewares/auth');

// CRUD de estados
router.post('/crearEstado', /*verificarToken,*/ estadoController.crearEstado);
router.get('/buscarEstados', verificarToken, estadoController.obtenerEstados);
router.get('/buscarEstado/:id', verificarToken, estadoController.obtenerEstado);
router.put('/actualizarEstado/:id', verificarToken, estadoController.actualizarEstado);
router.delete('/eliminarEstado/:id', verificarToken, estadoController.eliminarEstado);

module.exports = router;
