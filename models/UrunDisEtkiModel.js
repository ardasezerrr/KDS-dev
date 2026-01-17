const { pool, dbConnected } = require('../config/database');

class UrunDisEtkiModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT ude.*, u.urun_adi, d.parametre_adi 
             FROM urundisetki ude 
             LEFT JOIN urunler u ON ude.urun_id = u.urun_id 
             LEFT JOIN discevreverileri d ON ude.parametre_id = d.veri_id 
             ORDER BY ude.etki_id`
        );
        return rows;
    }

    static async getByUrunId(urunId) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT ude.*, d.parametre_adi 
             FROM urundisetki ude 
             LEFT JOIN discevreverileri d ON ude.parametre_id = d.veri_id 
             WHERE ude.urun_id = ?`,
            [urunId]
        );
        return rows;
    }

    static async create(urun_id, parametre_id, etki_katsayisi) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO urundisetki (urun_id, parametre_id, etki_katsayisi) VALUES (?, ?, ?)',
            [urun_id, parametre_id, etki_katsayisi]
        );
        return result.insertId;
    }
}

module.exports = UrunDisEtkiModel;
