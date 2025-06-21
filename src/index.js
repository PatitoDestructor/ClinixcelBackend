require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {connection} = require("./database/connection");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
//Sesión con Google
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
//Cron(Tarea programda)
require('./cron/eliminarNoVerificados');
require('./cron/eliminarTokensExpirados');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(session({
    secret: 'secreto-clinixcel',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuración de rutas
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use('/api/roles', require('./routes/role.routes'));
app.use("/api/estados", require("./routes/estado.routes"));

(async () => {
    await connection();
})();

app.listen(port, () => {
    console.log(`El server está funcionando en el puerto ${port}`);
});