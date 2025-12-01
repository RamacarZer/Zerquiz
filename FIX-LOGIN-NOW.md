# 🚀 HIZLI BAŞLATMA - ADIM ADIM

## ⚠️ Problem
Backend servisleri çalışmıyor → Login yapılamıyor

## ✅ Çözüm (3 Terminal Gerekli)

### **Terminal 1: Core Service (LOGİN İÇİN ZORUNLU)**

```powershell
# 1. Bu klasöre git
cd F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api

# 2. Servisi başlat
dotnet run
```

**Beklenen Çıktı**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5002
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

✅ Görmeli: `Now listening on: http://localhost:5002`

---

### **Terminal 2: Identity Service (LOGIN İÇİN GEREKLİ)**

```powershell
# 1. Bu klasöre git
cd F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api

# 2. Servisi başlat
dotnet run
```

**Beklenen Çıktı**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
```

✅ Görmeli: `Now listening on: http://localhost:5001`

---

### **Terminal 3: Frontend (ZA TEN ÇALIŞIYOR)**

Eğer frontend çalışmıyorsa:

```powershell
# 1. Bu klasöre git
cd F:\yeni_projeler\Zerquiz\frontend\zerquiz-web

# 2. Frontend'i başlat
npm run dev
```

**Beklenen Çıktı**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🧪 Test Et

### 1. Servisleri Kontrol Et

**PowerShell'de çalıştır**:
```powershell
netstat -ano | findstr "5001 5002 5173"
```

**Beklenen Çıktı**:
```
  TCP    0.0.0.0:5001           0.0.0.0:0              LISTENING       xxxxx
  TCP    0.0.0.0:5002           0.0.0.0:0              LISTENING       xxxxx
  TCP    [::1]:5173             [::]:0                 LISTENING       xxxxx
```

✅ 3 satır görmeli

### 2. Swagger'ı Kontrol Et

**Tarayıcıda aç**:
- Core: http://localhost:5002/swagger
- Identity: http://localhost:5001/swagger

✅ Swagger UI görünmeli

### 3. Login Sayfasını Test Et

**Tarayıcıda aç**: http://localhost:5173

**Login bilgileri**:
- Email: `admin@zerquiz.com`
- Password: `Admin123!`

✅ Dashboard'a yönlendirilmeli

---

## 🔧 Sorun Giderme

### Hata 1: "dotnet: command not found"
**Çözüm**: .NET 9.0 SDK kurulu mu kontrol edin
```powershell
dotnet --version
```
Eğer kurulu değilse: https://dotnet.microsoft.com/download

### Hata 2: "Port already in use"
**Çözüm**: Portu kullanan process'i öldür
```powershell
# 5002 portunu kullanan process'i bul
netstat -ano | findstr "5002"

# Process ID'yi öğren (en sağdaki sayı)
# Sonra öldür (XXXX yerine process ID yaz)
taskkill /PID XXXX /F
```

### Hata 3: "Database connection error"
**Çözüm**: PostgreSQL çalışıyor mu?
```powershell
# PostgreSQL service'ini kontrol et
sc query postgresql-x64-15

# Eğer durmuşsa başlat
net start postgresql-x64-15
```

### Hata 4: "Build failed"
**Çözüm**: NuGet paketlerini restore et
```powershell
cd services\core\Zerquiz.Core.Api
dotnet restore
dotnet build
dotnet run
```

---

## 📋 Kontrol Listesi

Login çalışması için:

- [ ] Terminal 1: Core service çalışıyor (Port 5002)
- [ ] Terminal 2: Identity service çalışıyor (Port 5001)
- [ ] Terminal 3: Frontend çalışıyor (Port 5173)
- [ ] `netstat` komutu 3 portu da gösteriyor
- [ ] http://localhost:5173 açılıyor
- [ ] Login sayfası görünüyor
- [ ] Login bilgileri kabul ediliyor
- [ ] Dashboard'a yönlendiriliyor

---

## 🎯 Özet

**Sadece 3 terminal açın ve bu komutları çalıştırın**:

1. `cd services\core\Zerquiz.Core.Api && dotnet run`
2. `cd services\identity\Zerquiz.Identity.Api && dotnet run`
3. `cd frontend\zerquiz-web && npm run dev`

**Sonra**: http://localhost:5173 → Login → Dashboard

---

## 🆘 Hala Çalışmıyor?

Eğer hala sorun varsa:

1. **Tüm terminalleri kapat** (Ctrl+C)
2. **VSCode'u kapat**
3. **Bilgisayarı yeniden başlat** (en garantisi)
4. **3 terminal aç ve tekrar dene**

Ya da:

**Visual Studio Code içinde çalıştır**:
1. VSCode'da `services\core\Zerquiz.Core.Api\Zerquiz.Core.Api.csproj` dosyasını aç
2. F5'e bas (Debug başlat)
3. Servis otomatik başlayacak

---

**Hazırlandı**: 30 Kasım 2025  
**Aciliyet**: Yüksek - Login için backend şart!  
**Süre**: ~2 dakika (servis başlatma)

🚀 **BAŞARILAR!**

