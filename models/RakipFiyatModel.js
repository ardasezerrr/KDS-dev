const { pool, dbConnected } = require('../config/database');

class RakipFiyatModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT r.*, u.urun_adi 
             FROM rakipfiyatlari r 
             LEFT JOIN urunler u ON r.urun_id = u.urun_id 
             ORDER BY r.tarih DESC, r.rakip_id`
        );
        return rows;
    }

    static async getByUrunId(urunId) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'SELECT * FROM rakipfiyatlari WHERE urun_id = ? ORDER BY tarih DESC',
            [urunId]
        );
        return rows;
    }

    static async create(urun_id, rakip_adi, rakip_fiyat, tarih) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO rakipfiyatlari (urun_id, rakip_adi, rakip_fiyat, tarih) VALUES (?, ?, ?, ?)',
            [urun_id, rakip_adi, rakip_fiyat, tarih || new Date().toISOString().split('T')[0]]
        );
        return result.insertId;
    }
}

module.exports = RakipFiyatModel;
