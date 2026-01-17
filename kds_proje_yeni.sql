-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 21 Ara 2025, 14:49:45
-- Sunucu sürümü: 9.1.0
-- PHP Sürümü: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `kds_proje`
--

DELIMITER $$
--
-- Yordamlar
--
DROP PROCEDURE IF EXISTS `KarMarjiRiskAnalizi`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `KarMarjiRiskAnalizi` (IN `alt_limit_yuzde` DECIMAL(5,2))   BEGIN
                SELECT 
                    urun_adi, 
                    birim_maliyet, 
                    satis_fiyati,
                    ROUND(((satis_fiyati - birim_maliyet) / satis_fiyati) * 100, 2) AS kar_marji_yuzde
                FROM urunler
                WHERE (((satis_fiyati - birim_maliyet) / satis_fiyati) * 100) < alt_limit_yuzde;
            END$$

DROP PROCEDURE IF EXISTS `KarOdakliFiyatOnerisi`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `KarOdakliFiyatOnerisi` (IN `hedef_marj_yuzde` DECIMAL(5,2))   BEGIN
                SELECT 
                    urun_adi, 
                    birim_maliyet AS mevcut_maliyet, 
                    satis_fiyati AS su_anki_fiyat,
                    ROUND(birim_maliyet / (1 - (hedef_marj_yuzde / 100)), 2) AS onerilen_satis_fiyati,
                    ROUND((birim_maliyet / (1 - (hedef_marj_yuzde / 100))) - satis_fiyati, 2) AS yapilmasi_gereken_zam
                FROM urunler;
            END$$

DROP PROCEDURE IF EXISTS `SezonlukStokButceAnalizi`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SezonlukStokButceAnalizi` ()   BEGIN
                SELECT 
                    k.kategori_adi,
                    SUM(u.stok_miktari) AS toplam_stok_adedi,
                    SUM(u.stok_miktari * u.birim_maliyet) AS toplam_stok_maliyeti,
                    SUM(u.stok_miktari * (u.satis_fiyati - u.birim_maliyet)) AS beklenen_toplam_kar
                FROM kategoriler k
                JOIN urunler u ON k.kategori_id = u.kategori_id
                GROUP BY k.kategori_adi;
            END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `discevreverileri`
--

DROP TABLE IF EXISTS `discevreverileri`;
CREATE TABLE IF NOT EXISTS `discevreverileri` (
  `veri_id` int NOT NULL AUTO_INCREMENT,
  `parametre_adi` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `deger` decimal(10,2) DEFAULT NULL,
  `kayit_tarihi` date DEFAULT NULL,
  PRIMARY KEY (`veri_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `discevreverileri`
--

INSERT INTO `discevreverileri` (`veri_id`, `parametre_adi`, `deger`, `kayit_tarihi`) VALUES
(1, 'Dolar Kuru', 40.00, '2025-12-22'),
(2, 'Pamuk Endeksi', 145.20, '2025-12-21'),
(3, 'Lojistik Endeksi', 115.00, '2025-12-21');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategoriler`
--

DROP TABLE IF EXISTS `kategoriler`;
CREATE TABLE IF NOT EXISTS `kategoriler` (
  `kategori_id` int NOT NULL AUTO_INCREMENT,
  `kategori_adi` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `hedef_kar_orani` decimal(5,2) DEFAULT '55.00',
  PRIMARY KEY (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `kategoriler`
--

INSERT INTO `kategoriler` (`kategori_id`, `kategori_adi`, `hedef_kar_orani`) VALUES
(1, 'Gömlek & Bluz', 55.00),
(2, 'Jean & Pantolon', 48.00),
(3, 'Ceket & Trençkot', 65.00),
(4, 'Aksesuar - Deri', 70.00),
(5, 'Spor Giyim', 52.00),
(6, 'Plaj Giyimi', 72.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `maliyetgecmisi`
--

DROP TABLE IF EXISTS `maliyetgecmisi`;
CREATE TABLE IF NOT EXISTS `maliyetgecmisi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int DEFAULT NULL,
  `eski_maliyet` decimal(10,2) DEFAULT NULL,
  `yeni_maliyet` decimal(10,2) DEFAULT NULL,
  `degisim_tarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `urun_id` (`urun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `rakipfiyatlari`
--

