-- Zerquiz Seed Data (Professional BaseEntity compatible)
\c zerquiz_db;

-- ============================================
-- ROLES (Identity Schema)
-- ============================================
INSERT INTO identity_schema.roles (
    "Id", "TenantId", "Name", "Description", "Permissions", 
    "CreatedAt", "UpdatedAt", "CreatedBy", "IsActive"
)
VALUES
('22222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'SuperAdmin', 'Süper Yönetici - Tüm Yetkiler', 
 ARRAY['all', 'tenants.manage', 'users.manage', 'roles.manage', 'questions.manage', 'exams.manage', 'curriculum.manage', 'grading.manage', 'royalty.manage', 'reports.view'], 
 NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true),
('22222222-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Admin', 'Yönetici', 
 ARRAY['users.view', 'questions.view', 'exams.view'], 
 NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true),
('22222222-3333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Teacher', 'Öğretmen', 
 ARRAY['questions.create', 'exams.create'], 
 NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true),
('22222222-4444-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Student', 'Öğrenci', 
 ARRAY['exams.take', 'results.view'], 
 NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true)
ON CONFLICT ("Id") DO NOTHING;

-- ============================================
-- EDUCATION MODELS (Curriculum Schema)
-- ============================================
INSERT INTO curriculum_schema.education_models (
    "Id", "TenantId", "Code", "Name", "Country", 
    "IsActive", "CreatedAt", "UpdatedAt", "CreatedBy"
)
VALUES (
    '44444444-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'TR_MEB', 'MEB Müfredatı', 'Türkiye',
    true, NOW(), NOW(), '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT ("Id") DO NOTHING;

-- ============================================
-- SUBJECTS (Curriculum Schema)
-- ============================================
INSERT INTO curriculum_schema.subjects (
    "Id", "TenantId", "Code", "Name", "DisplayOrder", 
    "CreatedAt", "CreatedBy"
)
VALUES
('55555555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MATH', 'Matematik', 1, NOW(), '00000000-0000-0000-0000-000000000001'),
('55555555-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'PHYS', 'Fizik', 2, NOW(), '00000000-0000-0000-0000-000000000001'),
('55555555-3333-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'CHEM', 'Kimya', 3, NOW(), '00000000-0000-0000-0000-000000000001'),
('55555555-4444-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'BIO', 'Biyoloji', 4, NOW(), '00000000-0000-0000-0000-000000000001'),
('55555555-5555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ENG', 'İngilizce', 5, NOW(), '00000000-0000-0000-0000-000000000001')
ON CONFLICT ("Id") DO NOTHING;

-- ============================================
-- QUESTION FORMAT TYPES (Questions Schema)
-- ============================================
INSERT INTO questions_schema.question_format_types (
    "Id", "Code", "Name", "ConfigSchema"
)
VALUES
('66666666-1111-1111-1111-111111111111', 'multiple_choice', 'Çoktan Seçmeli', '{}'::jsonb),
('66666666-2222-1111-1111-111111111111', 'true_false', 'Doğru-Yanlış', '{}'::jsonb),
('66666666-3333-1111-1111-111111111111', 'matching', 'Eşleştirme', '{}'::jsonb),
('66666666-4444-1111-1111-111111111111', 'gap_fill', 'Boşluk Doldurma', '{}'::jsonb)
ON CONFLICT ("Id") DO NOTHING;

-- ============================================
-- QUESTION PEDAGOGICAL TYPES (Questions Schema)
-- ============================================
INSERT INTO questions_schema.question_pedagogical_types (
    "Id", "Code", "Name"
)
VALUES
('77777777-1111-1111-1111-111111111111', 'comprehension', 'Kavrama'),
('77777777-2222-1111-1111-111111111111', 'application', 'Uygulama'),
('77777777-3333-1111-1111-111111111111', 'analysis', 'Analiz'),
('77777777-4444-1111-1111-111111111111', 'synthesis', 'Sentez')
ON CONFLICT ("Id") DO NOTHING;

\echo '✅ Seed data başarıyla yüklendi!'
\echo ''
\echo '📊 Yüklenen Veriler:'
SELECT 'Roles' as entity, COUNT(*) as count FROM identity_schema.roles
UNION ALL
SELECT 'EducationModels', COUNT(*) FROM curriculum_schema.education_models
UNION ALL
SELECT 'Subjects', COUNT(*) FROM curriculum_schema.subjects
UNION ALL
SELECT 'QuestionFormatTypes', COUNT(*) FROM questions_schema.question_format_types
UNION ALL
SELECT 'QuestionPedagogicalTypes', COUNT(*) FROM questions_schema.question_pedagogical_types;

\echo ''
\echo '👥 Kullanıcılar Identity Service üzerinden oluşturulacak'
\echo '   (Register endpoint ile doğru şifre hash''leme için)'

