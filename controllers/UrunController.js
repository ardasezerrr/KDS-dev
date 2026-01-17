const UrunModel = require('../models/UrunModel');
const mockData = require('./mockData');

class UrunController {
    static async getUrunler(req, res) {
        try {
            const data = await UrunModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Ürünler getirme hatası:', error);
            res.json({ success: true, data: mockData.mockUrunler, mock: true });
        }
    }

    static async getUrunById(req, res) {
        try {
            const { id } = req.params;
            const data = await UrunModel.getById(id);
            if (!data) {
                return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
            }
            res.json({ success: true, data });
        } catch (error) {
            console.error('Ürün getirme hatası:', error);
            const urun = mockData.mockUrunler.find(u => u.urun_id == req.params.id);
            if (!urun) {
                return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
            }
            res.json({ success: true, data: urun, mock: true });
        }
    }

    static async createUrun(req, res) {
        try {
            const { kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari } = req.body;
            const id = await UrunModel.create(kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari);
            res.json({ success: true, message: 'Ürün başarıyla eklendi', id });
        } catch (error) {
            console.error('Ürün oluşturma hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async updateUrun(req, res) {
        try {
            const { id } = req.params;
            const { kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari } = req.body;
            await UrunModel.update(id, kategori_id, urun_adi, birim_maliyet, satis_fiyati, stok_miktari);
            res.json({ success: true, message: 'Ürün başarıyla güncellendi' });
        } catch (error) {
            console.error('Ürün güncelleme hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async deleteUrun(req, res) {
        try {
            const { id } = req.params;
            await UrunModel.delete(id);
            res.json({ success: true, message: 'Ürün başarıyla silindi' });
        } catch (error) {
            console.error('Ürün silme hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = UrunController;