DROP TABLE IF EXISTS `rakipfiyatlari`;
CREATE TABLE IF NOT EXISTS `rakipfiyatlari` (
  `rakip_id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int DEFAULT NULL,
  `rakip_adi` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `rakip_fiyat` decimal(10,2) DEFAULT NULL,
  `tarih` date DEFAULT NULL,
  PRIMARY KEY (`rakip_id`),
  KEY `urun_id` (`urun_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `rakipfiyatlari`
--

INSERT INTO `rakipfiyatlari` (`rakip_id`, `urun_id`, `rakip_adi`, `rakip_fiyat`, `tarih`) VALUES
(7, 1, 'Ege Moda', 1180.00, '2025-12-21'),
(8, 1, 'Alsancak Butik', 1350.00, '2025-12-21'),
(9, 2, 'Global Jean', 990.00, '2025-12-21');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `senaryoanalizleri`
--

DROP TABLE IF EXISTS `senaryoanalizleri`;
CREATE TABLE IF NOT EXISTS `senaryoanalizleri` (
  `senaryo_id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int DEFAULT NULL,
  `senaryo_adi` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `beklenen_maliyet_artisi` decimal(5,2) DEFAULT NULL,
  `tahmini_kar_etkisi` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`senaryo_id`),
  KEY `urun_id` (`urun_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `senaryoanalizleri`
--

INSERT INTO `senaryoanalizleri` (`senaryo_id`, `urun_id`, `senaryo_adi`, `beklenen_maliyet_artisi`, `tahmini_kar_etkisi`) VALUES
(5, 1, 'Dolar 40 TL Olursa', 15.00, -110.00),
(6, 3, 'Global Kumaş Krizi', 25.00, -210.00),
(7, 1, 'Sim: 51.75-134.2-116.9', 32.73, -13.39),
(8, 2, 'Sim: 51.75-134.2-116.9', 0.00, 0.00),
(9, 3, 'Sim: 51.75-134.2-116.9', 20.00, -7.08),
(10, 4, 'Sim: 51.75-134.2-116.9', 1.40, -0.46),
(11, 5, 'Sim: 51.75-134.2-116.9', 0.00, 0.00),
(12, 1, 'Sim: 38.95-174.4-115.00', 15.06, -6.16),
(13, 2, 'Sim: 38.95-174.4-115.00', 0.00, 0.00),
(14, 3, 'Sim: 38.95-174.4-115.00', 5.16, -1.82),
(15, 4, 'Sim: 38.95-174.4-115.00', 0.00, 0.00),
(16, 5, 'Sim: 38.95-174.4-115.00', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urundisetki`
--

DROP TABLE IF EXISTS `urundisetki`;
CREATE TABLE IF NOT EXISTS `urundisetki` (
  `etki_id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int DEFAULT NULL,
  `parametre_id` int DEFAULT NULL,
  `etki_katsayisi` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`etki_id`),
  KEY `urun_id` (`urun_id`),
  KEY `parametre_id` (`parametre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `urundisetki`
--

INSERT INTO `urundisetki` (`etki_id`, `urun_id`, `parametre_id`, `etki_katsayisi`) VALUES
(11, 1, 1, 0.70),
(12, 1, 2, 0.30),
(13, 3, 1, 0.40),
(14, 4, 3, 0.85);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler`
--

DROP TABLE IF EXISTS `urunler`;
CREATE TABLE IF NOT EXISTS `urunler` (
  `urun_id` int NOT NULL AUTO_INCREMENT,
  `kategori_id` int DEFAULT NULL,
  `urun_adi` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `birim_maliyet` decimal(10,2) DEFAULT NULL,
  `satis_fiyati` decimal(10,2) DEFAULT NULL,
  `stok_miktari` int DEFAULT '0',
  PRIMARY KEY (`urun_id`),
  KEY `kategori_id` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `urunler`
--

INSERT INTO `urunler` (`urun_id`, `kategori_id`, `urun_adi`, `birim_maliyet`, `satis_fiyati`, `stok_miktari`) VALUES
(1, 1, 'Keten Beyaz Gömlek', 450.00, 1100.00, 120),
(2, 2, 'Slim Fit Jean', 380.00, 950.00, 150),
(3, 3, 'Mevsimlik Blazer', 850.00, 2400.00, 45),
(4, 4, 'Hakiki Deri Çanta', 920.00, 2800.00, 30),
(5, 5, 'Yoga Taytı', 240.00, 780.00, 85);

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `maliyetgecmisi`
--
ALTER TABLE `maliyetgecmisi`
  ADD CONSTRAINT `maliyetgecmisi_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `rakipfiyatlari`
--
ALTER TABLE `rakipfiyatlari`
  ADD CONSTRAINT `rakipfiyatlari_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `senaryoanalizleri`
--
ALTER TABLE `senaryoanalizleri`
  ADD CONSTRAINT `senaryoanalizleri_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urundisetki`
--
ALTER TABLE `urundisetki`
  ADD CONSTRAINT `urundisetki_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `urundisetki_ibfk_2` FOREIGN KEY (`parametre_id`) REFERENCES `discevreverileri` (`veri_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urunler`
--
ALTER TABLE `urunler`
  ADD CONSTRAINT `urunler_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`kategori_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
