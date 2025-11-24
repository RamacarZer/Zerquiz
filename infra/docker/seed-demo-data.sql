-- ============================================
-- ZERQUIZ DEMO DATA SEED SCRIPT
-- Bu script idempotent - tekrar çalıştırılabilir
-- ============================================

-- ============================================
-- 1. CORE SCHEMA - TENANTS
-- ============================================

INSERT INTO core_schema.tenants (id, name, slug, company_name, is_active, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Demo School', 'demo', 'Demo Eğitim Kurumları A.Ş.', true, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Test Academy', 'test-academy', 'Test Akademi Ltd.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CORE SCHEMA - LICENSE PACKAGES
-- ============================================

INSERT INTO core_schema.license_packages (
    id, tenant_id, code, name, description, 
    monthly_price, yearly_price, currency,
    max_users, max_students, max_questions, max_exams, max_storage,
    features_json, display_order,
    is_active, created_at, updated_at
)
VALUES 
    (
        '10000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'STARTER',
        'Başlangıç Paketi',
        'Küçük eğitim kurumları için ideal paket',
        299.99, 2999.99, 'TRY',
        10, 100, 500, 50, 1024,
        '["question_bank", "exam_creator", "basic_analytics"]'::jsonb,
        1,
        true, NOW(), NOW()
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111111',
        'PRO',
        'Profesyonel Paket',
        'Orta ölçekli kurumlar için gelişmiş özellikler',
        999.99, 9999.99, 'TRY',
        50, 500, 5000, 500, 10240,
        '["question_bank", "exam_creator", "advanced_analytics", "grading", "certificates"]'::jsonb,
        2,
        true, NOW(), NOW()
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-111111111111',
        'ENTERPRISE',
        'Kurumsal Paket',
        'Sınırsız kullanım ve premium destek',
        2999.99, 29999.99, 'TRY',
        -1, -1, -1, -1, -1,
        '["question_bank", "exam_creator", "advanced_analytics", "grading", "certificates", "api_access", "white_label", "premium_support"]'::jsonb,
        3,
        true, NOW(), NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. CORE SCHEMA - SYSTEM FEATURES
-- ============================================

INSERT INTO core_schema.system_features (id, tenant_id, code, name, description, is_active, created_at, updated_at)
VALUES 
    ('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'question_bank', 'Soru Bankası', 'Soru oluşturma ve yönetimi', true, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'exam_creator', 'Sınav Oluşturucu', 'Sınav hazırlama sistemi', true, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'basic_analytics', 'Temel Analitik', 'Temel raporlama', true, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'advanced_analytics', 'Gelişmiş Analitik', 'Detaylı raporlama ve analizler', true, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'grading', 'Otomatik Değerlendirme', 'Sınav değerlendirme sistemi', true, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'certificates', 'Sertifikalar', 'Dijital sertifika oluşturma', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. IDENTITY SCHEMA - ROLES
-- ============================================

INSERT INTO identity_schema.roles (id, tenant_id, name, description, permissions, is_active, created_at, updated_at)
VALUES 
    ('30000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'SuperAdmin', 'Sistem yöneticisi - Tüm yetkiler', ARRAY['*'], true, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Admin', 'Kurum yöneticisi', ARRAY['users.manage', 'exams.manage', 'reports.view'], true, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Teacher', 'Öğretmen', ARRAY['questions.create', 'exams.create', 'students.view'], true, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Student', 'Öğrenci', ARRAY['exams.take', 'results.view'], true, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Author', 'Soru Yazarı', ARRAY['questions.create', 'questions.edit'], true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. IDENTITY SCHEMA - DEPARTMENTS
-- ============================================

INSERT INTO identity_schema.departments (id, tenant_id, code, name, description, is_active, created_at, updated_at)
VALUES 
    ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'MATH', 'Matematik Bölümü', 'Matematik öğretmenleri', true, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'PHYSICS', 'Fizik Bölümü', 'Fizik öğretmenleri', true, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'CHEMISTRY', 'Kimya Bölümü', 'Kimya öğretmenleri', true, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'BIOLOGY', 'Biyoloji Bölümü', 'Biyoloji öğretmenleri', true, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'TURKISH', 'Türkçe Bölümü', 'Türkçe öğretmenleri', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. IDENTITY SCHEMA - POSITIONS
-- ============================================

INSERT INTO identity_schema.positions (id, tenant_id, code, name, description, level, is_active, created_at, updated_at)
VALUES 
    ('50000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'MANAGER', 'Müdür', 'Genel müdür', 1, true, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'ASST_MANAGER', 'Müdür Yardımcısı', 'Müdür yardımcısı', 2, true, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'DEPT_HEAD', 'Zümre Başkanı', 'Bölüm başkanı', 3, true, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'TEACHER', 'Öğretmen', 'Öğretmen', 4, true, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'STUDENT', 'Öğrenci', 'Öğrenci', 5, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. IDENTITY SCHEMA - USERS (password: Admin123!)
-- ============================================

-- Admin user
INSERT INTO identity_schema.users (
    id, tenant_id, email, password_hash, 
    first_name, last_name, phone,
    primary_role_id, department_id, position_id,
    is_active, email_confirmed, created_at, updated_at
)
VALUES 
    (
        '60000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'admin@demo.com',
        '$2a$11$8ZYQ5YqN5ZqN5ZqN5ZqN5.OqN5ZqN5ZqN5ZqN5ZqN5ZqN5ZqN5Zq',
        'Admin', 'User', '+905551234567',
        '30000000-0000-0000-0000-000000000001',
        NULL,
        '50000000-0000-0000-0000-000000000001',
        true, true, NOW(), NOW()
    ),
    (
        '60000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111111',
        'teacher@demo.com',
        '$2a$11$8ZYQ5YqN5ZqN5ZqN5ZqN5.OqN5ZqN5ZqN5ZqN5ZqN5ZqN5ZqN5Zq',
        'Ahmet', 'Yılmaz', '+905551234568',
        '30000000-0000-0000-0000-000000000003',
        '40000000-0000-0000-0000-000000000001',
        '50000000-0000-0000-0000-000000000004',
        true, true, NOW(), NOW()
    ),
    (
        '60000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-111111111111',
        'student@demo.com',
        '$2a$11$8ZYQ5YqN5ZqN5ZqN5ZqN5.OqN5ZqN5ZqN5ZqN5ZqN5ZqN5ZqN5Zq',
        'Ayşe', 'Demir', '+905551234569',
        '30000000-0000-0000-0000-000000000004',
        NULL,
        '50000000-0000-0000-0000-000000000005',
        true, true, NOW(), NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. CURRICULUM SCHEMA - EDUCATION MODELS
-- ============================================

INSERT INTO curriculum_schema.education_models (id, tenant_id, code, name, country, description, is_active, created_at, updated_at)
VALUES 
    ('70000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'TR_MEB', 'MEB Müfredatı', 'Türkiye', 'T.C. Milli Eğitim Bakanlığı Müfredatı', true, NOW(), NOW()),
    ('70000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'TR_YKS', 'YKS Müfredatı', 'Türkiye', 'Yükseköğretim Kurumları Sınavı', true, NOW(), NOW()),
    ('70000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'CAMBRIDGE_IGCSE', 'Cambridge IGCSE', 'International', 'Cambridge International General Certificate of Secondary Education', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. CURRICULUM SCHEMA - CURRICULA
-- ============================================

INSERT INTO curriculum_schema.curricula (id, tenant_id, education_model_id, name, year, term, version, is_active, created_at, updated_at)
VALUES 
    ('71000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '70000000-0000-0000-0000-000000000001', 'MEB 2024-2025 Güz', 2024, 'Fall', '1.0', true, NOW(), NOW()),
    ('71000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '70000000-0000-0000-0000-000000000002', 'YKS 2024-2025', 2024, 'Annual', '1.0', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. CURRICULUM SCHEMA - SUBJECTS
-- ============================================

INSERT INTO curriculum_schema.subjects (id, tenant_id, code, name, display_order, is_active, created_at, updated_at)
VALUES 
    ('80000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'MATH', 'Matematik', 1, true, NOW(), NOW()),
    ('80000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'PHYSICS', 'Fizik', 2, true, NOW(), NOW()),
    ('80000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'CHEMISTRY', 'Kimya', 3, true, NOW(), NOW()),
    ('80000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'BIOLOGY', 'Biyoloji', 4, true, NOW(), NOW()),
    ('80000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'TURKISH', 'Türkçe', 5, true, NOW(), NOW()),
    ('80000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'ENGLISH', 'İngilizce', 6, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. CURRICULUM SCHEMA - TOPICS (Hierarchical)
-- ============================================

-- Matematik Ana Konular
INSERT INTO curriculum_schema.topics (id, tenant_id, subject_id, parent_topic_id, code, name, level, display_order, created_at, updated_at)
VALUES 
    ('90000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', NULL, '01', 'Sayılar ve İşlemler', 1, 1, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', NULL, '02', 'Cebir', 1, 2, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', NULL, '03', 'Geometri', 1, 3, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Matematik Alt Konular
INSERT INTO curriculum_schema.topics (id, tenant_id, subject_id, parent_topic_id, code, name, level, display_order, created_at, updated_at)
VALUES 
    ('90000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '01.01', 'Doğal Sayılar', 2, 1, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '01.02', 'Tam Sayılar', 2, 2, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000002', '02.01', 'Denklemler', 2, 1, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000002', '02.02', 'Eşitsizlikler', 2, 2, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fizik Ana Konular
INSERT INTO curriculum_schema.topics (id, tenant_id, subject_id, parent_topic_id, code, name, level, display_order, created_at, updated_at)
VALUES 
    ('90000000-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000002', NULL, '01', 'Fizik Bilimine Giriş', 1, 1, NOW(), NOW()),
    ('90000000-0000-0000-0000-000000000102', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000002', NULL, '02', 'Hareket ve Kuvvet', 1, 2, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. CURRICULUM SCHEMA - LEARNING OUTCOMES
-- ============================================

INSERT INTO curriculum_schema.learning_outcomes (
    id, tenant_id, curriculum_id, subject_id, topic_id,
    code, description, details, created_at, updated_at
)
VALUES 
    (
        'A0000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        '71000000-0000-0000-0000-000000000001',
        '80000000-0000-0000-0000-000000000001',
        '90000000-0000-0000-0000-000000000011',
        'MATH.09.NS.01',
        'Öğrenci, doğal sayıları tanır ve işlemler yapar.',
        'Doğal sayıların tanımı, özellikleri ve dört işlem',
        NOW(), NOW()
    ),
    (
        'A0000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111111',
        '71000000-0000-0000-0000-000000000001',
        '80000000-0000-0000-0000-000000000001',
        '90000000-0000-0000-0000-000000000012',
        'MATH.09.IS.01',
        'Öğrenci, tam sayıları tanır ve işlemler yapar.',
        'Tam sayıların tanımı, özellikleri ve işlemler',
        NOW(), NOW()
    ),
    (
        'A0000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-111111111111',
        '71000000-0000-0000-0000-000000000001',
        '80000000-0000-0000-0000-000000000001',
        '90000000-0000-0000-0000-000000000013',
        'MATH.09.EQ.01',
        'Öğrenci, birinci dereceden bir bilinmeyenli denklemleri çözer.',
        'Denklem kurma ve çözme teknikleri',
        NOW(), NOW()
    ),
    (
        'A0000000-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-111111111111',
        '71000000-0000-0000-0000-000000000001',
        '80000000-0000-0000-0000-000000000002',
        '90000000-0000-0000-0000-000000000101',
        'PHYS.09.INT.01',
        'Öğrenci, fiziğin doğa bilimlerindeki yerini açıklar.',
        'Fizik biliminin tanımı ve önemi',
        NOW(), NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUMMARY
-- ============================================
SELECT 'Demo data seeding completed!' as status;
SELECT 'Tenants: ' || COUNT(*) FROM core_schema.tenants;
SELECT 'License Packages: ' || COUNT(*) FROM core_schema.license_packages;
SELECT 'Roles: ' || COUNT(*) FROM identity_schema.roles;
SELECT 'Users: ' || COUNT(*) FROM identity_schema.users;
SELECT 'Education Models: ' || COUNT(*) FROM curriculum_schema.education_models;
SELECT 'Subjects: ' || COUNT(*) FROM curriculum_schema.subjects;
SELECT 'Topics: ' || COUNT(*) FROM curriculum_schema.topics;
SELECT 'Learning Outcomes: ' || COUNT(*) FROM curriculum_schema.learning_outcomes;

