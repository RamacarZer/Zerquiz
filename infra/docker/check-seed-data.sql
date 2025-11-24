-- Seed data kontrolü
\c zerquiz_db;

-- User sayısı
SELECT 'Users' as entity, COUNT(*) as count FROM identity_schema."Users";

-- Role sayısı
SELECT 'Roles' as entity, COUNT(*) as count FROM identity_schema."Roles";

-- Tenant sayısı
SELECT 'Tenants' as entity, COUNT(*) as count FROM core_schema."Tenants";

-- Subject sayısı
SELECT 'Subjects' as entity, COUNT(*) as count FROM curriculum_schema."Subjects";

-- System Definitions
SELECT 'SystemDefinitions' as entity, COUNT(*) as count FROM core_schema.system_definitions;

