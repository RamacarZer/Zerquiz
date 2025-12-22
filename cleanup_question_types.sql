-- =====================================================
-- CLEANUP: Remove all question types before re-seeding
-- Tarih: 2025-12-01
-- =====================================================

DO $$
DECLARE
    question_types_group_id UUID;
    deleted_count INT;
BEGIN
    -- Get question types group ID
    SELECT "Id" INTO question_types_group_id
    FROM core_schema.definition_groups
    WHERE "Code" = 'question_types';

    IF question_types_group_id IS NULL THEN
        RAISE NOTICE 'Question types group not found, nothing to clean.';
        RETURN;
    END IF;

    -- Delete all question type definitions
    DELETE FROM core_schema.definitions
    WHERE "GroupId" = question_types_group_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE '🗑️ Deleted % question type records', deleted_count;
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Cleanup failed: %', SQLERRM;
END $$;

-- Verification
SELECT 
    'question_types' as category,
    COUNT(*) as remaining_count
FROM core_schema.definitions
WHERE "GroupId" = (SELECT "Id" FROM core_schema.definition_groups WHERE "Code" = 'question_types');




