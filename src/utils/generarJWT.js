const jwt = require('jsonwebtoken');

const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

module.exports = { generarJWT };
