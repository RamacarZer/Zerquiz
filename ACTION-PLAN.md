# 🎯 TÜM SERVİSLERİ BAŞLATMA - HAREKETSouthern PLANI

## 📋 DURUM

✅ **Hazır**:
- 10 mikroservis kodu tamamlandı
- Frontend hazır ve çalışıyor
- 30 AI template hazır
- MathJax entegre
- Startup scriptleri oluşturuldu

⏳ **Yapılacak**:
- Servisleri başlat
- Eksiklikleri tespit et
- Hataları düzelt

---

## 🚀 HAREKETLİ ADIMLAR

### SEÇENEK 1: Otomatik Başlatma (ÖNERİLEN)

**Tek komutla tüm servisleri başlat**:

```cmd
start-all-services.bat
```

Bu script:
- ✅ 9 ayrı terminal penceresi açar
- ✅ Her servisi otomatik başlatır
- ✅ 5 saniye ara ile sırayla başlatır
- ✅ Durum bilgisi gösterir

### SEÇENEK 2: Manuel Başlatma

**9 ayrı terminal açıp sırayla**:

1. **Terminal 1**: `cd services\identity\Zerquiz.Identity.Api && dotnet run`
2. **Terminal 2**: `cd services\core\Zerquiz.Core.Api && dotnet run`
3. **Terminal 3**: `cd services\content\Zerquiz.Content.Api && dotnet run`
4. **Terminal 4**: `cd services\lessons\Zerquiz.Lessons.Api && dotnet run`
5. **Terminal 5**: `cd services\questions\Zerquiz.Questions.Api && dotnet run`
6. **Terminal 6**: `cd services\exams\Zerquiz.Exams.Api && dotnet run`
7. **Terminal 7**: `cd services\grading\Zerquiz.Grading.Api && dotnet run`
8. **Terminal 8**: `cd services\curriculum\Zerquiz.Curriculum.Api && dotnet run`
9. **Terminal 9**: `cd frontend\zerquiz-web && npm run dev`

---

## ✅ BAŞLATMA SONRASI KONTROL

### 1. Servis Durumu Kontrolü

```cmd
check-services.bat
```

**Beklenen Çıktı**:
```
✓ Port 5001 (Identity): ÇALIŞIYOR
✓ Port 5002 (Core): ÇALIŞIYOR
✓ Port 5003 (Exams): ÇALIŞIYOR
✓ Port 5004 (Grading): ÇALIŞIYOR
✓ Port 5005 (Questions): ÇALIŞIYOR
✓ Port 5007 (Curriculum): ÇALIŞIYOR
✓ Port 5008 (Content): ÇALIŞIYOR
✓ Port 5009 (Lessons): ÇALIŞIYOR
✓ Port 5173 (Frontend): ÇALIŞIYOR
```

### 2. Swagger Kontrolleri

Tarayıcıda sırayla aç:
- http://localhost:5001/swagger ✅
- http://localhost:5002/swagger ✅
- http://localhost:5003/swagger ✅
- http://localhost:5004/swagger ✅
- http://localhost:5005/swagger ✅
- http://localhost:5007/swagger ✅
- http://localhost:5008/swagger ✅
- http://localhost:5009/swagger ✅

### 3. Frontend Testi

**http://localhost:5173**:
- ✅ Login sayfası görünmeli
- ✅ Login başarılı olmalı (admin@zerquiz.com / Admin123!)
- ✅ Dashboard yüklenme li
- ✅ Sidebar menü görünmeli

---

## 🔧 EKSİKLİK TESPİT VE DÜZELTME

### Test Senaryoları

#### 1. Login Testi
```
Adım 1: http://localhost:5173 aç
Adım 2: Email: admin@zerquiz.com
Adım 3: Password: Admin123!
Adım 4: Login butonuna tıkla

Beklenen: Dashboard'a yönlendir
Eğer Hata: Backend servis loglarını kontrol et
```

#### 2. Soru Üretici Testi
```
Adım 1: Sidebar > "Sorular" > "Soru Üretici"
Adım 2: 30 soru tipi görünmeli
Adım 3: Bir tip seç (ör: Çoktan Seçmeli)
Adım 4: "Soru Oluşturmaya Başla"

Beklenen: Soru editörü açılır
Eğer Hata: Console logları kontrol et
```

#### 3. MathJax Testi
```
Adım 1: Soru editöründe
Adım 2: Soru metnine yaz: $x^2 + y^2 = z^2$
Adım 3: Formül otomatik render olmalı

Beklenen: x² + y² = z² görünür
Eğer Hata: Network tab'da MathJax CDN kontrol et
```

#### 4. İçerik Kütüphanesi Testi
```
Adım 1: Sidebar > "İçerik Kütüphanesi"
Adım 2: "Upload" butonu çalışmalı
Adım 3: PDF yükle

Beklenen: Content Service (5008) POST isteği
Eğer Hata: Content Service logları kontrol et
```

#### 5. Ders Planları Testi
```
Adım 1: Sidebar > "Ders Planları"
Adım 2: Liste yüklenmeli
Adım 3: "Yeni Ders Planı" butonu çalışmalı

Beklenen: Lessons Service (5009) GET isteği
Eğer Hata: Lessons Service logları kontrol et
```

---

## 📊 HATA RAPORLAMA ŞABLONU

### Servis Başlatma Hatası
```
Servis: [Identity/Core/Content/vb]
Port: [5001/5002/vb]
Hata Mesajı: [Tam hata]
Log: [İlgili log satırları]
```

### Frontend Hatası
```
Sayfa: [Login/Dashboard/Soru Üretici/vb]
Hata: [Console hata mesajı]
Network: [Failed request URL]
Status: [404/500/vb]
```

### Database Hatası
```
Servis: [Hangi servis]
Hata: [Connection/Migration/vb]
Connection String: [Kontrol edildi mi?]
```

---

## 🎯 BEKLENİLEN SONUÇ

✅ **Başarılı Başlatma**:
- 9 terminal penceresi açık
- Her terminalde "Now listening on..." mesajı
- Frontend'te login başarılı
- Tüm menüler erişilebilir
- MathJax çalışıyor
- Soru üretici açılıyor

❌ **Olası Sorunlar**:
- Port çakışması → `taskkill` ile çöz
- Connection string hatası → `appsettings.json` düzelt
- Database yok → Migration scriptleri çalıştır
- Build hatası → `dotnet restore` çalıştır

---

## 📞 SONRAKİ ADIMLAR

1. **ŞİMDİ**: `start-all-services.bat` çalıştır
2. **5 dakika sonra**: `check-services.bat` ile kontrol et
3. **Login test et**: http://localhost:5173
4. **Hataları raporla**: Hangi servis, ne hatası
5. **Birlikte düzeltelim**: Her hatayı tek tek çözelim

---

**HAZIR MISIN?** 🚀

Komut:
```cmd
start-all-services.bat
```

**GO! GO! GO!** 💪




