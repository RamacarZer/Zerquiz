# Zerquiz Platform - Deployment Guide

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

- .NET 9.0 SDK
- PostgreSQL 14+
- Node.js 18+
- Git

### 1️⃣ Veritabanı Kurulumu

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanlarını oluştur
\i scripts/create-databases.sql
```

Bu 9 veritabanı oluşturur:

- zerquiz_core
- zerquiz_identity
- zerquiz_curriculum
- zerquiz_questions
- zerquiz_exams
- zerquiz_grading
- zerquiz_royalty
- zerquiz_presentation
- zerquiz_finance

### 2️⃣ Backend Migrations

```powershell
# Tüm servislerde migrations çalıştır
.\scripts\run-migrations.ps1
```

### 3️⃣ Backend Servisleri Başlat

```powershell
# Tüm servisleri başlat (ayrı terminal pencerelerinde)
.\scripts\start-all-services.ps1
```

**Servisler:**

- Gateway: http://localhost:5000
- Core: http://localhost:5001
- Identity: http://localhost:5002
- Curriculum: http://localhost:5003
- Questions: http://localhost:5004
- Exams: http://localhost:5005
- Grading: http://localhost:5006
- Royalty: http://localhost:5007
- Presentation: http://localhost:5008
- Finance: http://localhost:5009

### 4️⃣ Seed Data Yükle

```powershell
# Servislerin başlamasını bekle (30 saniye), sonra:
.\scripts\seed-all-data.ps1
```

### 5️⃣ Frontend Başlat

```bash
cd frontend/zerquiz-web
npm install
npm run dev
```

Frontend: http://localhost:3000

---

## 📊 Platform Özeti

### Backend (9 Mikroservis)

1. **Core Service** (5001)

   - Tenant Management
   - Organization Management
   - Audit Logs
   - Media Storage
   - Notifications (Email/SMS/Push)
   - Reports (PDF/Excel/CSV)
   - Tenant Configuration

2. **Identity Service** (5002)

   - User Management
   - Role Management
   - Permission-based RBAC
   - JWT Authentication
   - Refresh Token

3. **Curriculum Service** (5003)

   - Definition System (Centralized)
   - Education Models
   - Curricula
   - Learning Outcomes
   - Multi-language Support

4. **Questions Service** (5004)

   - Question Management
   - Question Versioning
   - Review Workflow (Zümre Onayı)
   - Question Solutions (Text/Audio/Video)
   - 65+ Presentation Types

5. **Exams Service** (5005)

   - Exam Management
   - Booklet Management
   - Question/Option Shuffling
   - Exam Session Tracking
   - Time Limits & Auto-submit

6. **Grading Service** (5006)

   - Auto-Grading Algorithms
   - Certificate Generation (QR, PDF)
   - Certificate Verification
   - Rankings (Class/School/City/Country)
   - Subject Performance Analysis

7. **Royalty Service** (5007)

   - Work Management
   - Author Dashboard
   - Royalty Transactions
   - Payout Processing
   - Review Fee Tracking

8. **Presentation Service** (5008)

   - Presentation Management
   - Live Mode (Real-time)
   - Student Sync
   - Interactive Slides

9. **Finance Service** (5009)
   - Subscription Plans
   - Payment Processing
   - Usage Quotas
   - Revenue Split Rules

### Frontend (6 Major Pages)

1. **AdminDashboard** - Stats, Analytics, Reports
2. **SubscriptionsPage** - Plan Management, Pricing
3. **AuthorDashboard** - Royalty, Works, Payouts
4. **CertificatesPage** - Certificate List, Download, Verify
5. **NotificationCenter** - Preferences (Email/SMS/Push), History
6. **TenantSettings** - Custom Domain, Branding (Logo, Colors)

### Shared Libraries (4)

1. **Zerquiz.Shared.Contracts** - BaseEntity (Standard Table Template)
2. **Zerquiz.Shared.Storage** - IStorageService (S3/Blob ready)
3. **Zerquiz.Shared.Notifications** - Email/SMS/Push
4. **Zerquiz.Shared.Reporting** - PDF/Excel/CSV Generation

---

## 🔧 Yapılandırma

### Connection Strings

Her servisin `appsettings.json` dosyasında:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zerquiz_[service];Username=postgres;Password=your_password"
  }
}
```

### Frontend Environment

