-- =====================================================
-- BACKUP: Mevcut Tanım Tablolarının Yedeği
-- Tarih: 2025-12-01
-- Amaç: Yeni yapıya geçmeden önce mevcut verileri koru
-- =====================================================

-- ============================================
-- 1. CURRICULUM SCHEMA - Mevcut Tanımlar
-- ============================================

-- Backup: definition_groups
CREATE TABLE IF NOT EXISTS curriculum_schema.definition_groups_backup_20251201 AS
SELECT * FROM curriculum_schema.definition_groups;

-- Backup: definitions
CREATE TABLE IF NOT EXISTS curriculum_schema.definitions_backup_20251201 AS
SELECT * FROM curriculum_schema.definitions;

-- Backup: definition_translations
CREATE TABLE IF NOT EXISTS curriculum_schema.definition_translations_backup_20251201 AS
SELECT * FROM curriculum_schema.definition_translations;

-- ============================================
-- 2. QUESTIONS SCHEMA - Soru Tipleri
-- ============================================

-- Backup: question_types
CREATE TABLE IF NOT EXISTS questions_schema.question_types_backup_20251201 AS
SELECT * FROM questions_schema.question_types
WHERE "DeletedAt" IS NULL;

-- ============================================
-- 3. CORE SCHEMA - Mevcut Sistem Tanımları (Varsa)
-- ============================================

-- Backup: system_definitions (varsa)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'core_schema' 
        AND table_name = 'system_definitions'
    ) THEN
        CREATE TABLE IF NOT EXISTS core_schema.system_definitions_backup_20251201 AS
        SELECT * FROM core_schema.system_definitions;
    END IF;
END $$;

-- ============================================
-- BACKUP DOĞRULAMA
-- ============================================

SELECT 
    'definition_groups_backup' as backup_table,
    COUNT(*) as record_count
FROM curriculum_schema.definition_groups_backup_20251201

UNION ALL

SELECT 
    'definitions_backup' as backup_table,
    COUNT(*) as record_count
FROM curriculum_schema.definitions_backup_20251201

UNION ALL

SELECT 
    'definition_translations_backup' as backup_table,
    COUNT(*) as record_count
FROM curriculum_schema.definition_translations_backup_20251201

UNION ALL

SELECT 
    'question_types_backup' as backup_table,
    COUNT(*) as record_count
FROM questions_schema.question_types_backup_20251201;

-- ============================================
-- Backup tamamlandı! ✅
-- Şimdi yeni yapıyı oluşturabiliriz.
-- ============================================

