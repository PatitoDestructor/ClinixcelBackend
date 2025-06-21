exports.htmlCodigoVerificacion = (codigo) => `
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
<div style="max-width: 400px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 20px; text-align: center; position: relative;">
    <div style="background-color: #99f8c2; border-radius: 9999px; width: 60px; height: 60px; margin: 0 auto 20px; position: relative;">
    </div>
    <h2 style="color: #37529f; font-size: 18px; margin-bottom: 10px;">Registro Exitoso</h2>
    <p style="color: #595b5f; font-size: 14px;">Solo queda proporcionar el código de verificación y tu registro estará totalmente confirmado y finalizado.</p>
    <div style="margin-top: 30px; background-color: #37529f; color: #fff; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 16px;">
    Código: ${codigo}
    </div>
    <p style="margin-top: 40px; font-size: 11px; color: #7c7f83;">&copy; 2025 Clinix Max. <br>Todos los derechos reservados.</p>
</div>
</body>
`;

exports.htmlCodigoRecuperacion = (codigo) => `
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
<div style="max-width: 400px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 20px; text-align: center; position: relative;">
    <div style="background-color: #99f8c2; border-radius: 9999px; width: 60px; height: 60px; margin: 0 auto 20px; position: relative;">
    </div>
    <h2 style="color: #37529f; font-size: 18px; margin-bottom: 10px;">Restablecer Contraseña</h2>
    <p style="color: #595b5f; font-size: 14px;">Aqui está tu código de recuperación: <br> (Recuerda que expira en 10 minutos.)</p>
    <div style="margin-top: 30px; background-color: #37529f; color: #fff; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 16px;">
    Código: ${codigo}
    </div>
    <p style="margin-top: 40px; font-size: 11px; color: #7c7f83;">&copy; 2025 Clinix Max. <br>Todos los derechos reservados.</p>
</div>
</body>
`;
