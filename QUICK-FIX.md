# 🚨 HIZLI ÇÖZÜM - Eksik Veriler

## SORUN
- Kullanıcılar gözükmüyor
- Roller gözükmüyor  
- Zorluk dropdown boş
- Sunum şekli dropdown boş
- Müfredat boş

## NEDEN
Backend servisler çalışıyor ama seed data yok veya `IsActive=false`.

## ÇÖZÜM 1: PostgreSQL ile Direkt Ekleme (EN HIZLI)

```sql
-- 1. QUESTIONS: Zorluk Seviyeleri
DELETE FROM questions_schema.question_difficulty_levels;
INSERT INTO questions_schema.question_difficulty_levels 
("Id", "TenantId", "Code", "Name", "Level", "Color", "IsActive", "IsSystem", "DisplayOrder", "CreatedAt", "UpdatedAt")
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'easy', 'Kolay', 2, '#86efac', true, true, 2, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'medium', 'Orta', 3, '#fbbf24', true, true, 3, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'hard', 'Zor', 4, '#fb923c', true, true, 4, NOW(), NOW());

-- 2. QUESTIONS: Sunum Şekilleri
DELETE FROM questions_schema.question_presentation_types;
INSERT INTO questions_schema.question_presentation_types
("Id", "TenantId", "Code", "Name", "AnswerType", "MinOptions", "MaxOptions", "IsActive", "IsSystem", "DisplayOrder", "CreatedAt", "UpdatedAt")
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'multiple_choice', 'Çoktan Seçmeli', 'single', 2, 5, true, true, 1, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'true_false', 'Doğru/Yanlış', 'single', 2, 2, true, true, 2, NOW(), NOW());

-- 3. IDENTITY: Roller
DELETE FROM identity_schema."AspNetRoles";
INSERT INTO identity_schema."AspNetRoles" ("Id", "Name", "NormalizedName")
VALUES
(gen_random_uuid()::text, 'Admin', 'ADMIN'),
(gen_random_uuid()::text, 'Teacher', 'TEACHER'),
(gen_random_uuid()::text, 'Student', 'STUDENT');

-- 4. IDENTITY: Demo Kullanıcılar
DELETE FROM identity_schema."AspNetUsers";
INSERT INTO identity_schema."AspNetUsers" 
("Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed")
VALUES
(gen_random_uuid()::text, 'admin@test.com', 'ADMIN@TEST.COM', 'admin@test.com', 'ADMIN@TEST.COM', true),
(gen_random_uuid()::text, 'teacher@test.com', 'TEACHER@TEST.COM', 'teacher@test.com', 'TEACHER@TEST.COM', true);
```

## ÇÖZÜM 2: Servisleri Restart Et

```powershell
# Tüm servisleri kapat
Get-Process dotnet | Stop-Process -Force

# Yeniden başlat
.\start-services.ps1

# Seed'leri çalıştır
.\quick-seed.ps1
```

## TEST

```powershell
# API'leri test et
curl http://localhost:5004/api/questions/difficulty-levels
curl http://localhost:5004/api/questions/presentation-types
curl http://localhost:5002/api/identity/roles
curl http://localhost:5002/api/identity/users
```

