# 🏆 Sertifika Modülü - Hızlı Başlangıç Kılavuzu

## 🚀 Hızlı Erişim

### Web Arayüzü
```
Ana Sayfa: http://localhost:5173/certificates
```

### 5 Ana Sekme
1. **Sertifikalar** - Liste ve yönetim
2. **Doğrulama** - Sertifika kontrolü
3. **Şablonlar** - Tasarım yönetimi
4. **Analitik** - İstatistikler
5. **Ayarlar** - Yapılandırma

## 📊 Dashboard Metrikleri

### Ana KPI'lar
```
✅ Toplam Sertifika: 1,247
✅ Aktif Sertifikalar: 1,189
✅ Ortalama Not: 85.4
✅ Toplam İndirme: 3,421
```

## 🎯 Temel İşlemler

### 1. Sertifika Listeleme ve Arama
```
1. /certificates sayfasına git
2. Arama kutusuna:
   - Öğrenci adı
   - Sertifika numarası
   - Sınav adı yaz
3. Filtreleme:
   - Durum seç (Aktif/İptal/Süresi Dolmuş)
   - Şablon seç
```

### 2. Sertifika Görüntüleme
```
1. Sertifika kartında "Görüntüle" butonuna tık
2. Modal açılır:
   - Öğrenci bilgileri
   - Sınav detayları
   - Not ve harf notu
   - QR kod
   - Veren bilgileri
   - Beceri etiketleri
```

### 3. Sertifika İndirme
```
Tek İndirme:
1. "İndir" butonuna tık
2. PDF otomatik indirilir

Toplu İndirme:
1. Filtreleri ayarla
2. Sağ üst "Toplu İndir" butonuna tık
3. Tüm filtrelenmiş sertifikalar indirilir
```

### 4. Sertifika Paylaşımı
```
Link Kopyalama:
1. Paylaş (Share) ikonuna tık
2. Doğrulama linki kopyalanır
3. Toast bildirimi gösterilir

E-posta Gönderimi:
1. Mail ikonuna tık
2. Öğrenci e-postasına gönderilir
3. PDF ek olarak eklenir
```

### 5. Sertifika Doğrulama
```
1. "Doğrulama" sekmesine git
2. Sertifika numarasını gir
   Örnek: CERT-2024-001247
3. "Doğrula" butonuna tık
4. Sonuç:
   ✅ Geçerli: Detaylar gösterilir
   ❌ Geçersiz: Hata mesajı gösterilir
```

### 6. Sertifika İptali
```
1. Sertifikayı görüntüle (modal aç)
2. Alt kısımda "Sertifikayı İptal Et" butonu
3. Onay dialog'unu kabul et
4. Sertifika iptal edilir
5. Artık doğrulamalarda geçersiz çıkar
```

## 🎨 Şablon Yönetimi

### Mevcut Şablonlar
```
1. Classic Blue
   - Geleneksel tasarım
   - Mavi kenarlık
   - Landscape
   - 456 kullanım

2. Modern Gradient
   - Modern tasarım
   - Gradient arka plan
   - Landscape
   - 342 kullanım

3. Minimal White
   - Minimalist
   - Beyaz temiz
   - Portrait
   - 178 kullanım

4. Premium Gold
   - Lüks tasarım
   - Altın yaldız
   - Landscape
   - 271 kullanım (En Popüler!)
```

### Şablon İşlemleri
```
Şablonlar Sekmesinde:
- "Önizle" → Şablonu görüntüle
- "Düzenle" → Şablon ayarlarını değiştir
- "Yeni Şablon" → Yeni tasarım oluştur
```

## 🔍 Filtreleme ve Arama

### Arama Kriterleri
```
Arama Kutusu:
- Öğrenci adı (kısmi eşleşme)
- Sertifika numarası (tam veya kısmi)
- Sınav başlığı (kısmi eşleşme)

Dropdown Filtreler:
1. Durum:
   - Tümü
   - Aktif
   - İptal
   - Süresi Dolmuş

2. Şablon:
   - Tümü
   - Classic Blue
   - Modern Gradient
   - Minimal White
   - Premium Gold

3. Harf Notu: (yakında)
   - Tümü
   - A+, A, B+, B, C+, C, D, F
```

## 📥 İndirme İşlemleri

### PDF İndirme
```
Format: PDF
Boyut: ~ 500KB - 2MB
İçerik:
- Sertifika tasarımı
- QR kod
- Doğrulama linki
- Dijital imza (yakında)
```

### Toplu İndirme
```
Format: ZIP arşivi
İçerik: Birden fazla PDF
Kullanım:
1. Filtreleri ayarla
2. "Toplu İndir" butonuna tık
3. ZIP dosyası indirilir
```

## 📧 E-posta Sistemi

### Otomatik E-posta
```
Gönderilen:
- Sertifika PDF'i (ek)
- Doğrulama linki
- QR kod görseli
- Tebrik mesajı

Alıcı: Öğrenci e-posta adresi
Konu: "Sertifikanız Hazır - [Sınav Adı]"
```

## 🔐 Doğrulama Mekanizması

### Doğrulama Yöntemleri

#### 1. Sertifika Numarası
```
Format: CERT-YYYY-NNNNNN
Örnek: CERT-2024-001247

Kullanım:
1. Doğrulama sekmesine git
2. Numarayı gir
3. Doğrula butonu
```

