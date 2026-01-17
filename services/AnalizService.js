const { pool, dbConnected } = require('../config/database');

class AnalizService {
    static async karMarjiRiskAnalizi(alt_limit_yuzde) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'CALL KarMarjiRiskAnalizi(?)',
            [alt_limit_yuzde]
        );
        return rows[0];
    }

    static async karOdakliFiyatOnerisi(hedef_marj_yuzde) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'CALL KarOdakliFiyatOnerisi(?)',
            [hedef_marj_yuzde]
        );
        return rows[0];
    }

    static async sezonlukStokButceAnalizi() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute('CALL SezonlukStokButceAnalizi()');
        return rows[0];
    }
}

module.exports = AnalizService;
