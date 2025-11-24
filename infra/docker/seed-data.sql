-- ============================================
-- Zerquiz Platform - Seed Data (Fixed)
-- ============================================

\c zerquiz_db

-- Core: Tenant
INSERT INTO core_schema.tenants ("Id", "Name", "Slug", "IsActive", "Settings", "CreatedAt")
VALUES ('11111111-1111-1111-1111-111111111111', 'Demo Okul', 'demo', true, '{}'::jsonb, NOW());

-- Identity: Roles
INSERT INTO identity_schema.roles ("Id", "TenantId", "Name", "Permissions", "CreatedAt", "CreatedBy")
VALUES 
    ('22222222-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Admin', ARRAY['all'], NOW(), 'system'),
    ('22222222-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Teacher', ARRAY['questions.create'], NOW(), 'system'),
    ('22222222-4444-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Student', ARRAY['exams.take'], NOW(), 'system');

-- Identity: Users (Password: Demo123!)
INSERT INTO identity_schema.users ("Id", "TenantId", "Email", "PasswordHash", "FirstName", "LastName", "IsActive", "EmailConfirmed", "Profile", "CreatedAt", "CreatedBy")
VALUES 
    ('33333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin@demo.com', '$2a$11$hash', 'Admin', 'User', true, true, '{}'::jsonb, NOW(), 'system'),
    ('33333333-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'teacher@demo.com', '$2a$11$hash', 'Ahmet', 'Yılmaz', true, true, '{}'::jsonb, NOW(), 'system'),
    ('33333333-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'student@demo.com', '$2a$11$hash', 'Ayşe', 'Demir', true, true, '{}'::jsonb, NOW(), 'system');

-- Identity: User Roles
INSERT INTO identity_schema.user_roles ("Id", "UserId", "RoleId", "TenantId", "CreatedAt", "CreatedBy")
VALUES 
    ('44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system'),
    ('44444444-2222-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', '22222222-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system'),
    ('44444444-3333-1111-1111-111111111111', '33333333-3333-1111-1111-111111111111', '22222222-4444-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW(), 'system');

-- Curriculum: Education Models
INSERT INTO curriculum_schema.education_models ("Id", "TenantId", "Code", "Name", "Country", "IsActive", "CreatedAt", "CreatedBy")
VALUES ('55555555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'TR_MEB', 'MEB Müfredatı', 'Türkiye', true, NOW(), 'system');

-- Curriculum: Subjects
INSERT INTO curriculum_schema.subjects ("Id", "TenantId", "Code", "Name", "DisplayOrder", "CreatedAt", "CreatedBy")
VALUES 
    ('66666666-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MATH', 'Matematik', 1, NOW(), 'system'),
    ('66666666-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'PHYS', 'Fizik', 2, NOW(), 'system');

-- Questions: Format Types
INSERT INTO questions_schema.question_format_types ("Id", "Code", "Name")
VALUES 
    ('77777777-1111-1111-1111-111111111111', 'multiple_choice', 'Çoktan Seçmeli'),
    ('77777777-2222-1111-1111-111111111111', 'true_false', 'Doğru-Yanlış');

-- Questions: Pedagogical Types
INSERT INTO questions_schema.question_pedagogical_types ("Id", "Code", "Name")
VALUES 
    ('88888888-1111-1111-1111-111111111111', 'reinforcement', 'Pekiştirme'),
    ('88888888-2222-1111-1111-111111111111', 'comprehension', 'Kavrama');

\echo ''
\echo '✅ Seed data yüklendi!'
\echo '📋 Demo Kullanıcılar (Şifre: Demo123!):'
\echo '   • admin@demo.com'
\echo '   • teacher@demo.com'
\echo '   • student@demo.com'
\echo ''
