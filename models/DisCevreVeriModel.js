const { pool, dbConnected } = require('../config/database');

class DisCevreVeriModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute('SELECT * FROM discevreverileri ORDER BY veri_id');
        return rows;
    }

    static async create(parametre_adi, deger, kayit_tarihi) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO discevreverileri (parametre_adi, deger, kayit_tarihi) VALUES (?, ?, ?)',
            [parametre_adi, deger, kayit_tarihi || new Date().toISOString().split('T')[0]]
        );
        return result.insertId;
    }

    static async update(id, parametre_adi, deger, kayit_tarihi) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        await pool.execute(
            'UPDATE discevreverileri SET parametre_adi = ?, deger = ?, kayit_tarihi = ? WHERE veri_id = ?',
            [parametre_adi, deger, kayit_tarihi, id]
        );
        return true;
    }
}

module.exports = DisCevreVeriModel;
