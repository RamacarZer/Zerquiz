-- =====================================================
-- İÇERİK OLUŞTURMA MODELLERİ
-- Tarih: 2025-12-01
-- Amaç: Manuel (Yazar) vs AI destekli içerik üretimi
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    content_mode_group_id UUID;
BEGIN
    -- Admin user
    SELECT "Id" INTO admin_user_id
    FROM identity_schema.users
    WHERE "Email" = 'admin@zerquiz.com'
    LIMIT 1;

    -- 1. Create definition group for content creation modes
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
    
    -- If group already exists, get it
    IF content_mode_group_id IS NULL THEN
        SELECT "Id" INTO content_mode_group_id
        FROM core_schema.definition_groups
        WHERE "Code" = 'content_creation_mode';
    END IF;

    RAISE NOTICE 'Content creation mode group created: %', content_mode_group_id;

    -- 2. Add content creation modes
    
    -- MANUAL: Traditional authoring by writers/teachers
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
        '{"features": ["full_editor", "rich_formatting", "media_upload", "version_control", "collaboration"], "target_users": ["teachers", "authors", "editors"], "complexity": "medium"}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    );
    
    -- Handle if already exists
    IF NOT FOUND THEN
        RAISE NOTICE 'Definition already exists, skipping';
    END IF;

    -- AI_ASSISTED: AI-powered content generation
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
        '{"features": ["ai_generation", "auto_questions", "smart_suggestions", "bulk_creation", "pdf_extraction"], "target_users": ["teachers", "content_managers"], "complexity": "easy", "requires": ["ai_config"]}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    );
    
    -- Handle if already exists
    IF NOT FOUND THEN
        RAISE NOTICE 'Definition already exists, skipping';
    END IF;

    -- HYBRID: Combination of both (AI draft + manual refinement)
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
        '{"features": ["ai_draft", "manual_edit", "iterative_improvement", "best_of_both"], "target_users": ["power_users", "content_teams"], "complexity": "advanced", "recommended": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    );
    
    -- Handle if already exists
    IF NOT FOUND THEN
        RAISE NOTICE 'Definition already exists, skipping';
    END IF;

    RAISE NOTICE '✅ Content creation modes added!';

    -- 3. Add translations
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
                     WHEN lang.code = 'en' THEN 'Content created by authors, writers, teachers using traditional tools'
                     WHEN lang.code = 'ar' THEN 'المحتوى الذي أنشأه المؤلفون والكتاب والمعلمون باستخدام الأدوات التقليدية'
                END
            WHEN 'ai_assisted' THEN 
                CASE WHEN lang.code = 'tr' THEN 'AI tarafından üretilen veya geliştirilen, insan denetimli içerik'
                     WHEN lang.code = 'en' THEN 'Content generated or enhanced by AI with human review'
                     WHEN lang.code = 'ar' THEN 'المحتوى الذي تم إنشاؤه أو تحسينه بواسطة الذكاء الاصطناعي مع المراجعة البشرية'
                END
            WHEN 'hybrid' THEN 
                CASE WHEN lang.code = 'tr' THEN 'AI taslak oluşturur, insan düzenler ve iyileştirir'
                     WHEN lang.code = 'en' THEN 'AI generates initial draft, then human refines and edits'
                     WHEN lang.code = 'ar' THEN 'ينشئ الذكاء الاصطناعي مسودة أولية، ثم يقوم الإنسان بالتحسين والتحرير'
                END
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."GroupId" = content_mode_group_id
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    RAISE NOTICE '✅ Translations added for content creation modes!';

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
    dt."Value" as translated_name,
    d."Metadata"->>'complexity' as complexity,
    d."Metadata"->>'recommended' as recommended
FROM core_schema.definitions d
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
LEFT JOIN core_schema.definition_translations dt ON dt."DefinitionId" = d."Id"
WHERE dg."Code" = 'content_creation_mode'
ORDER BY d."DisplayOrder", dt."LanguageCode";

