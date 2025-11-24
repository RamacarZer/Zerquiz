-- Zerquiz Seed Data - Kullanıcılar ve Temel Veriler
\c zerquiz_db

-- Önce mevcut verileri temizle
TRUNCATE TABLE identity_schema.user_roles CASCADE;
TRUNCATE TABLE identity_schema.users CASCADE;
TRUNCATE TABLE identity_schema.roles CASCADE;

-- Roller ekle
INSERT INTO identity_schema.roles ("Id", "TenantId", "Name", "Permissions", "CreatedAt", "CreatedBy")
VALUES 
    ('22222222-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Admin', ARRAY['all'], NOW(), 'system'),
    ('22222222-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Teacher', ARRAY['questions.create'], NOW(), 'system'),
    ('22222222-4444-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Student', ARRAY['exams.take'], NOW(), 'system');

-- Kullanıcılar ekle (BCrypt hash: $2a$11$... basitleştirilmiş versiyon)
-- Gerçek şifre hash'i yerine basit bir hash (demo için)
INSERT INTO identity_schema.users ("Id", "TenantId", "Email", "PasswordHash", "FirstName", "LastName", "IsActive", "EmailConfirmed", "Profile", "CreatedAt", "CreatedBy")
VALUES 
    ('33333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
     'admin@demo.com', 'AQAAAAIAAYagAAAAEKl8xCxHqZ8a8Y7vMJGzKxQO2c3F0l8qMxZ7Y6K5L4M3N2O1P0', 
     'Admin', 'User', true, true, '{"role":"admin"}'::jsonb, NOW(), 'system'),
    ('33333333-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
     'teacher@demo.com', 'AQAAAAIAAYagAAAAEKl8xCxHqZ8a8Y7vMJGzKxQO2c3F0l8qMxZ7Y6K5L4M3N2O1P0', 
     'Ahmet', 'Yilmaz', true, true, '{"role":"teacher"}'::jsonb, NOW(), 'system'),
    ('33333333-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
     'student@demo.com', 'AQAAAAIAAYagAAAAEKl8xCxHqZ8a8Y7vMJGzKxQO2c3F0l8qMxZ7Y6K5L4M3N2O1P0', 
     'Ayse', 'Demir', true, true, '{"role":"student"}'::jsonb, NOW(), 'system');

-- Kullanıcı-Rol ilişkileri
INSERT INTO identity_schema.user_roles ("Id", "UserId", "RoleId", "TenantId", "CreatedAt", "CreatedBy")
VALUES 
    ('44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system'),
    ('44444444-2222-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', '22222222-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system'),
    ('44444444-3333-1111-1111-111111111111', '33333333-3333-1111-1111-111111111111', '22222222-4444-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system');

SELECT 'Kullanıcılar eklendi: ' || COUNT(*) FROM identity_schema.users;
SELECT 'Roller eklendi: ' || COUNT(*) FROM identity_schema.roles;

\echo ''
\echo '✅ Seed data yuklendi!'
\echo ''
\echo 'ONEMLI: Sifre hashleri demo icin basitlestirilmis.'
\echo 'AuthService.cs dosyasinda gerçek hash doğrulaması yapılmalı.'
\echo ''

