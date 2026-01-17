const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const router = require('./routes/router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bir hata oluştu!');
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 KDS Server başarıyla başlatıldı!`);
    console.log(`========================================`);
    console.log(`📍 Ana Sayfa: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`📦 Ürünler: http://localhost:${PORT}/urunler.html`);
    console.log(`📊 Analizler: http://localhost:${PORT}/analiz-*.html`);
    console.log(`========================================\n`);
});
