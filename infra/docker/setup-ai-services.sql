-- AI Education Platform - Database Setup Script
-- Creates schemas, users, and permissions for new services

-- Create Content Service User and Schema
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'zerquiz_content') THEN
        CREATE USER zerquiz_content WITH PASSWORD 'content_pass_2024';
    END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS content_schema;
GRANT ALL PRIVILEGES ON SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA content_schema TO zerquiz_content;
ALTER DEFAULT PRIVILEGES IN SCHEMA content_schema GRANT ALL ON TABLES TO zerquiz_content;
ALTER DEFAULT PRIVILEGES IN SCHEMA content_schema GRANT ALL ON SEQUENCES TO zerquiz_content;

-- Create Lessons Service User and Schema
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'zerquiz_lessons') THEN
        CREATE USER zerquiz_lessons WITH PASSWORD 'lessons_pass_2024';
    END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS lessons_schema;
GRANT ALL PRIVILEGES ON SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA lessons_schema TO zerquiz_lessons;
ALTER DEFAULT PRIVILEGES IN SCHEMA lessons_schema GRANT ALL ON TABLES TO zerquiz_lessons;
ALTER DEFAULT PRIVILEGES IN SCHEMA lessons_schema GRANT ALL ON SEQUENCES TO zerquiz_lessons;

-- Grant cross-schema read access (for reporting/analytics)
GRANT USAGE ON SCHEMA content_schema TO zerquiz_grading;
GRANT SELECT ON ALL TABLES IN SCHEMA content_schema TO zerquiz_grading;

GRANT USAGE ON SCHEMA lessons_schema TO zerquiz_grading;
GRANT SELECT ON ALL TABLES IN SCHEMA lessons_schema TO zerquiz_grading;

-- Show created schemas
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name LIKE '%schema' 
ORDER BY schema_name;

