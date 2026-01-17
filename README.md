# Yaz 2026 Strateji Merkezi

**İzmir E-Ticaret Karar Destek Sistemi (KDS)**

Yaz mevsimi için kar marjınızı artırmak ve stratejik kararlar almak için tasarlanmış web tabanlı karar destek sistemi.

---

## Ne İşe Yarar?

Bu sistem size şu soruların cevabını verir:

- **"Hangi ürünlerimin kar marjı düşük?"**
- **"Ne kadar zam yapmalıyım?"**
- **"Dolar yükselirse ne olur?"**
- **"Rakiplerime göre pahalı mıyım?"**

---

## Hızlı Başlangıç

### 1. Gereksinimler
- Node.js (v14+)
- MySQL

### 2. Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Veritabanını oluştur
npm run import-db

# Sunucuyu başlat
npm start
```

### 3. Aç ve Kullan
Tarayıcıda açın: **http://localhost:3000**

---

## Özellikler

### 1. Genel Bakış Sayfası
- **Ne Yapmalısınız?** - Anında aksiyon önerileri
- **Hedef Kar Marjı Ayarı** - Slider ile hedefinizi belirleyin
- **Özet Kartları** - Mevcut durum bir bakışta
- **Grafikler** - Ürün kar marjları ve durum dağılımı
- **Riskli Ürünler Tablosu** - Acil aksiyon gereken ürünler

### 2. "Ne Olur?" Simülasyonu
- **Dolar kuru** değişirse maliyetler ne olur?
- **Pamuk fiyatı** artarsa kar marjı nasıl etkilenir?
- **Lojistik maliyetleri** yükselirse hangi ürünler risk altında?

### 3. Ürün Yönetimi
- Ürün ekleme/düzenleme
- Maliyet ve fiyat takibi
- Stok yönetimi

### 4. Rakip Analizi
- Rakip fiyatlarını kaydedin
- Fiyat karşılaştırması yapın
- Rekabet durumunuzu görün

---

## Hedef Kar Marjı Nasıl Çalışır?

1. **Slider'ı hareket ettirin** (örn: %50)
2. Sistem otomatik hesaplar:
   - Hangi ürünler hedefin altında?
   - Her ürüne ne kadar zam gerekli?
   - Toplam kaç ürün risk altında?

---

## Proje Yapısı

```
kds/
├── app.js              # Ana sunucu dosyası
├── controllers/
│   └── controller.js   # API işlemleri
├── routes/
│   └── router.js       # API endpoint'leri
├── public/
│   └── index.html      # Dashboard arayüzü
├── kds_proje.sql       # Veritabanı şeması
└── package.json        # Proje bağımlılıkları
```

---

## API Endpoint'leri

| Endpoint | Açıklama |
|----------|----------|
| GET /api/urunler | Tüm ürünleri getir |
| GET /api/kategoriler | Kategorileri getir |
| GET /api/rakipfiyatlari | Rakip fiyatlarını getir |
| GET /api/urundisetki | Ürün dış etki katsayıları |
| GET /api/discevreverileri | Dış çevre verileri (dolar, pamuk vb.) |
| POST /api/urunler | Yeni ürün ekle |
| PUT /api/urunler/:id | Ürün güncelle |
| POST /api/rakipfiyatlari | Rakip fiyatı ekle |

---

**© 2024 İzmir E-Ticaret | Karar Destek Sistemi**
