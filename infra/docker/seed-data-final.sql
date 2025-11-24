-- Zerquiz Final Seed Data
\c zerquiz_db;

TRUNCATE TABLE identity_schema.roles CASCADE;
TRUNCATE TABLE curriculum_schema.education_models CASCADE;
TRUNCATE TABLE curriculum_schema.subjects CASCADE;
TRUNCATE TABLE questions_schema.question_format_types CASCADE;
TRUNCATE TABLE questions_schema.question_pedagogical_types CASCADE;

-- ROLES (Fixed UUIDs)
INSERT INTO identity_schema.roles 
("Id", "TenantId", "Name", "Description", "Permissions", "CreatedAt", "UpdatedAt", "CreatedBy", "IsActive", "Version")
VALUES
('22222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'SuperAdmin', 'Süper Yönetici', 
 ARRAY['all'], NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true, 1),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Teacher', 'Öğretmen', 
 ARRAY['questions.create'], NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true, 1),
('22222222-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Student', 'Öğrenci', 
 ARRAY['exams.take'], NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true, 1);

-- EDUCATION MODELS
INSERT INTO curriculum_schema.education_models 
("Id", "TenantId", "Code", "Name", "Country", "IsActive", "CreatedAt", "UpdatedAt", "CreatedBy", "Version")
VALUES 
('44444444-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
 'TR_MEB', 'MEB Müfredatı', 'Türkiye', true, NOW(), NOW(), '00000000-0000-0000-0000-000000000001', 1);

-- SUBJECTS
INSERT INTO curriculum_schema.subjects 
("Id", "TenantId", "Code", "Name", "DisplayOrder", "IsActive", "CreatedAt", "UpdatedAt", "CreatedBy", "Version")
VALUES
('55555555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MATH', 'Matematik', 1, true, NOW(), NOW(), '00000000-0000-0000-0000-000000000001', 1),
('55555555-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'PHYS', 'Fizik', 2, true, NOW(), NOW(), '00000000-0000-0000-0000-000000000001', 1),
('55555555-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'CHEM', 'Kimya', 3, true, NOW(), NOW(), '00000000-0000-0000-0000-000000000001', 1);

-- QUESTION FORMAT TYPES
INSERT INTO questions_schema.question_format_types 
("Id", "Code", "Name")
VALUES
('66666666-1111-1111-1111-111111111111', 'multiple_choice', 'Çoktan Seçmeli'),
('66666666-2222-2222-2222-222222222222', 'true_false', 'Doğru-Yanlış');

-- QUESTION PEDAGOGICAL TYPES
INSERT INTO questions_schema.question_pedagogical_types 
("Id", "Code", "Name")
VALUES
('77777777-1111-1111-1111-111111111111', 'comprehension', 'Kavrama'),
('77777777-2222-2222-2222-222222222222', 'application', 'Uygulama');

\echo '✅✅✅ SEED DATA BAŞARIYLA YÜKLENDİ! ✅✅✅'
\echo ''
SELECT 'Roles' as "Veri Türü", COUNT(*)::text as "Adet" FROM identity_schema.roles
UNION ALL SELECT 'Education Models', COUNT(*)::text FROM curriculum_schema.education_models
UNION ALL SELECT 'Subjects', COUNT(*)::text FROM curriculum_schema.subjects
UNION ALL SELECT 'Format Types', COUNT(*)::text FROM questions_schema.question_format_types
UNION ALL SELECT 'Pedagogical Types', COUNT(*)::text FROM questions_schema.question_pedagogical_types;
