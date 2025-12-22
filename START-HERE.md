# 🎯 ZERQUIZ - TAM BAŞLATMA KILAVUZU

## 📊 Mevcut Durum
- ✅ Backend servisler hazır (Identity, Core, Content, Lessons, Grading)
- ✅ Frontend kod hazır  
- ✅ Database scripts hazır
- ✅ 30 AI templates hazır
- ✅ MathJax entegrasyonu hazır
- ⚠️ Servisler başlatılmamış

---

## 🚀 Manuel Başlatma (ÖNERİLEN)

### 1. Backend Servisleri Başlat

**Terminal 1 - Identity (Port 5001)**:
```bash
cd F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api
dotnet run
```

**Terminal 2 - Core (Port 5002)**:
```bash
cd F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api
dotnet run
```

Diğer servisler (opsiyonel):
- Content (5008): `cd F:\yeni_projeler\Zerquiz\services\content\Zerquiz.Content.Api && dotnet run`
- Lessons (5009): `cd F:\yeni_projeler\Zerquiz\services\lessons\Zerquiz.Lessons.Api && dotnet run`
- Grading (5004): `cd F:\yeni_projeler\Zerquiz\services\grading\Zerquiz.Grading.Api && dotnet run`

### 2. Frontend Başlat

**Terminal 3 - Frontend (Port 5173)**:
```bash
cd F:\yeni_projeler\Zerquiz\frontend\zerquiz-web
npm run dev
```

### 3. Tarayıcıda Aç

```
http://localhost:5173
```

Default login:
- Email: `admin@zerquiz.com`
- Password: `Admin123!`

---

## 🔧 Troubleshooting

### Problem 1: "npm run dev" hata veriyor
**Çözüm**:
```bash
cd frontend/zerquiz-web
npm install
npm run dev
```

### Problem 2: Backend "connection refused"
**Çözüm**: Database connection string'i kontrol edin
- Dosya: `services/identity/Zerquiz.Identity.Api/appsettings.json`
- Dosya: `services/core/Zerquiz.Core.Api/appsettings.json`

Connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=zerquiz_db;Username=postgres;Password=Sanez.579112"
}
```

### Problem 3: Database yok
**Çözüm**:
```powershell
# PostgreSQL'e bağlan
psql -U postgres

# Database oluştur
CREATE DATABASE zerquiz_db;

# Exit
\q
```

---

## ✅ Test Adımları

1. **Backend Test**:
   - Identity: http://localhost:5001/swagger
   - Core: http://localhost:5002/swagger

2. **Frontend Test**:
   - Ana sayfa: http://localhost:5173
   - Login sayfası görünmeli

3. **Login Test**:
   - Email: admin@zerquiz.com
   - Password: Admin123!
   - Dashboard'a yönlendirilmeli

4. **Soru Üretici Test**:
   - Sidebar > "Sorular" > "Soru Üretici"
   - 30 soru tipi görünmeli
   - MathJax test: `$x^2$` yazın

---

## 📝 Önemli Notlar

1. **İlk çalıştırmada** dotnet restore gerekebilir:
```bash
cd services/identity/Zerquiz.Identity.Api
dotnet restore
dotnet run
```

2. **Frontend ilk çalıştırmada** npm install gerekebilir:
```bash
cd frontend/zerquiz-web
npm install
npm run dev
```

3. **Database gerekli ise** migration scriptleri çalıştırın:
```bash
psql -U postgres -d zerquiz_db -f infra/docker/complete-ai-services-setup.sql
```

---

## 🎉 Başarılı Başlatma Göstergeleri

✅ Identity service: `Now listening on: http://localhost:5001`  
✅ Core service: `Now listening on: http://localhost:5002`  
✅ Frontend: `Local: http://localhost:5173/`  
✅ Browser: Login sayfası görünür  
✅ Login sonrası: Dashboard ve sidebar menüleri görünür  

---

## 🆘 Acil Yardım

Eğer hiçbir şey çalışmıyorsa:

1. **Tüm terminalleri kapatın** (Ctrl+C)
2. **VSCode'u kapatın ve tekrar açın**
3. **3 yeni terminal açın**
4. **Yukarıdaki adımları takip edin**

---

**Hazırlandı**: 30 Kasım 2025  
**Durum**: Tüm kodlar hazır, sadece başlatma gerekiyor  
**İletişim**: Destek gerekirse yardım edin! 🚀




