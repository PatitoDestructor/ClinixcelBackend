const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { verificarToken } = require('../middlewares/auth');
const passport = require('passport');



// Rutas públicas
router.post('/registro', usuarioController.registro);
router.post('/verificar', usuarioController.verificar);
router.post('/reenviarCodigo', usuarioController.reenviarCodigo);
router.post('/login', usuarioController.login);
router.post('/solicitarRecuperacion', usuarioController.solicitarRecuperacion);
router.post('/validarCodigoRecuperacion', usuarioController.validarCodigoRecuperacion);
router.post('/restablecerContrasena', usuarioController.restablecerContrasena);


// Rutas protegidas
router.post('/cerrarSesion', verificarToken, usuarioController.cerrarSesion);
router.get('/todosUsuarios', verificarToken, usuarioController.obtenerUsuarios);
router.get('/usuarioPorId/:id', verificarToken, usuarioController.obtenerUsuario);
router.put('/actualizarUsuario/:id', verificarToken, usuarioController.actualizarUsuario);
router.delete('/eliminarUsuario/:id', verificarToken, usuarioController.eliminarUsuario);
router.put('/completarPerfil', verificarToken, usuarioController.completarPerfil);



// Iniciar login con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        const { generarJWT } = require('../utils/generarJWT'); // o donde lo tengas
        const token = generarJWT(req.user.id);
        res.json({ token });
    }
);

module.exports = router;
