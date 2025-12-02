-- =====================================================
-- İÇERİK OLUŞTURMA MODELLERİ (V2 - Simplified)
-- Tarih: 2025-12-01
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    content_mode_group_id UUID;
    manual_def_id UUID;
    ai_def_id UUID;
    hybrid_def_id UUID;
BEGIN
    -- Get admin user
    SELECT "Id" INTO admin_user_id
    FROM identity_schema.users
    WHERE "Email" = 'admin@zerquiz.com'
    LIMIT 1;

    -- 1. Check if group exists, if not create
    SELECT "Id" INTO content_mode_group_id
    FROM core_schema.definition_groups
    WHERE "Code" = 'content_creation_mode';

    IF content_mode_group_id IS NULL THEN
        INSERT INTO core_schema.definition_groups (
            "Code", "Name", "Description", "ModuleCode",
            "Level", "Path", "IconName", "DisplayOrder",
            "IsSystemReserved", "IsActive", "Scope",
            "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
        )
        VALUES (
            'content_creation_mode',
            'Content Creation Mode',
            'How content is created: Manual (Author) or AI-Assisted',
            'content',
            0,
            '/content_creation_mode/',
            'Edit',
            20,
            true,
            true,
            'global',
            admin_user_id,
            NOW(),
            NOW(),
            1,
            'active'
        )
        RETURNING "Id" INTO content_mode_group_id;
        
        RAISE NOTICE 'Content creation mode group created: %', content_mode_group_id;
    ELSE
        RAISE NOTICE 'Content creation mode group already exists: %', content_mode_group_id;
    END IF;

    -- 2. Add MANUAL mode
    SELECT "Id" INTO manual_def_id
    FROM core_schema.definitions
    WHERE "Code" = 'manual' AND "GroupId" = content_mode_group_id;

    IF manual_def_id IS NULL THEN
        INSERT INTO core_schema.definitions (
            "GroupId", "Code", "Value", "Description",
            "DisplayOrder", "IconName", "ColorCode", "IsSystemReserved", "IsActive", "IsSelectable",
            "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
        ) VALUES (
            content_mode_group_id,
            'manual',
            'Manual Creation',
            'Content created by authors, writers, teachers using traditional tools',
            1, 'Edit', '#2563eb', true, true, true, 'global',
            '{"features": ["full_editor", "rich_formatting", "media_upload", "version_control", "collaboration"]}'::jsonb,
            admin_user_id, NOW(), NOW(), 1, 'active'
        )
        RETURNING "Id" INTO manual_def_id;
        RAISE NOTICE '✅ Manual mode created';
    ELSE
        RAISE NOTICE '⏭️ Manual mode already exists';
    END IF;

    -- 3. Add AI_ASSISTED mode
    SELECT "Id" INTO ai_def_id
    FROM core_schema.definitions
    WHERE "Code" = 'ai_assisted' AND "GroupId" = content_mode_group_id;

    IF ai_def_id IS NULL THEN
        INSERT INTO core_schema.definitions (
            "GroupId", "Code", "Value", "Description",
            "DisplayOrder", "IconName", "ColorCode", "IsSystemReserved", "IsActive", "IsSelectable",
            "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
        ) VALUES (
            content_mode_group_id,
            'ai_assisted',
            'AI Assisted',
            'Content generated or enhanced by AI with human review',
            2, 'Sparkles', '#7c3aed', true, true, true, 'global',
            '{"features": ["ai_generation", "auto_questions", "smart_suggestions", "bulk_creation", "pdf_extraction"]}'::jsonb,
            admin_user_id, NOW(), NOW(), 1, 'active'
        )
        RETURNING "Id" INTO ai_def_id;
        RAISE NOTICE '✅ AI Assisted mode created';
    ELSE
        RAISE NOTICE '⏭️ AI Assisted mode already exists';
    END IF;

    -- 4. Add HYBRID mode
    SELECT "Id" INTO hybrid_def_id
    FROM core_schema.definitions
    WHERE "Code" = 'hybrid' AND "GroupId" = content_mode_group_id;

    IF hybrid_def_id IS NULL THEN
        INSERT INTO core_schema.definitions (
            "GroupId", "Code", "Value", "Description",
            "DisplayOrder", "IconName", "ColorCode", "IsSystemReserved", "IsActive", "IsSelectable",
            "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
        ) VALUES (
            content_mode_group_id,
            'hybrid',
            'Hybrid (AI + Manual)',
            'AI generates initial draft, then human refines and edits',
            3, 'Workflow', '#059669', true, true, true, 'global',
            '{"features": ["ai_draft", "manual_edit", "iterative_improvement", "best_of_both"], "recommended": true}'::jsonb,
            admin_user_id, NOW(), NOW(), 1, 'active'
        )
        RETURNING "Id" INTO hybrid_def_id;
        RAISE NOTICE '✅ Hybrid mode created';
    ELSE
        RAISE NOTICE '⏭️ Hybrid mode already exists';
    END IF;

    -- 5. Add translations (using CROSS JOIN approach)
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE d."Code"
            WHEN 'manual' THEN 
                CASE WHEN lang.code = 'tr' THEN 'Manuel Oluşturma'
                     WHEN lang.code = 'en' THEN 'Manual Creation'
                     WHEN lang.code = 'ar' THEN 'الإنشاء اليدوي'
                END
            WHEN 'ai_assisted' THEN 
                CASE WHEN lang.code = 'tr' THEN 'AI Destekli'
                     WHEN lang.code = 'en' THEN 'AI Assisted'
                     WHEN lang.code = 'ar' THEN 'بمساعدة الذكاء الاصطناعي'
                END
            WHEN 'hybrid' THEN 
                CASE WHEN lang.code = 'tr' THEN 'Hibrit (AI + Manuel)'
                     WHEN lang.code = 'en' THEN 'Hybrid (AI + Manual)'
                     WHEN lang.code = 'ar' THEN 'هجين (الذكاء الاصطناعي + يدوي)'
                END
        END,
        CASE d."Code"
            WHEN 'manual' THEN 
                CASE WHEN lang.code = 'tr' THEN 'Yazarlar, öğretmenler tarafından geleneksel araçlarla oluşturulan içerik'
                     WHEN lang.code = 'en' THEN 'Content created by authors using traditional tools'
                     WHEN lang.code = 'ar' THEN 'المحتوى الذي أنشأه المؤلفون باستخدام الأدوات التقليدية'
                END
            WHEN 'ai_assisted' THEN 
                CASE WHEN lang.code = 'tr' THEN 'AI tarafından üretilen veya geliştirilen, insan denetimli içerik'
                     WHEN lang.code = 'en' THEN 'Content generated by AI with human review'
                     WHEN lang.code = 'ar' THEN 'المحتوى الذي تم إنشاؤه بواسطة الذكاء الاصطناعي مع المراجعة البشرية'
                END
            WHEN 'hybrid' THEN 
                CASE WHEN lang.code = 'tr' THEN 'AI taslak oluşturur, insan düzenler ve iyileştirir'
                     WHEN lang.code = 'en' THEN 'AI generates draft, human refines'
                     WHEN lang.code = 'ar' THEN 'ينشئ الذكاء الاصطناعي مسودة، يقوم الإنسان بالتحسين'
                END
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."GroupId" = content_mode_group_id
      AND NOT EXISTS (
          SELECT 1 FROM core_schema.definition_translations dt
          WHERE dt."DefinitionId" = d."Id" AND dt."LanguageCode" = lang.code
      );

    RAISE NOTICE '✅ Translations added for content creation modes!';
    RAISE NOTICE '🎉 CONTENT CREATION MODES SETUP COMPLETE!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Content creation mode seed failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'Content Creation Modes' as category,
    COUNT(*) as total_modes,
    COUNT(*) FILTER (WHERE d."IsActive" = true) as active_modes
FROM core_schema.definitions d
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'content_creation_mode';

-- Show modes with translations
SELECT 
    d."Code",
    d."Value" as english_name,
    dt."LanguageCode",
    dt."Value" as translated_name
FROM core_schema.definitions d
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
LEFT JOIN core_schema.definition_translations dt ON dt."DefinitionId" = d."Id"
WHERE dg."Code" = 'content_creation_mode'
ORDER BY d."DisplayOrder", dt."LanguageCode";

