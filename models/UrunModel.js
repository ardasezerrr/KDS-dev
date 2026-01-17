const { pool, dbConnected } = require('../config/database');

class UrunModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'SELECT u.*, k.kategori_adi, k.hedef_kar_orani FROM urunler u LEFT JOIN kategoriler k ON u.kategori_id = k.kategori_id ORDER BY u.urun_id'
        );
        return rows;
    }

    static async getById(id) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            'SELECT u.*, k.kategori_adi, k.hedef_kar_orani FROM urunler u LEFT JOIN kategoriler k ON u.kategori_id = k.kategori_id WHERE u.urun_id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async create(kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [result] = await pool.execute(
            'INSERT INTO urunler (kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari) VALUES (?, ?, ?, ?, ?)',
            [kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari || 0]
        );
        return result.insertId;
    }

    static async update(id, kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [oldUrun] = await pool.execute('SELECT birim_maliyet FROM urunler WHERE urun_id = ?', [id]);
        
        if (oldUrun.length > 0 && birim_maliyet && oldUrun[0].birim_maliyet !== birim_maliyet) {
            await pool.execute(
                'INSERT INTO maliyetgecmisi (urun_id, eski_maliyet, yeni_maliyet) VALUES (?, ?, ?)',
                [id, oldUrun[0].birim_maliyet, birim_maliyet]
            );
        }
        
        await pool.execute(
            'UPDATE urunler SET kategori_id = ?, urun_adi = ?, birim_maliyet = ?, satis_fiyati = ?, stok_miktari = ? WHERE urun_id = ?',
            [kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari, id]
        );
        return true;
    }

    static async delete(id) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        await pool.execute('DELETE FROM urunler WHERE urun_id = ?', [id]);
        return true;
    }
}

module.exports = UrunModel;
