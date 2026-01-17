# MVC Mimari Dokümantasyonu

## Proje Yapısı

Bu proje MVC (Model-View-Controller) mimarisine göre tasarlanmıştır.


```
kds/
├── config/                    # Configuration Layer
│   └── database.js           # Veritabanı bağlantı yapılandırması
│
├── models/                    # MODEL LAYER (Veri Erişim Katmanı)
│   ├── UrunModel.js          # Ürünler tablosu modeli
│   ├── KategoriModel.js      # Kategoriler tablosu modeli
│   ├── DisCevreVeriModel.js  # Dış çevre verileri modeli
│   ├── RakipFiyatModel.js    # Rakip fiyatları modeli
│   ├── SenaryoAnalizModel.js # Senaryo analizleri modeli
│   ├── UrunDisEtkiModel.js   # Ürün dış etki modeli
│   ├── MaliyetGecmisiModel.js# Maliyet geçmişi modeli
│   └── index.js              # Model index
│
├── controllers/               # CONTROLLER LAYER (İş Mantığı Katmanı)
│   ├── UrunController.js     # Ürün işlemleri controller
│   ├── KategoriController.js   # Kategori işlemleri controller
│   ├── AnalizController.js   # Analiz işlemleri controller
│   └── mockData.js           # Mock veri (test için)
│
├── services/                  # SERVICE LAYER (İş Mantığı Servisleri)
│   └── AnalizService.js      # Stored procedure çağrıları
│
├── routes/                    # ROUTING LAYER
│   └── router.js             # Tüm route tanımları
│
├── public/                    # VIEW LAYER (Görünüm Katmanı)
│   ├── index.html
│   ├── urunler.html
│   └── analiz-*.html
│
└── app.js                     # Ana uygulama dosyası
```

## MVC Katmanları

### MODEL LAYER (`models/`)
**Sorumluluk:** Veritabanı işlemleri, veri erişimi
- Her tablo için bir model sınıfı
- Sadece veritabanı CRUD işlemleri
- İş mantığı içermez
- Veritabanı bağımlılıklarını içerir

**Örnek Kullanım:**
```javascript
const UrunModel = require('./models/UrunModel');
const urunler = await UrunModel.getAll();
```

### CONTROLLER LAYER (`controllers/`)
**Sorumluluk:** İş mantığı, HTTP istek/cevap işleme
- Model'leri kullanır
- İş kurallarını uygular
- HTTP request/response işler
- View ile direkt bağlantı yok (JSON döner)

**Örnek Kullanım:**
```javascript
class UrunController {
    static async getUrunler(req, res) {
        const data = await UrunModel.getAll();
        res.json({ success: true, data });
    }
}
```

### VIEW LAYER (`public/`)
**Sorumluluk:** Kullanıcı arayüzü
- HTML, CSS, JavaScript dosyaları
- Sadece görünüm sorumluluğu
- API çağrıları yaparak Controller'lara bağlanır

### ROUTING LAYER (`routes/`)
**Sorumluluk:** URL'leri Controller'lara yönlendirme
- Express route tanımları
- Controller metodlarını çağırır
- İş mantığı içermez

### CONFIG LAYER (`config/`)
**Sorumluluk:** Yapılandırma bilgileri
- Veritabanı bağlantı ayarları
- Ortam değişkenleri
- Genel ayarlar

### SERVICE LAYER (`services/`)
**Sorumluluk:** Karmaşık iş mantığı, stored procedure çağrıları
- Controller'lar tarafından kullanılır
- Özel hesaplamalar, analizler
- Reusable iş mantığı

## MVC Prensipleri

### Ayrım (Separation of Concerns)
- Her katman sadece kendi sorumluluğuna odaklanır
- Model: Veri
- Controller: İş mantığı
- View: Görünüm

### Bağımlılık Yönü
```
View → Controller → Model
```
- Controller, Model'i kullanır
- View, Controller'ı çağırır (API üzerinden)
- Model, başka katmanı kullanmaz

### Tek Sorumluluk Prensibi
- Her sınıf/dosya tek bir sorumluluğa sahip
- UrunModel: Sadece ürün veritabanı işlemleri
- UrunController: Sadece ürün iş mantığı

## Kullanım Örnekleri

### Model Kullanımı
```javascript
// models/UrunModel.js
class UrunModel {
    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM urunler');
        return rows;
    }
}
```

### Controller Kullanımı
```javascript
// controllers/UrunController.js
const UrunModel = require('../models/UrunModel');

class UrunController {
    static async getUrunler(req, res) {
        try {
            const data = await UrunModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
```

### Route Kullanımı
```javascript
// routes/router.js
const UrunController = require('../controllers/UrunController');

router.get('/urunler', UrunController.getUrunler);
```

## Avantajlar

1. **Bakım Kolaylığı:** Her katman bağımsız geliştirilebilir
2. **Test Edilebilirlik:** Katmanlar ayrı test edilebilir
3. **Yeniden Kullanılabilirlik:** Model'ler farklı Controller'larda kullanılabilir
4. **Ölçeklenebilirlik:** Yeni özellikler kolayca eklenebilir
5. **Okunabilirlik:** Kod yapısı net ve anlaşılır
