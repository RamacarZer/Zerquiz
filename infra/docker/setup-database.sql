-- ============================================
-- Zerquiz Multi-Tenant Platform
-- Database Setup Script
-- ============================================

-- Create database
CREATE DATABASE zerquiz_db
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Connect to the database
\c zerquiz_db

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- Create Schemas
-- ============================================

CREATE SCHEMA IF NOT EXISTS core_schema;
CREATE SCHEMA IF NOT EXISTS identity_schema;
CREATE SCHEMA IF NOT EXISTS curriculum_schema;
CREATE SCHEMA IF NOT EXISTS questions_schema;
CREATE SCHEMA IF NOT EXISTS exams_schema;
CREATE SCHEMA IF NOT EXISTS grading_schema;
CREATE SCHEMA IF NOT EXISTS royalty_schema;

-- ============================================
-- Create Service Users
-- ============================================

CREATE USER zerquiz_core WITH PASSWORD 'core_pass_2024';
CREATE USER zerquiz_identity WITH PASSWORD 'identity_pass_2024';
CREATE USER zerquiz_curriculum WITH PASSWORD 'curriculum_pass_2024';
CREATE USER zerquiz_questions WITH PASSWORD 'questions_pass_2024';
CREATE USER zerquiz_exams WITH PASSWORD 'exams_pass_2024';
CREATE USER zerquiz_grading WITH PASSWORD 'grading_pass_2024';
CREATE USER zerquiz_royalty WITH PASSWORD 'royalty_pass_2024';

-- ============================================
-- Grant Schema Permissions
-- ============================================

-- Core schema
GRANT ALL ON SCHEMA core_schema TO zerquiz_core;
GRANT CREATE ON SCHEMA core_schema TO zerquiz_core;
GRANT USAGE ON SCHEMA core_schema TO zerquiz_identity, zerquiz_curriculum, zerquiz_questions, zerquiz_exams, zerquiz_grading, zerquiz_royalty;

-- Identity schema
GRANT ALL ON SCHEMA identity_schema TO zerquiz_identity;
GRANT CREATE ON SCHEMA identity_schema TO zerquiz_identity;
GRANT USAGE ON SCHEMA identity_schema TO zerquiz_core, zerquiz_questions, zerquiz_exams, zerquiz_grading, zerquiz_royalty;

-- Curriculum schema
GRANT ALL ON SCHEMA curriculum_schema TO zerquiz_curriculum;
GRANT CREATE ON SCHEMA curriculum_schema TO zerquiz_curriculum;
GRANT USAGE ON SCHEMA curriculum_schema TO zerquiz_questions, zerquiz_exams;

-- Questions schema
GRANT ALL ON SCHEMA questions_schema TO zerquiz_questions;
GRANT CREATE ON SCHEMA questions_schema TO zerquiz_questions;
GRANT USAGE ON SCHEMA questions_schema TO zerquiz_exams, zerquiz_grading, zerquiz_royalty;

-- Exams schema
GRANT ALL ON SCHEMA exams_schema TO zerquiz_exams;
GRANT CREATE ON SCHEMA exams_schema TO zerquiz_exams;
GRANT USAGE ON SCHEMA exams_schema TO zerquiz_grading;

-- Grading schema
GRANT ALL ON SCHEMA grading_schema TO zerquiz_grading;
GRANT CREATE ON SCHEMA grading_schema TO zerquiz_grading;
GRANT USAGE ON SCHEMA grading_schema TO zerquiz_exams;

-- Royalty schema
GRANT ALL ON SCHEMA royalty_schema TO zerquiz_royalty;
GRANT CREATE ON SCHEMA royalty_schema TO zerquiz_royalty;
GRANT USAGE ON SCHEMA royalty_schema TO zerquiz_questions;

-- ============================================
-- Grant Database Connection
-- ============================================

GRANT CONNECT ON DATABASE zerquiz_db TO 
    zerquiz_core, 
    zerquiz_identity, 
    zerquiz_curriculum, 
    zerquiz_questions, 
    zerquiz_exams, 
    zerquiz_grading, 
    zerquiz_royalty;

-- ============================================
-- Set Default Privileges for Future Tables
-- ============================================

-- Core schema
ALTER DEFAULT PRIVILEGES IN SCHEMA core_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_core;
ALTER DEFAULT PRIVILEGES IN SCHEMA core_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_core;

-- Identity schema
ALTER DEFAULT PRIVILEGES IN SCHEMA identity_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_identity;
ALTER DEFAULT PRIVILEGES IN SCHEMA identity_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_identity;

-- Curriculum schema
ALTER DEFAULT PRIVILEGES IN SCHEMA curriculum_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_curriculum;
ALTER DEFAULT PRIVILEGES IN SCHEMA curriculum_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_curriculum;

-- Questions schema
ALTER DEFAULT PRIVILEGES IN SCHEMA questions_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_questions;
ALTER DEFAULT PRIVILEGES IN SCHEMA questions_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_questions;

-- Exams schema
ALTER DEFAULT PRIVILEGES IN SCHEMA exams_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_exams;
ALTER DEFAULT PRIVILEGES IN SCHEMA exams_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_exams;

-- Grading schema
ALTER DEFAULT PRIVILEGES IN SCHEMA grading_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_grading;
ALTER DEFAULT PRIVILEGES IN SCHEMA grading_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_grading;

-- Royalty schema
ALTER DEFAULT PRIVILEGES IN SCHEMA royalty_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO zerquiz_royalty;
ALTER DEFAULT PRIVILEGES IN SCHEMA royalty_schema GRANT USAGE, SELECT ON SEQUENCES TO zerquiz_royalty;

\echo 'Database setup completed successfully!'
\echo 'Created database: zerquiz_db'
\echo 'Created schemas: core_schema, identity_schema, curriculum_schema, questions_schema, exams_schema, grading_schema, royalty_schema'
\echo 'Created users with appropriate permissions'

