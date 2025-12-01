-- =====================================================
-- DATA MİGRATION: Eski Yapıdan Yeni Yapıya
-- Tarih: 2025-12-01
-- =====================================================

-- Admin user ID (migration için)
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT "Id" INTO admin_user_id
    FROM identity_schema.users
    WHERE "Email" = 'admin@zerquiz.com'
    LIMIT 1;

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found!';
    END IF;

    -- ============================================
    -- 1. Migrate Definition Groups
    -- ============================================
    
    INSERT INTO core_schema.definition_groups (
        "Id", "Code", "Name", "Description", "ModuleCode",
        "ParentId", "Level", "Path",
        "IconName", "DisplayOrder",
        "IsSystemReserved", "IsActive",
        "Scope", "TenantId",
        "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    )
    SELECT 
        dg."Id",
        dg."Code",
        dg."Name",
        dg."Description",
        dg."ModuleCode",
        NULL as "ParentId", -- Eski yapıda yok
        0 as "Level",
        '/' || dg."Code" || '/' as "Path",
        dg."IconName",
        dg."DisplayOrder",
        dg."IsSystemReserved",
        CASE WHEN dg."Status" = 'active' THEN true ELSE false END,
        'global' as "Scope",
        NULL as "TenantId",
        admin_user_id,
        dg."CreatedAt",
        dg."UpdatedAt",
        dg."Version",
        dg."Status"
    FROM curriculum_schema.definition_groups_backup_20251201 dg
    WHERE dg."DeletedAt" IS NULL
    ON CONFLICT ("Code", "TenantId") DO NOTHING;

    RAISE NOTICE 'Definition groups migrated!';

    -- ============================================
    -- 2. Migrate Definition Group Translations
    -- ============================================
    
    INSERT INTO core_schema.definition_group_translations (
        "Id", "GroupId", "LanguageCode", "Name", "Description",
        "CreatedAt", "UpdatedAt"
    )
    SELECT 
        gen_random_uuid(),
        dgt."GroupId",
        dgt."LanguageCode",
        dgt."Name",
        dgt."Description",
        dgt."CreatedAt",
        dgt."UpdatedAt"
    FROM curriculum_schema.definition_group_translations_backup_20251201 dgt
    WHERE EXISTS (
        SELECT 1 FROM core_schema.definition_groups
        WHERE "Id" = dgt."GroupId"
    )
    ON CONFLICT ("GroupId", "LanguageCode") DO NOTHING;

    RAISE NOTICE 'Definition group translations migrated!';

    -- ============================================
    -- 3. Migrate Definitions
    -- ============================================
    
    INSERT INTO core_schema.definitions (
        "Id", "GroupId", "Code", "Value", "Description",
        "ParentId", "ChildIds", "Level", "Path",
        "DisplayOrder", "IconName", "ColorCode",
        "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "TenantId",
        "Metadata",
        "CreatedBy", "CreatedAt", "UpdatedAt", "DeletedAt", "Version", "Status"
    )
    SELECT 
        d."Id",
        d."GroupId",
        d."Code",
        d."Value",
        d."Description",
        d."ParentId",
        ARRAY[]::UUID[] as "ChildIds", -- Yeni alan
        CASE 
            WHEN d."ParentId" IS NULL THEN 0 
            ELSE 1 
        END as "Level",
        CASE 
            WHEN d."ParentId" IS NULL THEN '/' || d."Code" || '/'
            ELSE '/' || (SELECT "Code" FROM curriculum_schema.definitions_backup_20251201 WHERE "Id" = d."ParentId") || '/' || d."Code" || '/'
        END as "Path",
        d."DisplayOrder",
        d."IconName",
        d."ColorCode",
        d."IsSystemReserved",
        CASE WHEN d."Status" = 'active' THEN true ELSE false END,
        true as "IsSelectable",
        'global' as "Scope",
        NULL as "TenantId",
        d."Metadata",
        admin_user_id,
        d."CreatedAt",
        d."UpdatedAt",
        d."DeletedAt",
        d."Version",
        d."Status"
    FROM curriculum_schema.definitions_backup_20251201 d
    WHERE d."DeletedAt" IS NULL
        AND EXISTS (
            SELECT 1 FROM core_schema.definition_groups
            WHERE "Id" = d."GroupId"
        )
    ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE 'Definitions migrated!';

    -- ============================================
    -- 4. Update ChildIds (Reverse ParentId)
    -- ============================================
    
    WITH child_aggregates AS (
        SELECT 
            "ParentId",
            array_agg("Id") as child_ids
        FROM core_schema.definitions
        WHERE "ParentId" IS NOT NULL
        GROUP BY "ParentId"
    )
    UPDATE core_schema.definitions d
    SET "ChildIds" = ca.child_ids
    FROM child_aggregates ca
    WHERE d."Id" = ca."ParentId";

    RAISE NOTICE 'ChildIds updated!';

    -- ============================================
    -- 5. Migrate Definition Translations
    -- ============================================
    
    INSERT INTO core_schema.definition_translations (
        "Id", "DefinitionId", "LanguageCode", "Value", "Description",
        "CreatedAt", "UpdatedAt"
    )
    SELECT 
        gen_random_uuid(),
        dt."DefinitionId",
        dt."LanguageCode",
        dt."Value",
        dt."Description",
        dt."CreatedAt",
        dt."UpdatedAt"
    FROM curriculum_schema.definition_translations_backup_20251201 dt
    WHERE EXISTS (
        SELECT 1 FROM core_schema.definitions
        WHERE "Id" = dt."DefinitionId"
    )
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    RAISE NOTICE 'Definition translations migrated!';

    -- ============================================
    -- 6. Migrate Question Types
    -- ============================================
    
    -- Önce "question_types" grubunu ekle
    INSERT INTO core_schema.definition_groups (
        "Code", "Name", "Description", "ModuleCode",
        "Level", "Path", "IconName", "DisplayOrder",
        "IsSystemReserved", "IsActive", "Scope",
        "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    )
    VALUES (
        'question_types',
        'Question Types',
        'All available question types in the system',
        'questions',
        0,
        '/question_types/',
        'HelpCircle',
        10,
        true,
        true,
        'global',
        admin_user_id,
        NOW(),
        NOW(),
        1,
        'active'
    )
    ON CONFLICT ("Code", "TenantId") DO NOTHING;

    -- Soru tiplerini ekle
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName",
        "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata",
        "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    )
    SELECT 
        (SELECT "Id" FROM core_schema.definition_groups WHERE "Code" = 'question_types'),
        qt."Code",
        qt."Name",
        qt."Description",
        qt."DisplayOrder",
        qt."IconName",
        qt."IsSystemReserved",
        qt."IsActive",
        true,
        'global',
        jsonb_build_object(
            'difficulty', qt."DefaultDifficulty",
            'points', qt."DefaultPoints",
            'hasOptions', qt."HasOptions",
            'hasImage', qt."SupportsImage",
            'hasAudio', qt."SupportsAudio",
            'hasVideo', qt."SupportsVideo",
            'hasEquation', qt."SupportsEquation",
            'category', qt."Category"
        ),
        admin_user_id,
        qt."CreatedAt",
        qt."UpdatedAt",
        qt."Version",
        CASE WHEN qt."DeletedAt" IS NULL THEN 'active' ELSE 'deleted' END
    FROM questions_schema.question_types_backup_20251201 qt
    ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE 'Question types migrated!';

    -- ============================================
    -- MİGRATION TAMAMLANDI! ✅
    -- ============================================

    RAISE NOTICE '✅ All data migrated successfully!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'definition_groups' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE "IsActive" = true) as active_records
FROM core_schema.definition_groups

UNION ALL

SELECT 
    'definitions' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE "IsActive" = true) as active_records
FROM core_schema.definitions

UNION ALL

SELECT 
    'definition_translations' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT "LanguageCode") as language_count
FROM core_schema.definition_translations;

