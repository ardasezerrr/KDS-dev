const express = require('express');
const router = express.Router();

const UrunController = require('../controllers/UrunController');
const KategoriController = require('../controllers/KategoriController');
const AnalizController = require('../controllers/AnalizController');

const DisCevreVeriModel = require('../models/DisCevreVeriModel');
const RakipFiyatModel = require('../models/RakipFiyatModel');
const SenaryoAnalizModel = require('../models/SenaryoAnalizModel');
const UrunDisEtkiModel = require('../models/UrunDisEtkiModel');
const MaliyetGecmisiModel = require('../models/MaliyetGecmisiModel');
const mockData = require('../controllers/mockData');

router.get('/urunler', UrunController.getUrunler);
router.get('/urunler/:id', UrunController.getUrunById);

router.get('/kategoriler', KategoriController.getKategoriler);
router.get('/kategoriler/:id', KategoriController.getKategoriById);

router.get('/discevreverileri', async (req, res) => {
    try {
        const data = await DisCevreVeriModel.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: mockData.mockDisCevreVerileri, mock: true });
    }
});

router.get('/rakipfiyatlari', async (req, res) => {
    try {
        const data = await RakipFiyatModel.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: mockData.mockRakipFiyatlari, mock: true });
    }
});
router.get('/rakipfiyatlari/urun/:urunId', async (req, res) => {
    try {
        const data = await RakipFiyatModel.getByUrunId(req.params.urunId);
        res.json({ success: true, data });
    } catch (error) {
        const filtered = mockData.mockRakipFiyatlari.filter(r => r.urun_id == req.params.urunId);
        res.json({ success: true, data: filtered, mock: true });
    }
});

router.get('/senaryoanalizleri', async (req, res) => {
    try {
        const data = await SenaryoAnalizModel.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: mockData.mockSenaryoAnalizleri, mock: true });
    }
});
router.get('/senaryoanalizleri/urun/:urunId', async (req, res) => {
    try {
        const data = await SenaryoAnalizModel.getByUrunId(req.params.urunId);
        res.json({ success: true, data });
    } catch (error) {
        const filtered = mockData.mockSenaryoAnalizleri.filter(s => s.urun_id == req.params.urunId);
        res.json({ success: true, data: filtered, mock: true });
    }
});

router.get('/urundisetki', async (req, res) => {
    try {
        const data = await UrunDisEtkiModel.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: mockData.mockUrunDisEtki, mock: true });
    }
});
router.get('/urundisetki/urun/:urunId', async (req, res) => {
    try {
        const data = await UrunDisEtkiModel.getByUrunId(req.params.urunId);
        res.json({ success: true, data });
    } catch (error) {
        const filtered = mockData.mockUrunDisEtki.filter(e => e.urun_id == req.params.urunId);
        res.json({ success: true, data: filtered, mock: true });
    }
});

router.get('/maliyetgecmisi', async (req, res) => {
    try {
        const data = await MaliyetGecmisiModel.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: mockData.mockMaliyetGecmisi, mock: true });
    }
});
router.get('/maliyetgecmisi/urun/:urunId', async (req, res) => {
    try {
        const data = await MaliyetGecmisiModel.getByUrunId(req.params.urunId);
        res.json({ success: true, data });
    } catch (error) {
        const filtered = mockData.mockMaliyetGecmisi.filter(m => m.urun_id == req.params.urunId);
        res.json({ success: true, data: filtered, mock: true });
    }
});
router.get('/maliyetgecmisi/analiz', async (req, res) => {
    try {
        const data = await MaliyetGecmisiModel.getUrunMaliyetAnalizi();
        res.json({ success: true, data });
    } catch (error) {
        const analiz = mockData.mockUrunler.slice(0, 5).map(u => ({
            urun_id: u.urun_id,
            urun_adi: u.urun_adi,
            kategori_adi: u.kategori_adi,
            ilk_maliyet: u.birim_maliyet * 0.5,
            son_maliyet: u.birim_maliyet,
            maliyet_artis_yuzdesi: 100,
            ortalama_kar_marji: ((u.satis_fiyati - u.birim_maliyet) / u.satis_fiyati * 100).toFixed(1)
        }));
        res.json({ success: true, data: analiz, mock: true });
    }
});

router.post('/analiz/kar-marji-risk', AnalizController.karMarjiRiskAnalizi);
router.post('/analiz/kar-odakli-fiyat', AnalizController.karOdakliFiyatOnerisi);
router.post('/analiz/sezonluk-stok-butce', AnalizController.sezonlukStokButceAnalizi);

router.post('/simulasyon', AnalizController.yazSezonuSimulasyon);

router.post('/urunler', UrunController.createUrun);
router.put('/urunler/:id', UrunController.updateUrun);
router.delete('/urunler/:id', UrunController.deleteUrun);

router.post('/discevreverileri', async (req, res) => {
    try {
        const { parametre_adi, deger, kayit_tarihi } = req.body;
        const id = await DisCevreVeriModel.create(parametre_adi, deger, kayit_tarihi);
        res.json({ success: true, message: 'Dış çevre verisi başarıyla eklendi', id });
    } catch (error) {
        res.json({ success: true, message: 'Veri eklendi (demo mod)', id: 100, mock: true });
    }
});
router.put('/discevreverileri/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { parametre_adi, deger, kayit_tarihi } = req.body;
        await DisCevreVeriModel.update(id, parametre_adi, deger, kayit_tarihi);
        res.json({ success: true, message: 'Dış çevre verisi başarıyla güncellendi' });
    } catch (error) {
        res.json({ success: true, message: 'Veri güncellendi (demo mod)', mock: true });
    }
});

router.post('/senaryoanalizleri', async (req, res) => {
    try {
        const { urun_id, senaryo_adi, beklenen_maliyet_artisi, tahmini_kar_etkisi } = req.body;
        const id = await SenaryoAnalizModel.create(urun_id, senaryo_adi, beklenen_maliyet_artisi, tahmini_kar_etkisi);
        res.json({ success: true, message: 'Senaryo analizi başarıyla eklendi', id });
    } catch (error) {
        res.json({ success: true, message: 'Senaryo eklendi (demo mod)', id: 100, mock: true });
    }
});

router.post('/rakipfiyatlari', async (req, res) => {
    try {
        const { urun_id, rakip_adi, rakip_fiyat, tarih } = req.body;
        const id = await RakipFiyatModel.create(urun_id, rakip_adi, rakip_fiyat, tarih);
        res.json({ success: true, message: 'Rakip fiyatı başarıyla eklendi', id });
    } catch (error) {
        res.json({ success: true, message: 'Rakip fiyatı eklendi (demo mod)', id: 100, mock: true });
    }
});

router.post('/kategoriler', KategoriController.createKategori);
router.put('/kategoriler/:id', KategoriController.updateKategori);

router.post('/urundisetki', async (req, res) => {
    try {
        const { urun_id, parametre_id, etki_katsayisi } = req.body;
        const id = await UrunDisEtkiModel.create(urun_id, parametre_id, etki_katsayisi);
        res.json({ success: true, message: 'Ürün dış etki tanımı başarıyla eklendi', id });
    } catch (error) {
        res.json({ success: true, message: 'Etki eklendi (demo mod)', id: 100, mock: true });
    }
});

module.exports = router;
