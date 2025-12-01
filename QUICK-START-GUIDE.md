# 🚀 Quick Start Guide - Zerquiz AI Platform

## Prerequisites

- .NET 9 SDK
- PostgreSQL 14+
- Node.js 18+
- npm or yarn

## 1. Database Setup (5 minutes)

```bash
# Create database
createdb zerquiz_db

# Run setup script
psql -U postgres -d zerquiz_db -f infra/docker/complete-ai-services-setup.sql

# Verify
psql -U postgres -d zerquiz_db -c "\dt content_schema.*"
psql -U postgres -d zerquiz_db -c "\dt lessons_schema.*"
```

Expected output: List of tables in each schema.

---

## 2. Backend Services (10 minutes)

### Terminal 1: Core Service (Port 5001)
```bash
cd services/core/Zerquiz.Core.Api
dotnet restore
dotnet run
```

### Terminal 2: Identity Service (Port 5002)
```bash
cd services/identity/Zerquiz.Identity.Api
dotnet restore
dotnet run
```

### Terminal 3: Content Service (Port 5008) **NEW**
```bash
cd services/content/Zerquiz.Content.Api
dotnet restore
dotnet run
```

### Terminal 4: Lessons Service (Port 5009) **NEW**
```bash
cd services/lessons/Zerquiz.Lessons.Api
dotnet restore
dotnet run
```

### Terminal 5: Grading Service (Port 5006) - Enhanced
```bash
cd services/grading/Zerquiz.Grading.Api
dotnet restore
dotnet run
```

**Check**: All services should show "Now listening on: http://localhost:PORT"

---

## 3. Frontend Setup (5 minutes)

```bash
cd frontend/zerquiz-web

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access**: http://localhost:3000

---

## 4. Quick Test Checklist

### ✅ Backend Health Check

```bash
# Core Service
curl http://localhost:5001/api/health

# Content Service
curl http://localhost:5008/api/health

# Lessons Service
curl http://localhost:5009/api/health
```

### ✅ Frontend Navigation

Open http://localhost:3000 and check:
- [ ] Login page loads
- [ ] Sidebar menu appears (after login)
- [ ] Dashboard shows stats
- [ ] Quick actions work

### ✅ Key Features to Test

1. **Content Upload** (Teacher role):
   - Navigate to "İçerik Kütüphanesi"
   - Drag & drop a PDF file
   - Verify upload progress
   - Click "AI Üret" button

2. **Lesson Plans** (Teacher role):
   - Go to "Ders Planları" → "Şablonlar"
   - See 8 beautiful template cards
   - Click "Bu Şablonla Başla"

3. **Analytics** (Student role):
   - Go to "Analitik" → "İlerleme Takibi"
   - See VARK learning style chart
   - Check AI recommendations

4. **AI Writing Assistant** (All roles):
   - Go to "AI Yardımcılar" → "Yazma Asistanı"
   - Type some text
   - Click any AI tool (Grammar, Clarity, etc.)
   - See AI processing

---

## 5. Sample Data (Optional)

### Create a Test User

```sql
-- Connect to database
psql -U postgres -d zerquiz_db

-- Create admin user
INSERT INTO identity_schema."Users" 
("Id", "TenantId", "Email", "PasswordHash", "IsActive", "CreatedAt", "UpdatedAt")
VALUES 
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 
'admin@zerquiz.com', 'hashed_password', true, NOW(), NOW());

-- Create teacher user
INSERT INTO identity_schema."Users" 
("Id", "TenantId", "Email", "PasswordHash", "IsActive", "CreatedAt", "UpdatedAt")
VALUES 
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 
'teacher@zerquiz.com', 'hashed_password', true, NOW(), NOW());
```

### Upload Sample Content

```bash
# Copy sample PDFs to storage
mkdir -p services/content/Zerquiz.Content.Api/storage
cp path/to/sample.pdf services/content/Zerquiz.Content.Api/storage/
```

---

## 6. Environment Configuration

### Backend: appsettings.json

Each service has its own `appsettings.json`. Key settings:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_content;Password=content_pass_2024"
  },
  "Storage": {
    "LocalPath": "./storage"
  },
  "AI": {
    "Provider": "OpenAI",
    "ApiKey": "your-api-key-here"
  }
}
```

### Frontend: Environment Variables

Create `frontend/zerquiz-web/.env`:

```env
VITE_API_BASE_URL=http://localhost
VITE_ENABLE_MOCK=false
```

---

## 7. Common Issues & Solutions

### Issue: Database connection error

**Solution**:
```bash
# Check PostgreSQL is running
pg_isready

# Check user permissions
psql -U postgres -d zerquiz_db -c "\du"
```

### Issue: Port already in use

**Solution**:
```bash
# Kill process on port
npx kill-port 5001
npx kill-port 3000
```

### Issue: Frontend can't connect to backend

**Solution**:
- Check CORS settings in backend
- Verify API endpoints in `frontend/zerquiz-web/src/config/api.ts`
- Check browser console for errors

---

## 8. Development Workflow

### Hot Reload

- **Backend**: `dotnet watch run` (auto-reload on code changes)
- **Frontend**: `npm run dev` (Vite HMR enabled)

### Debug Mode

**Backend** (VS Code):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/services/content/Zerquiz.Content.Api/bin/Debug/net9.0/Zerquiz.Content.Api.dll",
      "args": [],
      "cwd": "${workspaceFolder}/services/content/Zerquiz.Content.Api",
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

**Frontend** (Chrome DevTools):
- Open http://localhost:3000
- Press F12
- Use React DevTools extension

---

## 9. Testing

### Unit Tests (TODO)
```bash
dotnet test
```

### E2E Tests (TODO)
```bash
npm run test:e2e
```

---

## 10. Production Deployment

### Docker Compose (Recommended)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: zerquiz_db
      POSTGRES_PASSWORD: secure_password
    volumes:
      - ./infra/docker/complete-ai-services-setup.sql:/docker-entrypoint-initdb.d/init.sql

  content-service:
    build: ./services/content/Zerquiz.Content.Api
    ports:
      - "5008:5008"
    depends_on:
      - postgres

  lessons-service:
    build: ./services/lessons/Zerquiz.Lessons.Api
    ports:
      - "5009:5009"
    depends_on:
      - postgres

  frontend:
    build: ./frontend/zerquiz-web
    ports:
      - "80:80"
    depends_on:
      - content-service
      - lessons-service
```

Run:
```bash
docker-compose up -d
```

---

## 🎉 You're Ready!

Your Zerquiz AI Platform is now running. Check:

- **Frontend**: http://localhost:3000
- **Swagger (Content)**: http://localhost:5008/swagger
- **Swagger (Lessons)**: http://localhost:5009/swagger

**Next Steps**:
1. Configure AI provider (OpenAI API key)
2. Upload your first content
3. Generate AI modules
4. Invite users!

**Need Help?** Check the full documentation:
- `README.md` - Project overview
- `PHASE-1-COMPLETION-REPORT.md` - Phase 1 features
- `PHASE-2-COMPLETION-REPORT.md` - Phase 2 features
- `UX-UI-EXCELLENCE-REPORT.md` - UI/UX guide

