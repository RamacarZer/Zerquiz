# Zerquiz Platform - Complete Startup Guide

## 📋 Prerequisites

- ✅ .NET 9.0 SDK
- ✅ PostgreSQL 15+
- ✅ Node.js 18+
- ✅ OpenAI API Key (optional for AI features)

---

## 🗄️ Step 1: Database Setup

### 1.1 Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zerquiz;

# Exit psql
\q
```

### 1.2 Run Migration Scripts
```bash
# Navigate to project root
cd F:\yeni_projeler\Zerquiz

# Run all migration scripts in order
psql -U postgres -d zerquiz -f infra/docker/complete-ai-services-setup.sql
psql -U postgres -d zerquiz -f infra/docker/lessons-service-setup.sql
psql -U postgres -d zerquiz -f infra/docker/analytics-enhancement-setup.sql
psql -U postgres -d zerquiz -f infra/docker/content-service-setup.sql
```

---

## 🚀 Step 2: Backend Services

### 2.1 Update Connection Strings

**Identity Service** - `services/identity/Zerquiz.Identity.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**Core Service** - `services/core/Zerquiz.Core.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**Content Service** - `services/content/Zerquiz.Content.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz;Username=postgres;Password=YOUR_PASSWORD"
  },
  "AI": {
    "Provider": "openai",
    "ApiKey": "sk-YOUR_OPENAI_KEY",
    "Model": "gpt-4o",
    "Temperature": 0.7,
    "MaxTokens": 2000
  }
}
```

**Lessons Service** - `services/lessons/Zerquiz.Lessons.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**Grading Service** - `services/grading/Zerquiz.Grading.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=zerquiz;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

### 2.2 Start Services

Open **5 separate terminals** and run:

#### Terminal 1: Identity Service (Port 5001)
```bash
cd services/identity/Zerquiz.Identity.Api
dotnet restore
dotnet run
```

#### Terminal 2: Core Service (Port 5002)
```bash
cd services/core/Zerquiz.Core.Api
dotnet restore
dotnet run
```

#### Terminal 3: Content Service (Port 5008)
```bash
cd services/content/Zerquiz.Content.Api
dotnet restore
dotnet run
```

#### Terminal 4: Lessons Service (Port 5009)
```bash
cd services/lessons/Zerquiz.Lessons.Api
dotnet restore
dotnet run
```

#### Terminal 5: Grading Service (Port 5004)
```bash
cd services/grading/Zerquiz.Grading.Api
dotnet restore
dotnet run
```

### 2.3 Verify Services

Check if services are running:
- Identity: http://localhost:5001/swagger
- Core: http://localhost:5002/swagger
- Content: http://localhost:5008/swagger
- Lessons: http://localhost:5009/swagger
- Grading: http://localhost:5004/swagger

---

## 🎨 Step 3: Frontend

### 3.1 Install Dependencies
```bash
cd frontend/zerquiz-web
npm install
```

### 3.2 Update API Configuration

**File**: `frontend/zerquiz-web/src/lib/api-client.ts`

Verify BASE_URL points to Core Service:
```typescript
const BASE_URL = 'http://localhost:5002/api';
```

### 3.3 Start Frontend
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

---

## 🧪 Step 4: Testing

### 4.1 Test Login
1. Open browser: http://localhost:5173
2. Click "Login"
3. Use test credentials:
   - Email: `admin@zerquiz.com`
   - Password: `Admin123!`

### 4.2 Test Navigation
1. After login, check sidebar menu
2. Navigate to "Sorular" > "Soru Üretici"
3. Test MathJax: Type `$x^2 + y^2 = z^2$`

### 4.3 Test AI Generation (Optional)
1. Go to "İçerik Kütüphanesi"
2. Upload a PDF
3. Click "AI Üret"
4. Select question types
5. Generate quiz

---

## 🔧 Troubleshooting

### Issue 1: ERR_CONNECTION_REFUSED
**Solution**: Make sure Identity & Core services are running
```bash
# Check if services are up
curl http://localhost:5001/health
curl http://localhost:5002/health
```

### Issue 2: Database Connection Failed
**Solution**: Check PostgreSQL is running
```bash
# Windows
services.msc → PostgreSQL service → Start

# Check connection
psql -U postgres -d zerquiz -c "SELECT version();"
```

### Issue 3: CORS Errors
**Solution**: Verify CORS configuration in each service's `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### Issue 4: MathJax Not Rendering
**Solution**: Check browser console for MathJax load errors
- Open DevTools (F12)
- Check Network tab for MathJax CDN
- Refresh page (Ctrl+F5)

---

## 📊 Service Ports Reference

| Service | Port | Purpose |
|---------|------|---------|
| Identity | 5001 | Authentication |
| Core | 5002 | System definitions, tenants |
| Exams | 5003 | Exam management |
| Grading | 5004 | Grading + Analytics |
| Questions | 5005 | Question bank |
| Curriculum | 5007 | Curriculum standards |
| Content | 5008 | PDF + AI Generation |
| Lessons | 5009 | Lesson plans + Assignments |
| Frontend | 5173 | React UI |

---

## 🎯 Quick Test Checklist

- [ ] PostgreSQL running
- [ ] Database `zerquiz` created
- [ ] Migration scripts executed
- [ ] Identity service running (5001)
- [ ] Core service running (5002)
- [ ] Content service running (5008)
- [ ] Lessons service running (5009)
- [ ] Grading service running (5004)
- [ ] Frontend running (5173)
- [ ] Can login successfully
- [ ] Sidebar menu visible
- [ ] Can navigate to "Soru Üretici"
- [ ] MathJax renders correctly

---

## 🚀 One-Command Startup (PowerShell)

Create `start-all.ps1`:
```powershell
# Start all services in separate windows

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/identity/Zerquiz.Identity.Api; dotnet run"
Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/core/Zerquiz.Core.Api; dotnet run"
Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/content/Zerquiz.Content.Api; dotnet run"
Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/lessons/Zerquiz.Lessons.Api; dotnet run"
Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/grading/Zerquiz.Grading.Api; dotnet run"
Start-Sleep -Seconds 5

Write-Host "All backend services started! Starting frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/zerquiz-web; npm run dev"

Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
```

Run:
```powershell
.\start-all.ps1
```

---

## 📝 Default Test Users

After running migrations, these users will be available:

| Email | Password | Role |
|-------|----------|------|
| admin@zerquiz.com | Admin123! | SuperAdmin |
| teacher@zerquiz.com | Teacher123! | Teacher |
| student@zerquiz.com | Student123! | Student |

---

## 🎉 You're Ready!

Once all services are green:
1. Open http://localhost:5173
2. Login with admin credentials
3. Explore the platform!

**Happy Testing! 🚀**




