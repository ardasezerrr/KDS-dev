const { pool, dbConnected } = require('../config/database');

class KategoriModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute('SELECT * FROM kategoriler ORDER BY kategori_id');
        return rows;
    }

    static async getById(id) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute('SELECT * FROM kategoriler WHERE kategori_id = ?', [id]);
        return rows[0] || null;
    }

    static async create(kategori_adi, hedef_kar_orani) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO kategoriler (kategori_adi, hedef_kar_orani) VALUES (?, ?)',
            [kategori_adi, hedef_kar_orani || 55.00]
        );
        return result.insertId;
    }

    static async update(id, kategori_adi, hedef_kar_orani) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        await pool.execute(
            'UPDATE kategoriler SET kategori_adi = ?, hedef_kar_orani = ? WHERE kategori_id = ?',
            [kategori_adi, hedef_kar_orani, id]
        );
        return true;
    }
}

module.exports = KategoriModel;
