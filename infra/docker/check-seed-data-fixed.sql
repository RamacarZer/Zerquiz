-- Seed data kontrolü (snake_case tablo isimleri)
\c zerquiz_db;

-- User sayısı
SELECT 'Users' as entity, COUNT(*) as count FROM identity_schema.users;

-- Role sayısı
SELECT 'Roles' as entity, COUNT(*) as count FROM identity_schema.roles;

-- Tenant sayısı
SELECT 'Tenants' as entity, COUNT(*) as count FROM core_schema.tenants;

-- Subject sayısı
SELECT 'Subjects' as entity, COUNT(*) as count FROM curriculum_schema.subjects;

-- System Definitions
SELECT 'SystemDefinitions' as entity, COUNT(*) as count FROM core_schema.system_definitions;

-- Question Format Types
SELECT 'QuestionFormatTypes' as entity, COUNT(*) as count FROM questions_schema.question_format_types;

-- Education Models
SELECT 'EducationModels' as entity, COUNT(*) as count FROM curriculum_schema.education_models;

