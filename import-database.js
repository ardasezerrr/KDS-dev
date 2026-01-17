const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

async function importDatabase(sqlFileName = null) {
    let connection;
    
    try {
        console.log('🔌 Veritabanına bağlanılıyor...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Bağlantı başarılı!');

        console.log('📦 Veritabanı oluşturuluyor...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'kds_proje'}\``);
        console.log('✅ Veritabanı hazır!');

        await connection.query(`USE \`${process.env.DB_NAME || 'kds_proje'}\``);

        let sqlFile;
        if (sqlFileName && fs.existsSync(path.join(__dirname, sqlFileName))) {
            console.log(`📄 SQL dosyası okunuyor: ${sqlFileName}...`);
            sqlFile = fs.readFileSync(path.join(__dirname, sqlFileName), 'utf8');
        } else {
            const possibleFiles = ['kds_proje.sql', 'kds_proje_yeni.sql', 'database.sql', 'veritabani.sql'];
            let foundFile = null;
            
            for (const file of possibleFiles) {
                if (fs.existsSync(path.join(__dirname, file))) {
                    foundFile = file;
                    break;
                }
            }
            
            if (!foundFile) {
                throw new Error('SQL dosyası bulunamadı! Lütfen SQL dosyasını proje klasörüne ekleyin.');
            }
            
            console.log(`📄 SQL dosyası okunuyor: ${foundFile}...`);
            sqlFile = fs.readFileSync(path.join(__dirname, foundFile), 'utf8');
        }

        console.log('⚙️  Stored procedure\'lar oluşturuluyor...');
        
        await connection.query(`
            DROP PROCEDURE IF EXISTS KarMarjiRiskAnalizi;
        `);
        await connection.query(`
            CREATE PROCEDURE KarMarjiRiskAnalizi(IN alt_limit_yuzde DECIMAL(5,2))
            BEGIN
                SELECT 
                    urun_adi, 
                    birim_maliyet, 
                    satis_fiyati,
                    ROUND(((satis_fiyati - birim_maliyet) / satis_fiyati) * 100, 2) AS kar_marji_yuzde
                FROM urunler
                WHERE (((satis_fiyati - birim_maliyet) / satis_fiyati) * 100) < alt_limit_yuzde;
            END
        `);
        
        await connection.query(`
            DROP PROCEDURE IF EXISTS KarOdakliFiyatOnerisi;
        `);
        await connection.query(`
            CREATE PROCEDURE KarOdakliFiyatOnerisi(IN hedef_marj_yuzde DECIMAL(5,2))
            BEGIN
                SELECT 
                    urun_adi, 
                    birim_maliyet AS mevcut_maliyet, 
                    satis_fiyati AS su_anki_fiyat,
                    ROUND(birim_maliyet / (1 - (hedef_marj_yuzde / 100)), 2) AS onerilen_satis_fiyati,
                    ROUND((birim_maliyet / (1 - (hedef_marj_yuzde / 100))) - satis_fiyati, 2) AS yapilmasi_gereken_zam
                FROM urunler;
            END
        `);
        
        await connection.query(`
            DROP PROCEDURE IF EXISTS SezonlukStokButceAnalizi;
        `);
        await connection.query(`
            CREATE PROCEDURE SezonlukStokButceAnalizi()
            BEGIN
                SELECT 
                    k.kategori_adi,
                    SUM(u.stok_miktari) AS toplam_stok_adedi,
                    SUM(u.stok_miktari * u.birim_maliyet) AS toplam_stok_maliyeti,
                    SUM(u.stok_miktari * (u.satis_fiyati - u.birim_maliyet)) AS beklenen_toplam_kar
                FROM kategoriler k
                JOIN urunler u ON k.kategori_id = u.kategori_id
                GROUP BY k.kategori_adi;
            END
        `);
        
        console.log('✅ Stored procedure\'lar oluşturuldu!');
        
        console.log('⚙️  Tablolar oluşturuluyor...');
        
        sqlFile = sqlFile.replace(/DELIMITER \$\$[\s\S]*?DELIMITER ;/g, '');
        sqlFile = sqlFile.replace(/\$\$/g, ';');
        
        const statements = sqlFile
            .split(';')
            .map(s => s.trim())
            .filter(s => {
                const trimmed = s.trim();
                return trimmed.length > 0 && 
                       !trimmed.startsWith('--') && 
                       !trimmed.startsWith('/*') &&
                       !trimmed.toUpperCase().includes('DELIMITER') &&
                       !trimmed.toUpperCase().includes('CREATE PROCEDURE') &&
                       !trimmed.toUpperCase().includes('DROP PROCEDURE');
            });
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim().length > 0) {
                try {
                    await connection.query(statement);
                    successCount++;
                } catch (err) {
                    if (!err.message.includes('already exists') && 
                        !err.message.includes('Unknown database') &&
                        !err.message.includes('Duplicate') &&
                        !err.message.includes('doesn\'t exist')) {
                        errorCount++;
                        if (errorCount <= 5) {
                            console.warn(`⚠️  Uyarı (satır ${i+1}): ${err.message.substring(0, 150)}`);
                        }
                    }
                }
            }
        }
        
        console.log(`✅ ${successCount} komut başarıyla çalıştırıldı`);
        if (errorCount > 0) {
            console.log(`⚠️  ${errorCount} uyarı oluştu (çoğu normal)`);
        }
        
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n📋 Oluşturulan tablolar:');
        tables.forEach(table => {
            console.log(`   ✓ ${Object.values(table)[0]}`);
        });

        const [procedures] = await connection.query('SHOW PROCEDURE STATUS WHERE Db = ?', [process.env.DB_NAME || 'kds_proje']);
        if (procedures.length > 0) {
            console.log('\n📋 Oluşturulan stored procedure\'lar:');
            procedures.forEach(proc => {
                console.log(`   ✓ ${proc.Name}`);
            });
        }

        await connection.end();
        return true;
    } catch (error) {
        console.error('\n❌ Hata:', error.message);
        if (connection) {
            await connection.end();
        }
        return false;
    }
}

const sqlFileName = process.argv[2] || null;

importDatabase(sqlFileName)
    .then(success => {
        if (success) {
            console.log('\n🎉 Veritabanı başarıyla import edildi!');
            console.log('💡 Kullanım: node import-database.js [dosya_adi.sql]\n');
            process.exit(0);
        } else {
            console.log('\n⚠️  Import başarısız. Lütfen:');
            console.log('   1. MySQL servisinin çalıştığından emin olun');
            console.log('   2. .env dosyasındaki veritabanı bilgilerini kontrol edin');
            console.log('   3. SQL dosyasının proje klasöründe olduğundan emin olun\n');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('Kritik hata:', error);
        process.exit(1);
    });
