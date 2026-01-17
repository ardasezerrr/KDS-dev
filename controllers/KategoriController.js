const KategoriModel = require('../models/KategoriModel');
const mockData = require('./mockData');

class KategoriController {
    static async getKategoriler(req, res) {
        try {
            const data = await KategoriModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Kategoriler getirme hatası:', error);
            res.json({ success: true, data: mockData.mockKategoriler, mock: true });
        }
    }

    static async getKategoriById(req, res) {
        try {
            const { id } = req.params;
            const data = await KategoriModel.getById(id);
            if (!data) {
                return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
            }
            res.json({ success: true, data });
        } catch (error) {
            console.error('Kategori getirme hatası:', error);
            const kategori = mockData.mockKategoriler.find(k => k.kategori_id == req.params.id);
            if (!kategori) {
                return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
            }
            res.json({ success: true, data: kategori, mock: true });
        }
    }

    static async createKategori(req, res) {
        try {
            const { kategori_adi, hedef_kar_orani } = req.body;
            const id = await KategoriModel.create(kategori_adi, hedef_kar_orani);
            res.json({ success: true, message: 'Kategori başarıyla eklendi', id });
        } catch (error) {
            console.error('Kategori oluşturma hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async updateKategori(req, res) {
        try {
            const { id } = req.params;
            const { kategori_adi, hedef_kar_orani } = req.body;
            await KategoriModel.update(id, kategori_adi, hedef_kar_orani);
            res.json({ success: true, message: 'Kategori başarıyla güncellendi' });
        } catch (error) {
            console.error('Kategori güncelleme hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = KategoriController;
