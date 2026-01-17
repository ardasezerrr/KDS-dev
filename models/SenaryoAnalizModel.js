const { pool, dbConnected } = require('../config/database');

class SenaryoAnalizModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT s.*, u.urun_adi 
             FROM senaryoanalizleri s 
             LEFT JOIN urunler u ON s.urun_id = u.urun_id 
             ORDER BY s.senaryo_id`
        );
        return rows;
    }

    static async getByUrunId(urunId) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'SELECT * FROM senaryoanalizleri WHERE urun_id = ? ORDER BY senaryo_id',
            [urunId]
        );
        return rows;
    }

    static async create(urun_id, senaryo_adi, beklenen_maliyet_artisi, tahmini_kar_etkisi) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO senaryoanalizleri (urun_id, senaryo_adi, beklenen_maliyet_artisi, tahmini_kar_etkisi) VALUES (?, ?, ?, ?)',
            [urun_id, senaryo_adi, beklenen_maliyet_artisi, tahmini_kar_etkisi]
        );
        return result.insertId;
    }
}

module.exports = SenaryoAnalizModel;
