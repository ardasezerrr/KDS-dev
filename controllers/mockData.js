const mockKategoriler = [
    { kategori_id: 1, kategori_adi: 'Elbise', hedef_kar_orani: 55.00 },
    { kategori_id: 2, kategori_adi: 'Tişört', hedef_kar_orani: 55.00 },
    { kategori_id: 3, kategori_adi: 'Pantolon', hedef_kar_orani: 55.00 },
    { kategori_id: 4, kategori_adi: 'Aksesuar', hedef_kar_orani: 60.00 },
    { kategori_id: 5, kategori_adi: 'Ayakkabı', hedef_kar_orani: 50.00 }
];

const mockUrunler = [
    { urun_id: 1, kategori_id: 1, urun_adi: 'Yazlık Elbise', birim_maliyet: 180, satis_fiyati: 450, stok_miktari: 50, kategori_adi: 'Elbise', hedef_kar_orani: 55.00 },
    { urun_id: 2, kategori_id: 1, urun_adi: 'Çiçekli Elbise', birim_maliyet: 200, satis_fiyati: 520, stok_miktari: 35, kategori_adi: 'Elbise', hedef_kar_orani: 55.00 },
    { urun_id: 3, kategori_id: 2, urun_adi: 'Basic Tişört', birim_maliyet: 45, satis_fiyati: 120, stok_miktari: 150, kategori_adi: 'Tişört', hedef_kar_orani: 55.00 },
    { urun_id: 4, kategori_id: 2, urun_adi: 'Baskılı Tişört', birim_maliyet: 55, satis_fiyati: 150, stok_miktari: 100, kategori_adi: 'Tişört', hedef_kar_orani: 55.00 },
    { urun_id: 5, kategori_id: 3, urun_adi: 'Keten Pantolon', birim_maliyet: 150, satis_fiyati: 380, stok_miktari: 45, kategori_adi: 'Pantolon', hedef_kar_orani: 55.00 },
    { urun_id: 6, kategori_id: 3, urun_adi: 'Jean Pantolon', birim_maliyet: 180, satis_fiyati: 420, stok_miktari: 60, kategori_adi: 'Pantolon', hedef_kar_orani: 55.00 },
    { urun_id: 7, kategori_id: 4, urun_adi: 'Hasır Çanta', birim_maliyet: 80, satis_fiyati: 250, stok_miktari: 30, kategori_adi: 'Aksesuar', hedef_kar_orani: 60.00 },
    { urun_id: 8, kategori_id: 4, urun_adi: 'Güneş Gözlüğü', birim_maliyet: 60, satis_fiyati: 180, stok_miktari: 80, kategori_adi: 'Aksesuar', hedef_kar_orani: 60.00 },
    { urun_id: 9, kategori_id: 5, urun_adi: 'Sandalet', birim_maliyet: 120, satis_fiyati: 280, stok_miktari: 40, kategori_adi: 'Ayakkabı', hedef_kar_orani: 50.00 },
    { urun_id: 10, kategori_id: 5, urun_adi: 'Spor Ayakkabı', birim_maliyet: 250, satis_fiyati: 550, stok_miktari: 25, kategori_adi: 'Ayakkabı', hedef_kar_orani: 50.00 }
];

const mockRakipFiyatlari = [
    { rakip_id: 1, urun_id: 1, rakip_adi: 'Rakip A', rakip_fiyat: 420, tarih: '2025-01-15', urun_adi: 'Yazlık Elbise' },
    { rakip_id: 2, urun_id: 1, rakip_adi: 'Rakip B', rakip_fiyat: 480, tarih: '2025-01-15', urun_adi: 'Yazlık Elbise' },
    { rakip_id: 3, urun_id: 2, rakip_adi: 'Rakip A', rakip_fiyat: 500, tarih: '2025-01-15', urun_adi: 'Çiçekli Elbise' },
    { rakip_id: 4, urun_id: 3, rakip_adi: 'Rakip B', rakip_fiyat: 110, tarih: '2025-01-15', urun_adi: 'Basic Tişört' },
    { rakip_id: 5, urun_id: 4, rakip_adi: 'Rakip A', rakip_fiyat: 140, tarih: '2025-01-15', urun_adi: 'Baskılı Tişört' },
    { rakip_id: 6, urun_id: 5, rakip_adi: 'Rakip C', rakip_fiyat: 350, tarih: '2025-01-15', urun_adi: 'Keten Pantolon' },
    { rakip_id: 7, urun_id: 6, rakip_adi: 'Rakip A', rakip_fiyat: 400, tarih: '2025-01-15', urun_adi: 'Jean Pantolon' },
    { rakip_id: 8, urun_id: 7, rakip_adi: 'Rakip B', rakip_fiyat: 230, tarih: '2025-01-15', urun_adi: 'Hasır Çanta' },
    { rakip_id: 9, urun_id: 9, rakip_adi: 'Rakip A', rakip_fiyat: 260, tarih: '2025-01-15', urun_adi: 'Sandalet' },
    { rakip_id: 10, urun_id: 10, rakip_adi: 'Rakip C', rakip_fiyat: 520, tarih: '2025-01-15', urun_adi: 'Spor Ayakkabı' }
];