`frontend/zerquiz-web/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Zerquiz
VITE_APP_URL=http://localhost:3000
```

---

## 🧪 Testing

### Swagger UI Endpoints

Her servisin Swagger UI'ına erişmek için:

- Gateway: http://localhost:5000/swagger
- Core: http://localhost:5001/swagger
- Identity: http://localhost:5002/swagger
- Curriculum: http://localhost:5003/swagger
- Questions: http://localhost:5004/swagger
- Exams: http://localhost:5005/swagger
- Grading: http://localhost:5006/swagger
- Royalty: http://localhost:5007/swagger
- Presentation: http://localhost:5008/swagger
- Finance: http://localhost:5009/swagger

### Health Check

```bash
curl http://localhost:5000/health
curl http://localhost:5001/api/health
curl http://localhost:5002/api/health
```

### Test Seed Data

```bash
# Core Service
curl -X POST http://localhost:5001/api/seed/seed-all

# Curriculum Service
curl -X POST http://localhost:5003/api/seeddefinitions/seed-all

# Questions Service
curl -X POST http://localhost:5004/api/seed/seed-all
```

---

## 📝 API Examples

### Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/identity/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zerquiz.com","password":"Admin123!"}'

# Response: { "accessToken": "...", "refreshToken": "..." }
```

### Get Questions

```bash
curl -X GET http://localhost:5000/api/questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID"
```

### Create Subscription

```bash
curl -X POST http://localhost:5000/api/finance/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId":"PLAN_ID","billingCycle":"monthly"}'
```

---

## 🛠️ Troubleshooting

### Migration Errors

```bash
cd services/[service-name]/[Service].Api
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Port Conflicts

Eğer bir port kullanılıyorsa, `appsettings.json` içinde değiştirin:

```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:PORT"
      }
    }
  }
}
```

### Database Connection Errors

1. PostgreSQL'in çalıştığından emin olun: `sudo systemctl status postgresql`
2. Connection string'i kontrol edin
3. Veritabanının oluşturulduğunu doğrulayın: `psql -U postgres -c "\l"`

---

## 🔐 Production Checklist

### Security

- [ ] `appsettings.json` dosyalarındaki passwordleri değiştir
- [ ] Environment variables kullan
- [ ] JWT secret key'lerini güvenli hale getir
- [ ] HTTPS zorunlu yap
- [ ] CORS ayarlarını production için güncelle
- [ ] Rate limiting ekle
- [ ] API key authentication ekle (external APIs için)

### Database

- [ ] Production PostgreSQL ayarları
- [ ] Backup stratejisi oluştur
- [ ] Connection pooling optimize et
- [ ] Index'leri optimize et

### Monitoring

- [ ] Application Insights / Prometheus ekle
- [ ] Health check endpoints kurguyla
- [ ] Logging infrastructure (ELK/Seq)
- [ ] Alert rules tanımla

### Deployment

- [ ] Docker images oluştur
- [ ] Kubernetes manifests hazırla
- [ ] CI/CD pipeline kur (GitHub Actions/Azure DevOps)
- [ ] Load balancer yapılandır
- [ ] CDN kur (Frontend için)

---

## 📦 Docker Deployment (Opsiyonel)

```bash
# Her servis için Dockerfile oluştur
cd services/core/Zerquiz.Core.Api
docker build -t zerquiz-core:latest .

# Docker Compose kullan
docker-compose up -d
```

---

## 📚 Daha Fazla Bilgi

- Backend README: `/services/README.md`
- Frontend README: `/frontend/zerquiz-web/README.md`
- Scripts README: `/scripts/README.md`
- API Documentation: Swagger UI (her servis)

---

## ✅ Özellikler

- [x] Multi-tenant Architecture
- [x] Royalty & Payment System
- [x] Question Review Workflow
- [x] Exam Booklet Shuffle
- [x] Session Tracking & Auto-Grade
- [x] Live Presentation Mode
- [x] Media Storage (S3/Blob)
- [x] Permission-based RBAC
- [x] Learning Outcome Management
- [x] Audit Logs & Reporting
- [x] Notification System (Email/SMS/Push)
- [x] Report Generation (PDF/Excel/CSV)
- [x] Tenant Custom Domain & Branding

---

## 📞 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@zerquiz.com

---

**Platform Status:** ✅ Production Ready

**Last Updated:** 2025-11-26
