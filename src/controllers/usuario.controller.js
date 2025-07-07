const bcrypt = require('bcrypt');
const { Usuario } = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
const { enviarCorreo } = require('../utils/enviarCorreo');
const crypto = require('crypto');
const { htmlCodigoVerificacion, htmlCodigoRecuperacion } = require('../utils/emailTemplates');
const { TokenBlacklist } = require('../models/tokenBlackList.model');


// Crear usuario
exports.crearUsuario = async (req, res) => {
    try {
    const { nombre, email, telefono, password, direccion, roleId, estadoId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        telefono,
        password: hashedPassword,
        direccion,
        roleId,
        estadoId,
    });

    res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuario por ID
exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const updated = await usuario.update(req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        await usuario.destroy();
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    if (!usuario.verificado) {
        return res.status(401).json({ mensaje: 'Debes verificar tu correo antes de iniciar sesión.' });
    }


    // Generar token JWT
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, roleId: usuario.roleId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Completar Perfil (Solo aplica para login desde google)
exports.completarPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuarioId; // viene del middleware del token
        const { telefono, direccion } = req.body;

        // Validación básica
        if (!telefono || !direccion) {
            return res.status(400).json({ mensaje: 'Teléfono y dirección son obligatorios' });
        }

        // Validar teléfono colombiano
        const regexTelefono = /^3\d{9}$/;
        if (!regexTelefono.test(telefono)) {
            return res.status(400).json({
                mensaje: 'El número de teléfono debe ser colombiano y válido (10 dígitos empezando con 3)',
            });
        }

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        usuario.telefono = telefono;
        usuario.direccion = direccion;
        await usuario.save();

        res.status(200).json({ mensaje: 'Perfil completado exitosamente' });
    } catch (error) {
        console.error('❌ Error al completar perfil:', error);
        res.status(500).json({ error: 'Error al completar el perfil' });
    }
};

//Cerrar Sesión
exports.cerrarSesion = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(400).json({ mensaje: 'Token no proporcionado' });

        // Decodificar para obtener expiración
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ mensaje: 'Token inválido' });
        }

        const expiracion = new Date(decoded.exp * 1000); // en ms

        // Guardar token en blacklist
        await TokenBlacklist.create({ token, expiracion });

        return res.json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Registro
exports.registro = async (req, res) => {
    try {
        const { nombre, email, telefono, password, direccion} = req.body;

        // Verifica si ya existe
        const existente = await Usuario.findOne({ where: { email } });
        if (existente) return res.status(400).json({ mensaje: 'Email ya registrado' });
        //Validación contraseña
        const regexPassword = /^(?=.*[A-Z]).{8,}$/;
        if (!regexPassword.test(password)) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener al menos 8 caracteres y una letra mayúscula",
        });
        }
        //Validar email
        const regexEmail = /^[\w.-]+@([\w-]+\.)+(com|co|net|org)$/i;
        if (!regexEmail.test(email)) {
        return res.status(400).json({
            mensaje: "El email no tiene un formato válido o no tiene una extensión válida",
        });
        }
        //Validar teléfono colombiano
        const regexTelefono = /^3\d{9}$/;
        if (!regexTelefono.test(telefono)) {
        return res.status(400).json({
            mensaje: "El número de teléfono debe ser un número colombiano válido (10 dígitos que comienzan con 3)",
        });
        }        

        const hashedPassword = await bcrypt.hash(password, 10);
        const codigo = crypto.randomInt(100000, 999999).toString(); // 6 dígitos

        const now = new Date();
        const expiracion = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutos

        await Usuario.create({
            nombre,
            email,
            telefono,
            password: hashedPassword,
            direccion,
            roleId: 2,
            estadoId: 1,
            codigoVerificacion: codigo,
            codigoExpiracion: expiracion,
            verificado: false,
        });

        await enviarCorreo(
            email,
            'Código de verificación',
            htmlCodigoVerificacion(codigo)
        );

        res.status(200).json({ mensaje: 'Registro iniciado. Revisa tu correo para verificar.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Validad Codigo Registro
exports.verificar = async (req, res) => {
    try {
        const { email, codigo } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        if (usuario.verificado) return res.status(400).json({ mensaje: 'Usuario ya verificado' });
        if (usuario.codigoVerificacion !== codigo)
        return res.status(400).json({ mensaje: 'Código incorrecto' });
        if (new Date() > usuario.codigoExpiracion) {
            return res.status(400).json({ mensaje: 'El código ha expirado. Solicita uno nuevo.' });
        }

        usuario.verificado = true;
        usuario.codigoVerificacion = null;
        usuario.codigoExpiracion = null;
        await usuario.save();

        res.json({ mensaje: 'Usuario verificado correctamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Reenviar Codigo Registro
exports.reenviarCodigo = async (req, res) => {
try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.verificado) return res.status(400).json({ mensaje: 'Usuario ya verificado' });

    const nuevoCodigo = crypto.randomInt(100000, 999999).toString();
    const nuevaExpiracion = new Date(Date.now() + 10 * 60 * 1000);

    usuario.codigoVerificacion = nuevoCodigo;
    usuario.codigoExpiracion = nuevaExpiracion;
    await usuario.save();

    await enviarCorreo(
        email,
        'Nuevo código de verificación',
        htmlCodigoVerificacion(nuevoCodigo)
    );

    res.json({ mensaje: 'Código reenviado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Solicitar Codigo Recuperación
exports.solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const codigo = crypto.randomInt(100000, 999999).toString();
        const expiracion = new Date(Date.now() + 10 * 60 * 1000);

        usuario.codigoRecuperacion = codigo;
        usuario.codigoRecuperacionExpira = expiracion;
        await usuario.save();

        await enviarCorreo(
            email,
            'Código para restablecer contraseña',
            htmlCodigoRecuperacion(codigo)
        );

        res.json({ mensaje: 'Código enviado al correo.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Validar Codigo Recuperación
exports.validarCodigoRecuperacion = async (req, res) => {
    const { email, codigo } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || usuario.codigoRecuperacion !== codigo) {
            return res.status(400).json({ mensaje: 'Código inválido o usuario no encontrado' });
        }

        if (usuario.codigoRecuperacionExpira < new Date()) {
            return res.status(400).json({ mensaje: 'El código ha expirado' });
        }

        res.json({ mensaje: 'Código válido' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Restablecer Contraseña
exports.restablecerContrasena = async (req, res) => {
    const { email, nuevaPassword, confirmarPassword } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        if (!usuario.codigoRecuperacion || usuario.codigoRecuperacionExpira < new Date()) {
            return res.status(400).json({ mensaje: 'No hay código activo o ha expirado' });
        }

        if (nuevaPassword !== confirmarPassword) {
            return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
        }

        const regexPassword = /^(?=.*[A-Z]).{8,}$/;
        if (!regexPassword.test(nuevaPassword)) {
            return res.status(400).json({
            mensaje: 'La contraseña debe tener al menos 8 caracteres y una mayúscula',
            });
        }

        usuario.password = await bcrypt.hash(nuevaPassword, 10);
        usuario.codigoRecuperacion = null;
        usuario.codigoRecuperacionExpira = null;
        await usuario.save();

        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



