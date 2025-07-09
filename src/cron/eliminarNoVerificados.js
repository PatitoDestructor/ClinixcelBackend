const cron = require('node-cron');
const { Usuario } = require('../models/usuario.model');
const { Op } = require('sequelize');

cron.schedule('0 16 * * *', async () => {
    try {

        const eliminados = await Usuario.destroy({
        where: {
            verificado: false,
        },
        });

        if (eliminados > 0) {
        console.log(`🧹 Usuarios no verificados eliminados: ${eliminados}`);
        }
    } catch (error) {
        console.error('❌ Error al eliminar usuarios no verificados:', error.message);
    }
    
}, {
    timezone: 'America/Bogota',
});
