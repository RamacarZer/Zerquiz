# 🚀 TÜM SERVİSLERİ BAŞLATMA - MANUEL YÖNTEM

## ⚠️ Önemli Not
Otomatik başlatma çalışmadı. Manuel başlatma gerekiyor.

---

## 📋 BAŞLATMA SERİSİ (8 Terminal Gerekli)

### Terminal 1 - Identity Service ⭐ KRİTİK
```cmd
cd F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5001`

---

### Terminal 2 - Core Service ⭐ KRİTİK
```cmd
cd F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5002`

---

### Terminal 3 - Content Service (AI Generation)
```cmd
cd F:\yeni_projeler\Zerquiz\services\content\Zerquiz.Content.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5008`

---

### Terminal 4 - Lessons Service (Ders Planları)
```cmd
cd F:\yeni_projeler\Zerquiz\services\lessons\Zerquiz.Lessons.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5009`

---

### Terminal 5 - Questions Service (Soru Bankası)
```cmd
cd F:\yeni_projeler\Zerquiz\services\questions\Zerquiz.Questions.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5005`

---

### Terminal 6 - Exams Service (Sınavlar)
```cmd
cd F:\yeni_projeler\Zerquiz\services\exams\Zerquiz.Exams.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5003`

---

### Terminal 7 - Grading Service (Puanlama + Analytics)
```cmd
cd F:\yeni_projeler\Zerquiz\services\grading\Zerquiz.Grading.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5004`

---

### Terminal 8 - Curriculum Service (Müfredat)
```cmd
cd F:\yeni_projeler\Zerquiz\services\curriculum\Zerquiz.Curriculum.Api
dotnet run
```
✅ Bekle: `Now listening on: http://localhost:5007`

---

## ✅ KONTROL

### Tüm Portları Kontrol Et
```powershell
netstat -ano | findstr "5001 5002 5003 5004 5005 5007 5008 5009 5173"
```

**Görmeli**: 9 satır (8 backend + 1 frontend)

### Swagger Kontrolleri
Tarayıcıda aç:
- ✅ http://localhost:5001/swagger (Identity)
- ✅ http://localhost:5002/swagger (Core)
- ✅ http://localhost:5008/swagger (Content)
- ✅ http://localhost:5009/swagger (Lessons)
- ✅ http://localhost:5005/swagger (Questions)
- ✅ http://localhost:5003/swagger (Exams)
- ✅ http://localhost:5004/swagger (Grading)
- ✅ http://localhost:5007/swagger (Curriculum)

---

## 🧪 LOGIN TESTİ

1. **Aç**: http://localhost:5173
2. **Login**:
   - Email: `admin@zerquiz.com`
   - Password: `Admin123!`
3. ✅ **Dashboard görünmeli**

---

## 📊 DURUM RAPORU

Her servis başladığında işaretleyin:

- [ ] Identity (5001) - ÇALIŞIYOR
- [ ] Core (5002) - ÇALIŞIYOR
- [ ] Content (5008) - ÇALIŞIYOR
- [ ] Lessons (5009) - ÇALIŞIYOR
- [ ] Questions (5005) - ÇALIŞIYOR
- [ ] Exams (5003) - ÇALIŞIYOR
- [ ] Grading (5004) - ÇALIŞIYOR
- [ ] Curriculum (5007) - ÇALIŞIYOR
- [ ] Frontend (5173) - ÇALIŞIYOR

---

## 🔧 SORUN GİDERME

### Problem: "Build failed"
```cmd
cd [servis-klasörü]
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Problem: "Port already in use"
```powershell
# Portu kullanan process'i bul
netstat -ano | findstr "5002"
# Process ID'yi öğren ve kapat
taskkill /PID [PID] /F
```

### Problem: "Database connection error"
`appsettings.json` dosyasındaki connection string'i kontrol et:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz_db;Username=postgres;Password=Sanez.579112"
  }
}
```

---

## 🎯 ÖNCELİK SIRASI

**Eğer 8 terminal çok fazlaysa, önce bunları başlat**:

1. ⭐ Identity (5001) - LOGİN İÇİN ZORUNLU
2. ⭐ Core (5002) - LOGİN İÇİN ZORUNLU
3. Content (5008) - AI özellikleri için
4. Lessons (5009) - Ders planları için

**Sonra bunları ekle**:

5. Questions (5005) - Soru bankası için
6. Grading (5004) - Analytics için
7. Exams (5003) - Sınavlar için
8. Curriculum (5007) - Müfredat için

---

## 🚀 HIZLI BAŞLATMA İPUCU

### Windows Terminal Kullanıyorsanız:
1. Windows Terminal aç
2. 8 tane yeni tab aç (Ctrl+Shift+T)
3. Her tab'da bir servisi başlat

### VSCode Kullanıyorsanız:
1. VSCode integrated terminal aç
2. Split terminal (+ ikonu)
3. Her panelde bir servis

---

**ŞİMDİ**: 8 terminal aç ve servisleri sırayla başlat!

**İlk 2 servis başladığında** (Identity + Core):
- http://localhost:5173 → Login test et
- ✅ Çalışırsa devam et, diğer servisleri ekle

**BAŞARILAR!** 💪




