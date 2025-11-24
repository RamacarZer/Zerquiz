-- ============================================
-- VERİTABANI TEMİZLİK VE YENİDEN OLUŞTURMA
-- ============================================

\c zerquiz_db;

-- ============================================
-- TÜM SCHEMA'LARI VE TABLOLARI TEMİZLE
-- ============================================

-- Identity Schema
DROP SCHEMA IF EXISTS identity_schema CASCADE;
CREATE SCHEMA identity_schema;

-- Core Schema (migration history hariç tutulmalı çünkü Core zaten çalışıyor)
-- Core schema'yı bozmuyoruz, zaten güncel

-- Curriculum Schema
DROP SCHEMA IF EXISTS curriculum_schema CASCADE;
CREATE SCHEMA curriculum_schema;

-- Questions Schema
DROP SCHEMA IF EXISTS questions_schema CASCADE;
CREATE SCHEMA questions_schema;

-- Exams Schema
DROP SCHEMA IF EXISTS exams_schema CASCADE;
CREATE SCHEMA exams_schema;

-- Grading Schema
DROP SCHEMA IF EXISTS grading_schema CASCADE;
CREATE SCHEMA grading_schema;

-- Royalty Schema
DROP SCHEMA IF EXISTS royalty_schema CASCADE;
CREATE SCHEMA royalty_schema;

SELECT '✅ Tüm schema''lar temizlendi ve yeniden oluşturuldu!' AS result;
SELECT 'Core schema korundu (zaten güncel)' AS result;

