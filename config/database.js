const mysql = require('mysql2/promise');
require('dotenv').config();

let dbConnected = false;

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kds_proje',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
} catch (e) {
    console.log('⚠️  Pool oluşturulamadı, mock veri kullanılacak');
}

if (pool) {
    pool.getConnection()
        .then(connection => {
            console.log('✅ Veritabanı bağlantısı başarılı!');
            dbConnected = true;
            connection.release();
        })
        .catch(error => {
            console.error('❌ Veritabanı bağlantı hatası:', error.message);
            console.log('⚠️  Mock veri modu aktif - Örnek verilerle çalışılıyor...');
            dbConnected = false;
        });
}

module.exports = {
    pool,
    dbConnected,
    getConnection: () => pool ? pool.getConnection() : null,
    execute: async (query, params) => {
        if (pool && dbConnected) {
            return await pool.execute(query, params);
        }
        throw new Error('Veritabanı bağlantısı yok');
    }
};
