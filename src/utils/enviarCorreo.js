const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS  // tu contraseña o app password
    }
});

async function enviarCorreo(destinatario, asunto, mensaje) {
    await transporter.sendMail({
        from: `"ClinixCel" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        html: mensaje,
    });
}

module.exports = { enviarCorreo };