const mockDisCevreVerileri = [
    { veri_id: 1, parametre_adi: 'Dolar Kuru', deger: 34.50, kayit_tarihi: '2025-01-01' },
    { veri_id: 2, parametre_adi: 'Pamuk Endeksi', deger: 152, kayit_tarihi: '2025-01-01' },
    { veri_id: 3, parametre_adi: 'Lojistik Endeksi', deger: 125, kayit_tarihi: '2025-01-01' },
    { veri_id: 4, parametre_adi: 'Enflasyon', deger: 44, kayit_tarihi: '2025-01-01' }
];

const mockUrunDisEtki = [
    { etki_id: 1, urun_id: 1, parametre_id: 1, etki_katsayisi: 0.35, urun_adi: 'Yazlık Elbise', parametre_adi: 'Dolar Kuru' },
    { etki_id: 2, urun_id: 1, parametre_id: 2, etki_katsayisi: 0.45, urun_adi: 'Yazlık Elbise', parametre_adi: 'Pamuk Endeksi' },
    { etki_id: 3, urun_id: 2, parametre_id: 1, etki_katsayisi: 0.30, urun_adi: 'Çiçekli Elbise', parametre_adi: 'Dolar Kuru' },
    { etki_id: 4, urun_id: 2, parametre_id: 2, etki_katsayisi: 0.50, urun_adi: 'Çiçekli Elbise', parametre_adi: 'Pamuk Endeksi' },
    { etki_id: 5, urun_id: 3, parametre_id: 2, etki_katsayisi: 0.60, urun_adi: 'Basic Tişört', parametre_adi: 'Pamuk Endeksi' },
    { etki_id: 6, urun_id: 4, parametre_id: 2, etki_katsayisi: 0.55, urun_adi: 'Baskılı Tişört', parametre_adi: 'Pamuk Endeksi' },
    { etki_id: 7, urun_id: 5, parametre_id: 2, etki_katsayisi: 0.40, urun_adi: 'Keten Pantolon', parametre_adi: 'Pamuk Endeksi' },
    { etki_id: 8, urun_id: 6, parametre_id: 1, etki_katsayisi: 0.25, urun_adi: 'Jean Pantolon', parametre_adi: 'Dolar Kuru' },
    { etki_id: 9, urun_id: 9, parametre_id: 1, etki_katsayisi: 0.40, urun_adi: 'Sandalet', parametre_adi: 'Dolar Kuru' },
    { etki_id: 10, urun_id: 10, parametre_id: 1, etki_katsayisi: 0.50, urun_adi: 'Spor Ayakkabı', parametre_adi: 'Dolar Kuru' }
];

