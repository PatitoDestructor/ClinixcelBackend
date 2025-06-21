const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Usuario } = require('../models/usuario.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/usuarios/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await Usuario.findOne({ where: { email: profile.emails[0].value } });

        if (existingUser) {
            return done(null, existingUser);
        }

        // Crear nuevo usuario si no existe
        const nuevoUsuario = await Usuario.create({
            nombre: profile.displayName,
            email: profile.emails[0].value,
            telefono: '', // no viene desde Google
            password: '', // opcional si usas Google
            direccion: '',
            roleId: 2,
            estadoId: 1,
            verificado: true,
            authProvider: 'google'
        });

        done(null, nuevoUsuario);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await Usuario.findByPk(id);
    done(null, user);
});
