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

-- Backup: definition_translations (varsa)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'curriculum_schema' 
        AND table_name = 'definition_translations'
    ) THEN
        CREATE TABLE IF NOT EXISTS curriculum_schema.definition_translations_backup_20251201 AS
        SELECT * FROM curriculum_schema.definition_translations;
        
        RAISE NOTICE 'Definition translations backed up!';
    ELSE
        RAISE NOTICE 'Definition translations table does not exist, skipping backup.';
    END IF;
END $$;

-- ============================================
-- 2. QUESTIONS SCHEMA - Soru Tipleri
-- ============================================

-- Backup: question_types (varsa)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'questions_schema' 
        AND table_name = 'question_types'
    ) THEN
        CREATE TABLE IF NOT EXISTS questions_schema.question_types_backup_20251201 AS
        SELECT * FROM questions_schema.question_types
        WHERE "DeletedAt" IS NULL;
        
        RAISE NOTICE 'Question types backed up!';
    ELSE
        RAISE NOTICE 'Question types table does not exist, skipping backup.';
    END IF;
END $$;

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

DO $$
BEGIN
    RAISE NOTICE '=== BACKUP VERIFICATION ===';
    
    RAISE NOTICE 'definition_groups_backup: % records', 
        (SELECT COUNT(*) FROM curriculum_schema.definition_groups_backup_20251201);
    
    RAISE NOTICE 'definitions_backup: % records', 
        (SELECT COUNT(*) FROM curriculum_schema.definitions_backup_20251201);
    
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'curriculum_schema' 
        AND table_name = 'definition_translations_backup_20251201'
    ) THEN
        RAISE NOTICE 'definition_translations_backup: % records', 
            (SELECT COUNT(*) FROM curriculum_schema.definition_translations_backup_20251201);
    ELSE
        RAISE NOTICE 'definition_translations_backup: 0 records (table not found)';
    END IF;
    
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'questions_schema' 
        AND table_name = 'question_types_backup_20251201'
    ) THEN
        RAISE NOTICE 'question_types_backup: % records', 
            (SELECT COUNT(*) FROM questions_schema.question_types_backup_20251201);
    ELSE
        RAISE NOTICE 'question_types_backup: 0 records (table not found)';
    END IF;
    
    RAISE NOTICE '=== BACKUP COMPLETED SUCCESSFULLY ===';
END $$;

-- ============================================
-- Backup tamamlandı! ✅
-- Şimdi yeni yapıyı oluşturabiliriz.
-- ============================================