const mockMaliyetGecmisi = [
    { gecmis_id: 1, urun_id: 1, maliyet: 95, satis_fiyati: 250, kayit_tarihi: '2022-06-01', urun_adi: 'Yazlık Elbise', kar_marji: 62.0, yil: 2022 },
    { gecmis_id: 2, urun_id: 2, maliyet: 105, satis_fiyati: 290, kayit_tarihi: '2022-06-01', urun_adi: 'Çiçekli Elbise', kar_marji: 63.8, yil: 2022 },
    { gecmis_id: 3, urun_id: 3, maliyet: 25, satis_fiyati: 70, kayit_tarihi: '2022-06-01', urun_adi: 'Basic Tişört', kar_marji: 64.3, yil: 2022 },
    { gecmis_id: 4, urun_id: 4, maliyet: 30, satis_fiyati: 85, kayit_tarihi: '2022-06-01', urun_adi: 'Baskılı Tişört', kar_marji: 64.7, yil: 2022 },
    { gecmis_id: 5, urun_id: 5, maliyet: 80, satis_fiyati: 210, kayit_tarihi: '2022-06-01', urun_adi: 'Keten Pantolon', kar_marji: 61.9, yil: 2022 },
    { gecmis_id: 6, urun_id: 1, maliyet: 125, satis_fiyati: 320, kayit_tarihi: '2023-06-01', urun_adi: 'Yazlık Elbise', kar_marji: 60.9, yil: 2023 },
    { gecmis_id: 7, urun_id: 2, maliyet: 140, satis_fiyati: 380, kayit_tarihi: '2023-06-01', urun_adi: 'Çiçekli Elbise', kar_marji: 63.2, yil: 2023 },
    { gecmis_id: 8, urun_id: 3, maliyet: 32, satis_fiyati: 85, kayit_tarihi: '2023-06-01', urun_adi: 'Basic Tişört', kar_marji: 62.4, yil: 2023 },
    { gecmis_id: 9, urun_id: 4, maliyet: 40, satis_fiyati: 110, kayit_tarihi: '2023-06-01', urun_adi: 'Baskılı Tişört', kar_marji: 63.6, yil: 2023 },
    { gecmis_id: 10, urun_id: 5, maliyet: 105, satis_fiyati: 280, kayit_tarihi: '2023-06-01', urun_adi: 'Keten Pantolon', kar_marji: 62.5, yil: 2023 },
    { gecmis_id: 11, urun_id: 1, maliyet: 155, satis_fiyati: 390, kayit_tarihi: '2024-06-01', urun_adi: 'Yazlık Elbise', kar_marji: 60.3, yil: 2024 },
    { gecmis_id: 12, urun_id: 2, maliyet: 175, satis_fiyati: 460, kayit_tarihi: '2024-06-01', urun_adi: 'Çiçekli Elbise', kar_marji: 62.0, yil: 2024 },
    { gecmis_id: 13, urun_id: 3, maliyet: 38, satis_fiyati: 100, kayit_tarihi: '2024-06-01', urun_adi: 'Basic Tişört', kar_marji: 62.0, yil: 2024 },
    { gecmis_id: 14, urun_id: 4, maliyet: 48, satis_fiyati: 130, kayit_tarihi: '2024-06-01', urun_adi: 'Baskılı Tişört', kar_marji: 63.1, yil: 2024 },
    { gecmis_id: 15, urun_id: 5, maliyet: 130, satis_fiyati: 340, kayit_tarihi: '2024-06-01', urun_adi: 'Keten Pantolon', kar_marji: 61.8, yil: 2024 },
    { gecmis_id: 16, urun_id: 1, maliyet: 180, satis_fiyati: 450, kayit_tarihi: '2025-01-01', urun_adi: 'Yazlık Elbise', kar_marji: 60.0, yil: 2025 },
    { gecmis_id: 17, urun_id: 2, maliyet: 200, satis_fiyati: 520, kayit_tarihi: '2025-01-01', urun_adi: 'Çiçekli Elbise', kar_marji: 61.5, yil: 2025 },
    { gecmis_id: 18, urun_id: 3, maliyet: 45, satis_fiyati: 120, kayit_tarihi: '2025-01-01', urun_adi: 'Basic Tişört', kar_marji: 62.5, yil: 2025 },
    { gecmis_id: 19, urun_id: 4, maliyet: 55, satis_fiyati: 150, kayit_tarihi: '2025-01-01', urun_adi: 'Baskılı Tişört', kar_marji: 63.3, yil: 2025 },
    { gecmis_id: 20, urun_id: 5, maliyet: 150, satis_fiyati: 380, kayit_tarihi: '2025-01-01', urun_adi: 'Keten Pantolon', kar_marji: 60.5, yil: 2025 }
];

const mockSenaryoAnalizleri = [
    { senaryo_id: 1, urun_id: 1, senaryo_adi: 'Dolar 40 TL Olursa', beklenen_maliyet_artisi: 15.00, tahmini_kar_etkisi: -8500.00, urun_adi: 'Yazlık Elbise' },
    { senaryo_id: 2, urun_id: 3, senaryo_adi: 'Pamuk %20 Artarsa', beklenen_maliyet_artisi: 12.00, tahmini_kar_etkisi: -5200.00, urun_adi: 'Basic Tişört' },
    { senaryo_id: 3, urun_id: 10, senaryo_adi: 'Dolar 45 TL Olursa', beklenen_maliyet_artisi: 25.00, tahmini_kar_etkisi: -12000.00, urun_adi: 'Spor Ayakkabı' }
];

const mockBaseValues = {
    dolar: 34.50,
    pamuk: 152,
    lojistik: 125,
    enflasyon: 44
};

const mockHistoricalData = {
    dolar: [
        { yil: 2022, deger: 18.50 },
        { yil: 2023, deger: 26.90 },
        { yil: 2024, deger: 32.20 },
        { yil: 2025, deger: 34.50 }
    ],
    pamuk: [
        { yil: 2022, deger: 120 },
        { yil: 2023, deger: 135 },
        { yil: 2024, deger: 145 },
        { yil: 2025, deger: 152 }
    ],
    lojistik: [
        { yil: 2022, deger: 100 },
        { yil: 2023, deger: 108 },
        { yil: 2024, deger: 118 },
        { yil: 2025, deger: 125 }
    ],
    enflasyon: [
        { yil: 2022, deger: 64 },
        { yil: 2023, deger: 58 },
        { yil: 2024, deger: 52 },
        { yil: 2025, deger: 44 }
    ]
};

module.exports = {
    mockKategoriler,
    mockUrunler,
    mockRakipFiyatlari,
    mockDisCevreVerileri,
    mockUrunDisEtki,
    mockMaliyetGecmisi,
    mockSenaryoAnalizleri,
    mockBaseValues,
    mockHistoricalData
};
