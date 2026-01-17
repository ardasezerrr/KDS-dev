const AnalizService = require('../services/AnalizService');
const mockData = require('./mockData');

class AnalizController {
    static async karMarjiRiskAnalizi(req, res) {
        try {
            const { alt_limit_yuzde } = req.body;
            
            if (alt_limit_yuzde === undefined || alt_limit_yuzde === null) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'alt_limit_yuzde parametresi gerekli' 
                });
            }

            const data = await AnalizService.karMarjiRiskAnalizi(alt_limit_yuzde);
            res.json({ success: true, data, parametre: { alt_limit_yuzde } });
        } catch (error) {
            console.error('Kar marjı risk analizi hatası:', error);
            const riskliUrunler = mockData.mockUrunler.filter(u => {
                const kar = (u.satis_fiyati - u.birim_maliyet) / u.satis_fiyati * 100;
                return kar < req.body.alt_limit_yuzde;
            }).map(u => ({
                urun_adi: u.urun_adi,
                birim_maliyet: u.birim_maliyet,
                satis_fiyati: u.satis_fiyati,
                kar_marji_yuzde: ((u.satis_fiyati - u.birim_maliyet) / u.satis_fiyati * 100).toFixed(2)
            }));
            res.json({ success: true, data: riskliUrunler, parametre: { alt_limit_yuzde: req.body.alt_limit_yuzde }, mock: true });
        }
    }

    static async karOdakliFiyatOnerisi(req, res) {
        try {
            const { hedef_marj_yuzde } = req.body;
            
            if (hedef_marj_yuzde === undefined || hedef_marj_yuzde === null) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'hedef_marj_yuzde parametresi gerekli' 
                });
            }

            const data = await AnalizService.karOdakliFiyatOnerisi(hedef_marj_yuzde);
            res.json({ success: true, data, parametre: { hedef_marj_yuzde } });
        } catch (error) {
            console.error('Kar odaklı fiyat önerisi hatası:', error);
            const oneriler = mockData.mockUrunler.map(u => {
                const onerilen = u.birim_maliyet / (1 - req.body.hedef_marj_yuzde / 100);
                return {
                    urun_adi: u.urun_adi,
                    mevcut_maliyet: u.birim_maliyet,
                    su_anki_fiyat: u.satis_fiyati,
                    onerilen_satis_fiyati: parseFloat(onerilen.toFixed(2)),
                    yapilmasi_gereken_zam: parseFloat((onerilen - u.satis_fiyati).toFixed(2))
                };
            });
            res.json({ success: true, data: oneriler, parametre: { hedef_marj_yuzde: req.body.hedef_marj_yuzde }, mock: true });
        }
    }

    static async sezonlukStokButceAnalizi(req, res) {
        try {
            const data = await AnalizService.sezonlukStokButceAnalizi();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Sezonluk stok bütçe analizi hatası:', error);
            const kategoriAnaliz = {};
            mockData.mockUrunler.forEach(u => {
                if (!kategoriAnaliz[u.kategori_adi]) {
                    kategoriAnaliz[u.kategori_adi] = { stok: 0, maliyet: 0, kar: 0 };
                }
                kategoriAnaliz[u.kategori_adi].stok += u.stok_miktari;
                kategoriAnaliz[u.kategori_adi].maliyet += u.birim_maliyet * u.stok_miktari;
                kategoriAnaliz[u.kategori_adi].kar += (u.satis_fiyati - u.birim_maliyet) * u.stok_miktari;
            });
            
            const data = Object.entries(kategoriAnaliz).map(([kat, val]) => ({
                kategori_adi: kat,
                toplam_stok_adedi: val.stok,
                toplam_stok_maliyeti: val.maliyet,
                beklenen_toplam_kar: val.kar
            }));
            res.json({ success: true, data, mock: true });
        }
    }

    static async yazSezonuSimulasyon(req, res) {
        try {
            const { pool, dbConnected } = require('../config/database');
            const { dolarOran, pamukOran, lojistikOran, enflasyonOran } = req.body;
            
            const dolar = dolarOran || 1.0;
            const pamuk = pamukOran || 1.0;
            const lojistik = lojistikOran || 1.0;
            const enflasyonVal = enflasyonOran || 1.0;
            const kombineOran = pamuk * (1 + (lojistik - 1) * 0.3) * (1 + (enflasyonVal - 1) * 0.2);

            if (dbConnected && pool) {
                const [rows] = await pool.query('CALL sp_YazSezonuRiskAnalizi(?, ?)', [dolar, kombineOran]);
                const [rakipler] = await pool.execute(`
                    SELECT r.urun_id, r.rakip_adi, r.rakip_fiyat,
                           AVG(r.rakip_fiyat) OVER (PARTITION BY r.urun_id) as ortalama_rakip_fiyat
                        FROM rakipfiyatlari r ORDER BY r.urun_id
                `);

                const sonuclar = rows[0].map(urun => {
                    const urunRakipleri = rakipler.filter(r => r.urun_id === urun.urun_id);
                    const ortalamaRakipFiyat = urunRakipleri.length > 0 ? parseFloat(urunRakipleri[0].ortalama_rakip_fiyat) : null;
                    
                    let rekabet_durumu = 'BİLGİ YOK';
                    if (ortalamaRakipFiyat) {
                        if (parseFloat(urun.satis_fiyati) > ortalamaRakipFiyat * 1.1) rekabet_durumu = 'REKABET GÜCÜ DÜŞÜK';
                        else if (parseFloat(urun.satis_fiyati) < ortalamaRakipFiyat * 0.9) rekabet_durumu = 'REKABET AVANTAJI';
                        else rekabet_durumu = 'PİYASA ORTALAMASI';
                    }

                    let stratejik_oneri = urun.risk_durumu === 'KRİTİK' ? 'ACİL FİYAT ARTIŞI GEREKLİ' :
                        urun.risk_durumu === 'RİSK' && rekabet_durumu !== 'REKABET GÜCÜ DÜŞÜK' ? 'FİYAT ARTIŞI ÖNERİLİR' :
                        urun.risk_durumu === 'RİSK' ? 'MALİYET OPTİMİZASYONU GEREKLİ' : 'MEVCUT STRATEJİ SÜRDÜRÜLEBİLİR';

                    return { ...urun, ortalama_rakip_fiyat: ortalamaRakipFiyat?.toFixed(2) || null, rekabet_durumu, stratejik_oneri };
                });

                const kritikSayisi = sonuclar.filter(s => s.risk_durumu === 'KRİTİK').length;
                const riskliSayisi = sonuclar.filter(s => s.risk_durumu === 'RİSK').length;
                const guvenliSayisi = sonuclar.filter(s => s.risk_durumu === 'GÜVENLI').length;
                const toplamZam = sonuclar.reduce((sum, s) => sum + (parseFloat(s.gereken_zam) > 0 ? parseFloat(s.gereken_zam) : 0), 0);
                const ortalamaKarMarji = sonuclar.reduce((sum, s) => sum + parseFloat(s.yeni_kar_marji), 0) / sonuclar.length;

                res.json({ 
                    success: true, data: sonuclar,
                    ozet: { kritik_sayisi: kritikSayisi, riskli_sayisi: riskliSayisi, guvenli_sayisi: guvenliSayisi, toplam_zam_gereksinimi: toplamZam.toFixed(2), ortalama_kar_marji: ortalamaKarMarji.toFixed(2) },
                    parametreler: { dolar_oran: dolar, pamuk_oran: pamuk, dolar_degisim_yuzde: ((dolar - 1) * 100).toFixed(1), pamuk_degisim_yuzde: ((pamuk - 1) * 100).toFixed(1) }
                });
            } else {
                const hedefKar = 55;
                const sonuclar = mockData.mockUrunler.map(u => {
                    const etki = mockData.mockUrunDisEtki.find(e => e.urun_id === u.urun_id);
                    const dolarEtki = etki ? (dolar - 1) * (etki.etki_katsayisi || 0.3) : (dolar - 1) * 0.3;
                    const pamukEtki = etki ? (pamuk - 1) * (etki.etki_katsayisi || 0.3) : (pamuk - 1) * 0.3;
                    
                    const yeniMaliyet = u.birim_maliyet * (1 + dolarEtki + pamukEtki);
                    const mevcutKar = (u.satis_fiyati - u.birim_maliyet) / u.satis_fiyati * 100;
                    const yeniKar = (u.satis_fiyati - yeniMaliyet) / u.satis_fiyati * 100;
                    const gerekZam = yeniKar < hedefKar ? (yeniMaliyet / (1 - hedefKar / 100)) - u.satis_fiyati : 0;
                    
                    const rakip = mockData.mockRakipFiyatlari.find(r => r.urun_id === u.urun_id);
                    let rekabet = 'BİLGİ YOK';
                    if (rakip) {
                        if (u.satis_fiyati > rakip.rakip_fiyat * 1.1) rekabet = 'REKABET GÜCÜ DÜŞÜK';
                        else if (u.satis_fiyati < rakip.rakip_fiyat * 0.9) rekabet = 'REKABET AVANTAJI';
                        else rekabet = 'PİYASA ORTALAMASI';
                    }

                    return {
                        urun_id: u.urun_id,
                        urun_adi: u.urun_adi,
                        kategori_adi: u.kategori_adi,
                        satis_fiyati: u.satis_fiyati,
                        mevcut_maliyet: u.birim_maliyet,
                        simule_maliyet: yeniMaliyet.toFixed(2),
                        mevcut_kar_marji: mevcutKar.toFixed(2),
                        yeni_kar_marji: yeniKar.toFixed(2),
                        gereken_zam: gerekZam > 0 ? gerekZam.toFixed(2) : 0,
                        risk_durumu: yeniKar < 15 ? 'KRİTİK' : yeniKar < hedefKar ? 'RİSK' : 'GÜVENLI',
                        ortalama_rakip_fiyat: rakip?.rakip_fiyat || null,
                        rekabet_durumu: rekabet,
                        stratejik_oneri: yeniKar < 15 ? 'ACİL FİYAT ARTIŞI GEREKLİ' : yeniKar < hedefKar ? 'FİYAT ARTIŞI ÖNERİLİR' : 'MEVCUT STRATEJİ SÜRDÜRÜLEBİLİR'
                    };
                });

                const kritik = sonuclar.filter(s => s.risk_durumu === 'KRİTİK').length;
                const riskli = sonuclar.filter(s => s.risk_durumu === 'RİSK').length;
                const guvenli = sonuclar.filter(s => s.risk_durumu === 'GÜVENLI').length;
                const zamToplam = sonuclar.reduce((s, u) => s + parseFloat(u.gereken_zam || 0), 0);
                const ortKar = sonuclar.reduce((s, u) => s + parseFloat(u.yeni_kar_marji), 0) / sonuclar.length;

                res.json({
                    success: true, data: sonuclar, mock: true,
                    ozet: { kritik_sayisi: kritik, riskli_sayisi: riskli, guvenli_sayisi: guvenli, toplam_zam_gereksinimi: zamToplam.toFixed(2), ortalama_kar_marji: ortKar.toFixed(2) },
                    parametreler: { dolar_oran: dolar, pamuk_oran: pamuk }
                });
            }
        } catch (error) {
            console.error('Yaz sezonu simülasyon hatası:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = AnalizController;
