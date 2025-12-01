-- =============================================
-- Zerquiz AI Platform - Database Setup
-- New Services: Content, Lessons
-- =============================================

-- Connect to main database
\c zerquiz_db;

-- =============================================
-- 1. CONTENT SERVICE SETUP
-- =============================================

-- Create role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'zerquiz_content') THEN
    CREATE ROLE zerquiz_content WITH LOGIN PASSWORD 'content_pass_2024';
  END IF;
END
$$;

-- Create schema
CREATE SCHEMA IF NOT EXISTS content_schema;

-- Grant permissions
GRANT USAGE ON SCHEMA content_schema TO zerquiz_content;
GRANT CREATE ON SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA content_schema TO zerquiz_content;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA content_schema 
  GRANT ALL ON TABLES TO zerquiz_content;
ALTER DEFAULT PRIVILEGES IN SCHEMA content_schema 
  GRANT ALL ON SEQUENCES TO zerquiz_content;

-- =============================================
-- 2. LESSONS SERVICE SETUP
-- =============================================

-- Create role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'zerquiz_lessons') THEN
    CREATE ROLE zerquiz_lessons WITH LOGIN PASSWORD 'lessons_pass_2024';
  END IF;
END
$$;

-- Create schema
CREATE SCHEMA IF NOT EXISTS lessons_schema;

-- Grant permissions
GRANT USAGE ON SCHEMA lessons_schema TO zerquiz_lessons;
GRANT CREATE ON SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA lessons_schema TO zerquiz_lessons;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA lessons_schema 
  GRANT ALL ON TABLES TO zerquiz_lessons;
ALTER DEFAULT PRIVILEGES IN SCHEMA lessons_schema 
  GRANT ALL ON SEQUENCES TO zerquiz_lessons;

-- =============================================
-- 3. UPDATE CORE SCHEMA FOR AI DEFINITIONS
-- =============================================

-- Switch to core schema
SET search_path TO core_schema;

-- Add new definition groups if not exists
INSERT INTO "DefinitionGroups" ("Id", "TenantId", "Code", "Name", "NameTr", "NameEn", "Description", "Icon", "DisplayOrder", "IsSystemReserved", "IsActive", "CreatedAt", "UpdatedAt")
SELECT 
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111'::uuid,
    code,
    name_en,
    name_tr,
    name_en,
    description,
    icon,
    display_order,
    true,
    true,
    NOW(),
    NOW()
FROM (VALUES
    ('ai_generation_type', 'AI Generation Types', 'AI İçerik Türleri', 'AI-powered content generation types', '🤖', 100),
    ('lesson_template_type', 'Lesson Template Types', 'Ders Planı Şablon Türleri', 'Predefined lesson plan templates', '📚', 101),
    ('assignment_type', 'Assignment Types', 'Ödev Türleri', 'Types of assignments and tasks', '📝', 102),
    ('learning_style', 'Learning Styles', 'Öğrenme Stilleri', 'Student learning style preferences', '🧠', 103),
    ('analysis_type', 'Analysis Types', 'Analiz Türleri', 'Types of AI-powered analysis', '📊', 104),
    ('ai_provider', 'AI Providers', 'AI Sağlayıcılar', 'Supported AI service providers', '⚡', 105),
    ('generation_status', 'Generation Status', 'Üretim Durumu', 'AI generation job statuses', '📈', 106)
) AS t(code, name_en, name_tr, description, icon, display_order)
ON CONFLICT (code) WHERE "IsSystemReserved" = true DO NOTHING;

-- =============================================
-- 4. ENABLE REQUIRED EXTENSIONS
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 5. PRINT SETUP SUMMARY
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Content Service: Schema and role created';
  RAISE NOTICE '✅ Lessons Service: Schema and role created';
  RAISE NOTICE '✅ Core definitions: AI-related groups added';
  RAISE NOTICE '✅ Setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '🔹 Content Service: Port 5008, Connection String: Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_content;Password=content_pass_2024;Search Path=content_schema';
  RAISE NOTICE '🔹 Lessons Service: Port 5009, Connection String: Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_lessons;Password=lessons_pass_2024;Search Path=lessons_schema';
END
$$;

