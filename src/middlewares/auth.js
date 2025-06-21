const jwt = require('jsonwebtoken');
const { TokenBlacklist } = require('../models/tokenBlackList.model');

const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

    //Verificar si está en la blacklist
    const bloqueado = await TokenBlacklist.findOne({ where: { token } });
    if (bloqueado) return res.status(401).json({ mensaje: 'Token bloqueado. Debe iniciar sesión nuevamente' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: 'Token inválido' });

        req.usuario = decoded;
        req.usuarioId = decoded.id;
        next();
    });
};

module.exports = { verificarToken };
