# Zerquiz Platform - Setup Scripts

Bu klasör Zerquiz platformunun kurulumu ve çalıştırılması için gerekli scriptleri içerir.

## 📋 Kurulum Sırası

### 1. PostgreSQL Veritabanlarını Oluştur

```bash
# PostgreSQL'e bağlan
psql -U postgres

# SQL scriptini çalıştır
\i scripts/create-databases.sql
```

Ya da:

```bash
psql -U postgres -f scripts/create-databases.sql
```

Bu script 9 ayrı veritabanı oluşturur:

- `zerquiz_core`
- `zerquiz_identity`
- `zerquiz_curriculum`
- `zerquiz_questions`
- `zerquiz_exams`
- `zerquiz_grading`
- `zerquiz_royalty`
- `zerquiz_presentation`
- `zerquiz_finance`

### 2. Entity Framework Migrations Çalıştır

```powershell
# PowerShell'de çalıştır
.\scripts\run-migrations.ps1
```

Bu script:

- Tüm servislerde migrations oluşturur (eğer yoksa)
- Migrations'ları veritabanına uygular
- Her servisin tabularını ve schema'larını oluşturur

### 3. Servisleri Başlat

```powershell
# Tüm servisleri ayrı terminal pencerelerinde başlat
.\scripts\start-all-services.ps1
```

Bu script 10 servis başlatır:

- Gateway (5000)
- Core (5001)
- Identity (5002)
- Curriculum (5003)
- Questions (5004)
- Exams (5005)
- Grading (5006)
- Royalty (5007)
- Presentation (5008)
- Finance (5009)

### 4. Seed Data Yükle

```powershell
# Servislerin başlamasını bekle (30 saniye), sonra:
.\scripts\seed-all-data.ps1
```

Bu script:

- Her servise seed endpoint çağrısı yapar
- Demo verilerini yükler
- İlk kullanıcıları ve rolleri oluşturur

### 5. Frontend Başlat

```bash
cd frontend/zerquiz-web
npm install
npm run dev
```

Frontend: http://localhost:3000

## 🔍 Swagger Endpoints

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

## 🧪 Test Endpointleri

### Health Check

```bash
curl http://localhost:5000/health
```

### Seed Data (örnek)

```bash
curl -X POST http://localhost:5001/api/seed/seed-all
curl -X POST http://localhost:5003/api/seeddefinitions/seed-all
```

## 🛠️ Troubleshooting

### Migration Hataları

Eğer migration hatası alırsanız:

```bash
cd services/[service-name]/[Service].Api
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Port Çakışması

Eğer bir port zaten kullanılıyorsa, ilgili servisin `appsettings.json` dosyasındaki `urls` ayarını değiştirin.

### Veritabanı Bağlantı Hatası

Connection string'leri her servisin `appsettings.json` dosyasında kontrol edin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zerquiz_[service];Username=postgres;Password=your_password"
  }
}
```

## 📝 Manuel Kurulum

Scriptleri kullanmak istemiyorsanız, her adımı manuel yapabilirsiniz:

1. Her servis için:

```bash
cd services/[service]/[Service].Api
dotnet ef database update
dotnet run
```

2. Seed data için her servise HTTP POST request gönderin

## 🔐 Güvenlik

**ÖNEMLİ:** Production ortamında:

- `appsettings.json` dosyalarındaki password'leri değiştirin
- Environment variables kullanın
- JWT secret key'lerini güvenli hale getirin
- HTTPS zorunlu yapın

## 📦 Gereksinimler

- .NET 9.0 SDK
- PostgreSQL 14+
- Node.js 18+ (Frontend için)
- PowerShell 7+ (Windows scripts için)
