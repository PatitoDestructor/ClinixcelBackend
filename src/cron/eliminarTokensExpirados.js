const cron = require('node-cron');
const { TokenBlacklist } = require('../models/tokenBlackList.model');
const { Op } = require('sequelize');

cron.schedule('0 * * * *', async () => {
    try {
        const eliminados = await TokenBlacklist.destroy({
            where: { expiracion: { [Op.lt]: new Date() } },
        });

        if (eliminados > 0) {
            console.log(`🧹 Tokens expirados eliminados: ${eliminados}`);
        }
    } catch (error) {
        console.error('❌ Error limpiando tokens:', error.message);
    }
});
