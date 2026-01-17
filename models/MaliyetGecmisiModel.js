const { pool, dbConnected } = require('../config/database');

class MaliyetGecmisiModel {
    static async getAll() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT m.*, u.urun_adi,
                    ROUND((m.satis_fiyati - m.maliyet) / m.satis_fiyati * 100, 1) as kar_marji,
                    YEAR(m.kayit_tarihi) as yil
             FROM maliyetgecmisi m 
             LEFT JOIN urunler u ON m.urun_id = u.urun_id 
             ORDER BY u.urun_id, m.kayit_tarihi`
        );
        return rows;
    }

    static async getByUrunId(urunId) {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(
            `SELECT *, 
                    ROUND((satis_fiyati - maliyet) / satis_fiyati * 100, 1) as kar_marji,
                    YEAR(kayit_tarihi) as yil
             FROM maliyetgecmisi WHERE urun_id = ? ORDER BY kayit_tarihi`,
            [urunId]
        );
        return rows;
    }

    static async getUrunMaliyetAnalizi() {
        if (!dbConnected || !pool) {
            throw new Error('Veritabanı bağlantısı yok');
        }
        const [rows] = await pool.execute(`
            SELECT 
                u.urun_id,
                u.urun_adi,
                k.kategori_adi,
                MIN(m.maliyet) as ilk_maliyet,
                MAX(m.maliyet) as son_maliyet,
                MIN(m.satis_fiyati) as ilk_fiyat,
                MAX(m.satis_fiyati) as son_fiyat,
                ROUND((MAX(m.maliyet) - MIN(m.maliyet)) / MIN(m.maliyet) * 100, 1) as maliyet_artis_yuzdesi,
                ROUND((MAX(m.satis_fiyati) - MIN(m.satis_fiyati)) / MIN(m.satis_fiyati) * 100, 1) as fiyat_artis_yuzdesi,
                ROUND(AVG((m.satis_fiyati - m.maliyet) / m.satis_fiyati * 100), 1) as ortalama_kar_marji
            FROM maliyetgecmisi m
            JOIN urunler u ON m.urun_id = u.urun_id
            LEFT JOIN kategoriler k ON u.kategori_id = k.kategori_id
            GROUP BY u.urun_id, u.urun_adi, k.kategori_adi
            ORDER BY maliyet_artis_yuzdesi DESC
        `);
        return rows;
    }
}

module.exports = MaliyetGecmisiModel;
