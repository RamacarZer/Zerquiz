# Zerquiz - Quick Start Guide

## 🚀 Servisleri Başlatma

### 1. Auth Service (Port 5001)
```bash
cd services/auth/Zerquiz.Auth.Api
dotnet run
```

### 2. Core Service (Port 5002)
```bash
cd services/core/Zerquiz.Core.Api
dotnet run
```

### 3. Questions Service (Port 5005)
```bash
cd services/questions/Zerquiz.Questions.Api
dotnet run
```

### 4. Grading Service (Port 5004) - Analytics dahil
```bash
cd services/grading/Zerquiz.Grading.Api
dotnet run
```

### 5. Content Service (Port 5008) - YENİ
```bash
cd services/content/Zerquiz.Content.Api
dotnet run
```

### 6. Lessons Service (Port 5009) - YENİ
```bash
cd services/lessons/Zerquiz.Lessons.Api
dotnet run
```

### 7. Gateway (Port 5000) - Opsiyonel
```bash
cd infra/gateway
dotnet run
```

## 🎯 Minimum Başlatma (Login için)

Frontend'de login yapabilmek için en azından şunlar çalışmalı:
```bash
# Terminal 1
cd services/auth/Zerquiz.Auth.Api
dotnet run

# Terminal 2
cd services/core/Zerquiz.Core.Api
dotnet run

# Terminal 3 (zaten çalışıyor)
cd frontend/zerquiz-web
npm run dev
```

## 📊 Servis Durumunu Kontrol

Her servis başladığında şu portta erişilebilir:
- Auth: http://localhost:5001/swagger
- Core: http://localhost:5002/swagger
- Grading: http://localhost:5004/swagger
- Questions: http://localhost:5005/swagger
- Content: http://localhost:5008/swagger
- Lessons: http://localhost:5009/swagger
- Gateway: http://localhost:5000

## ⚙️ Veritabanı Setup (İlk Defa)

Eğer henüz veritabanı setup yapmadıysanız:
```bash
# PostgreSQL'e bağlan
psql -U postgres

# Database oluştur
CREATE DATABASE zerquiz;

# Migration scriptleri çalıştır
\c zerquiz
\i infra/docker/lessons-service-setup.sql
\i infra/docker/analytics-enhancement-setup.sql
```

## 🔐 Test Kullanıcısı

Login için test kullanıcısı gerekiyorsa, Auth Service'de seed data olması lazım.

## 💡 Hızlı Test

1. Auth Service çalıştır (Port 5001)
2. Swagger açıp test et: http://localhost:5001/swagger
3. Frontend'de login dene

## 🐛 Sorun Giderme

### "Connection Refused" hatası
- İlgili servis çalışmıyor
- Port doğru mu kontrol et
- Firewall/antivirus kontrolü

### "Database connection" hatası
- PostgreSQL çalışıyor mu?
- Connection string doğru mu?
- Database var mı?

### "JWT validation" hatası
- Auth Service çalışıyor mu?
- JWT SecretKey tüm servislerde aynı mı?