#### 2. QR Kod
```
1. Mobil cihazdan QR tarayıcı aç
2. Sertifikadaki QR kodu tara
3. Doğrulama sayfası açılır
4. Sertifika bilgileri gösterilir
```

#### 3. Doğrulama Linki
```
Format:
https://zerquiz.com/verify/CERT-2024-001247

Kullanım:
1. Linke tıkla
2. Tarayıcıda aç
3. Otomatik doğrulama yapılır
```

## 📊 Analitik ve İstatistikler

### Dashboard KPI'ları
```
💙 Toplam Sertifika
   Tüm zamanların toplamı

💚 Aktif Sertifikalar
   Geçerli ve kullanılabilir

💜 Ortalama Not
   Tüm sertifikaların not ortalaması

🧡 Toplam İndirme
   İndirme sayısı + Görüntüleme
```

### Analitik Sekme (Yakında)
```
- Aylık trend grafikleri
- Şablon kullanım dağılımı
- Not dağılımı histogram
- Zaman serisi analizleri
- Export to Excel/PDF
```

## 🎨 Durum ve Rozetler

### Sertifika Durumu
```
🟢 Aktif (Yeşil)
   - Geçerli ve kullanılabilir
   - Doğrulamada geçerli çıkar

🔴 İptal (Kırmızı)
   - Manuel iptal edilmiş
   - Doğrulamada geçersiz

⚪ Süresi Dolmuş (Gri)
   - Geçerlilik süresi bitmiş
   - Doğrulamada geçersiz
```

### Not Rozetleri
```
🟢 A+ (90-100) - Emerald
🔵 A  (80-89)  - Blue
🟡 B  (70-79)  - Yellow
🟠 C  (60-69)  - Orange
🔴 F  (<60)    - Red
```

## 💡 İpuçları ve Püf Noktaları

### Hızlı Erişim
```
✨ Klavye Kısayolları:
   - Tab: Sekme geçişi
   - Enter: Arama/Doğrulama

✨ Filtreleme:
   - Birden fazla filtre kombine edilebilir
   - Anlık sonuç gösterimi

✨ Sıralama:
   - Varsayılan: En yeni önce
   - Tıklayarak değiştir (yakında)
```

### Best Practices
```
1. Düzenli Yedekleme:
   - Toplu indirme ile backup al
   - Aylık arşiv oluştur

2. Doğrulama Politikası:
   - QR kod her sertifikada olsun
   - Doğrulama URL'i paylaş

3. Şablon Seçimi:
   - Amaç ve hedef kitleye uygun
   - Premium for important certificates
   - Minimal for quick certifications

4. İptal Yönetimi:
   - Sadece gerektiğinde iptal et
   - İptal nedenini dokümante et
   - Öğrenciyi bilgilendir
```

## 🚨 Sık Karşılaşılan Sorunlar

### Sertifika Bulunamıyor
```
✅ Çözüm:
1. Filtreleri kontrol et
2. "Tümü" seçeneğini seç
3. Arama terimini kısalt
4. Durum filtresini "Tümü" yap
```

### İndirme Çalışmıyor
```
✅ Çözüm:
1. Pop-up engelleyiciyi kapat
2. Tarayıcı izinlerini kontrol et
3. Sayfayı yenile
4. Farklı tarayıcı dene
```

### Doğrulama Başarısız
```
✅ Çözüm:
1. Sertifika numarasını kontrol et
2. Format: CERT-YYYY-NNNNNN
3. Büyük/küçük harf fark etmez
4. Boşluk olmamalı
```

### E-posta Gönderilmiyor
```
✅ Çözüm:
1. E-posta adresi doğru mu?
2. Spam klasörünü kontrol et
3. Birkaç dakika bekle
4. Yeniden gönder
```

## 🎯 Gelişmiş Özellikler

### Toplu İşlemler (Yakında)
```
- Toplu onay/iptal
- Toplu e-posta gönderimi
- Toplu şablon değişikliği
- Toplu export
```

### Özelleştirme (Yakında)
```
- Özel alanlar ekle
- Logo ve marka özelleştir
- Renk teması değiştir
- Font seçenekleri
```

### Entegrasyonlar (Yakında)
```
- LinkedIn paylaşımı
- Blockchain doğrulama
- E-imza entegrasyonu
- LMS entegrasyonları
```

## 📞 Destek

### İletişim
```
Teknik Destek: support@zerquiz.com
Dokümantasyon: docs.zerquiz.com
Video Eğitimler: youtube.com/zerquiz
```

### Kaynaklar
```
📚 CERTIFICATES-MODULE-COMPLETE.md - Detaylı döküman
🎥 Video Tutorial - YouTube kanalı
💬 Community Forum - forum.zerquiz.com
```

## 🎉 Başarı Hikayeleri

### Kullanım Örnekleri
```
🏫 Üniversiteler: 10,000+ sertifika/yıl
🏢 Kurumlar: Çalışan sertifikaları
🎓 Eğitim Merkezleri: Kurs sertifikaları
💼 Etkinlikler: Katılım sertifikaları
```

---

**Not**: Bu modül sürekli geliştirilmektedir. Yeni özellikler eklenecektir.

**Son Güncelleme**: Aralık 2024  
**Versiyon**: 1.0.0

