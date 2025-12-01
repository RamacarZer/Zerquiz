# 🚀 ZERQUIZ - TÜM SERVİSLERİ BAŞLATMA PLANI

## 📊 Servis Listesi (10 Servis)

| # | Servis | Port | Öncelik | Durum |
|---|--------|------|---------|-------|
| 1 | Identity | 5001 | 🔴 Kritik | ⏳ Başlatılacak |
| 2 | Core | 5002 | 🔴 Kritik | ⏳ Başlatılacak |
| 3 | Exams | 5003 | 🟡 Orta | ⏳ Başlatılacak |
| 4 | Grading | 5004 | 🟡 Orta | ⏳ Başlatılacak |
| 5 | Questions | 5005 | 🟡 Orta | ⏳ Başlatılacak |
| 6 | Curriculum | 5007 | 🟢 Düşük | ⏳ Başlatılacak |
| 7 | Content | 5008 | 🟡 Orta | ⏳ Başlatılacak |
| 8 | Lessons | 5009 | 🟡 Orta | ⏳ Başlatılacak |
| 9 | Presentation | 5010 | 🟢 Düşük | ⏳ Başlatılacak |
| 10 | Frontend | 5173 | 🔴 Kritik | ✅ Çalışıyor |

---

## 🎯 Başlatma Stratejisi

### Faz 1: Kritik Servisler (Login için)
1. Identity Service (5001)
2. Core Service (5002)

### Faz 2: AI ve İçerik Servisleri
3. Content Service (5008) - AI Generation
4. Lessons Service (5009) - Ders Planları

### Faz 3: Eğitim Servisleri
5. Questions Service (5005) - Soru Bankası
6. Exams Service (5003) - Sınavlar
7. Grading Service (5004) - Puanlama + Analytics

### Faz 4: Destek Servisleri
8. Curriculum Service (5007) - Müfredat
9. Presentation Service (5010) - Sunumlar

---

## 📋 ÖN KONTROL

### 1. .NET SDK Kontrol
```powershell
dotnet --version
```
Beklenen: `9.0.x` veya üzeri

### 2. PostgreSQL Kontrol
```powershell
psql -U postgres -c "SELECT version();"
```

### 3. Port Durumu
```powershell
netstat -ano | findstr "5001 5002 5003 5004 5005 5007 5008 5009 5010"
```
Beklenen: Boş (hiçbiri kullanımda olmamalı)

---

## 🛠️ BAŞLATMA KOMUTLARI

### Her Servis İçin Ayrı Terminal Açın

#### Terminal 1 - Identity Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5001`

#### Terminal 2 - Core Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5002`

#### Terminal 3 - Content Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\content\Zerquiz.Content.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5008`

#### Terminal 4 - Lessons Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\lessons\Zerquiz.Lessons.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5009`

#### Terminal 5 - Questions Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\questions\Zerquiz.Questions.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5005`

#### Terminal 6 - Exams Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\exams\Zerquiz.Exams.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5003`

#### Terminal 7 - Grading Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\grading\Zerquiz.Grading.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5004`

#### Terminal 8 - Curriculum Service
```powershell
cd F:\yeni_projeler\Zerquiz\services\curriculum\Zerquiz.Curriculum.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5007`

#### Terminal 9 - Presentation Service (Opsiyonel)
```powershell
cd F:\yeni_projeler\Zerquiz\services\presentation\Zerquiz.Presentation.Api
dotnet restore
dotnet run
```
✅ `Now listening on: http://localhost:5010`

---

## ✅ DOĞRULAMA

### Tüm Servisleri Kontrol Et
```powershell
# PowerShell'de çalıştır
$ports = @(5001, 5002, 5003, 5004, 5005, 5007, 5008, 5009, 5010, 5173)
foreach ($port in $ports) {
    $result = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "✅ Port $port: ÇALIŞIYOR" -ForegroundColor Green
    } else {
        Write-Host "❌ Port $port: KAPALI" -ForegroundColor Red
    }
}
```

### Swagger Kontrolleri
- Identity: http://localhost:5001/swagger
- Core: http://localhost:5002/swagger
- Exams: http://localhost:5003/swagger
- Grading: http://localhost:5004/swagger
- Questions: http://localhost:5005/swagger
- Curriculum: http://localhost:5007/swagger
- Content: http://localhost:5008/swagger
- Lessons: http://localhost:5009/swagger

---

## 🔧 EKSİKLİKLER VE DÜZELTMELER

### Eksiklik 1: appsettings.json Kontrolü

Her serviste connection string kontrolü:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz_db;Username=postgres;Password=Sanez.579112"
  }
}
```

### Eksiklik 2: CORS Ayarları

Her serviste CORS frontend için açık olmalı:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### Eksiklik 3: JWT Ayarları

Identity ve Core service'te JWT secret aynı olmalı:

```json
{
  "Jwt": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong123456789",
    "Issuer": "Zerquiz",
    "Audience": "ZerquizApi"
  }
}
```

---

## 🎯 TEST PLANI

### 1. Login Testi
- URL: http://localhost:5173
- Email: admin@zerquiz.com
- Password: Admin123!
- ✅ Dashboard görünmeli

### 2. Soru Üretici Testi
- Menü: Sorular > Soru Üretici
- ✅ 30 soru tipi görünmeli
- ✅ MathJax çalışmalı: `$x^2$`

### 3. İçerik Kütüphanesi Testi
- Menü: İçerik Kütüphanesi
- ✅ Upload butonu çalışmalı

### 4. Ders Planları Testi
- Menü: Ders Planları
- ✅ Liste görünmeli

### 5. Analytics Testi
- Menü: Analizler > Öğrenci İlerlemesi
- ✅ Grafik görünmeli

---

## 📊 DURUM RAPORU ŞEKLİ

Başlatma sırasında doldurun:

```
✅ Identity (5001) - ÇALIŞIYOR
✅ Core (5002) - ÇALIŞIYOR
⏳ Content (5008) - BAŞLATILIYOR
❌ Lessons (5009) - HATA: Connection refused
...
```

---

## 🆘 SORUN GİDERME

### Problem: "Address already in use"
```powershell
# Portu kullanan process'i bul ve öldür
netstat -ano | findstr "5002"
taskkill /PID [PID] /F
```

### Problem: "Connection string error"
- `appsettings.json` dosyasını kontrol et
- PostgreSQL şifresini doğrula

### Problem: "Build failed"
```powershell
# Temizle ve yeniden build et
dotnet clean
dotnet restore
dotnet build
```

### Problem: "Migration error"
```powershell
# Migration'ları manuel çalıştır
cd services/core/Zerquiz.Core.Infrastructure
dotnet ef database update
```

---

**ŞİMDİ BAŞLAYALIM!** 🚀

1. İlk 2 servisi başlat (Identity + Core)
2. Login test et
3. Diğer servisleri sırayla başlat
4. Her adımda durum bildir
5. Hataları not al

**Hazır mısınız?** Başlayalım! 💪

