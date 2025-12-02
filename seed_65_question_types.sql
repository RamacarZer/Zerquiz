-- =====================================================
-- 65 SORU TİPİ SEED DATA
-- Tarih: 2025-12-01
-- Amaç: Tüm soru tiplerini core_schema.definitions'a ekle
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    question_types_group_id UUID;
BEGIN
    -- Admin user
    SELECT "Id" INTO admin_user_id
    FROM identity_schema.users
    WHERE "Email" = 'admin@zerquiz.com'
    LIMIT 1;

    -- Question types group ID
    SELECT "Id" INTO question_types_group_id
    FROM core_schema.definition_groups
    WHERE "Code" = 'question_types';

    -- Eğer grup yoksa oluştur
    IF question_types_group_id IS NULL THEN
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
        RETURNING "Id" INTO question_types_group_id;
        
        RAISE NOTICE 'Question types group created!';
    END IF;

    -- ============================================
    -- KATEGORI 1: KLASİK TEST SORULARI (1-12)
    -- ============================================

    -- 1. Çoktan Seçmeli (Tek Doğru)
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'multiple_choice_single',
        'Multiple Choice (Single Answer)',
        'Traditional multiple choice with one correct answer',
        1, 'CheckCircle', true, true, true, 'global',
        '{"category": "classic", "difficulty": "easy", "hasOptions": true, "minOptions": 2, "maxOptions": 6}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 2. Çoktan Seçmeli (Çoklu Doğru)
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'multiple_choice_multiple',
        'Multiple Choice (Multiple Answers)',
        'Multiple correct answers can be selected',
        2, 'CheckSquare', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": true, "minOptions": 3, "maxOptions": 8}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 3. Doğru/Yanlış
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'true_false',
        'True/False',
        'Simple true or false question',
        3, 'ToggleLeft', true, true, true, 'global',
        '{"category": "classic", "difficulty": "easy", "hasOptions": true, "minOptions": 2, "maxOptions": 2}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 4. Kısa Cevap
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'short_answer',
        'Short Answer',
        'Brief text response (1-2 sentences)',
        4, 'Type', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": false, "maxLength": 200}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 5. Uzun Cevap/Essay
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'essay',
        'Essay/Long Answer',
        'Extended written response',
        5, 'FileText', true, true, true, 'global',
        '{"category": "classic", "difficulty": "hard", "hasOptions": false, "maxLength": 5000}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 6. Boşluk Doldurma
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'fill_blank',
        'Fill in the Blank',
        'Complete the sentence with missing words',
        6, 'Minus', true, true, true, 'global',
        '{"category": "classic", "difficulty": "easy", "hasOptions": false, "allowMultipleBlanks": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 7. Açık Uçlu
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'open_ended',
        'Open Ended',
        'Free-form response without specific answer',
        7, 'MessageSquare', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": false}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 8. Sayısal Cevap
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'numeric_input',
        'Numeric Input',
        'Answer must be a number',
        8, 'Hash', true, true, true, 'global',
        '{"category": "classic", "difficulty": "easy", "hasOptions": false, "allowDecimal": true, "allowRange": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 9. Sıralama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'ordering_sequence',
        'Ordering/Sequence',
        'Put items in correct order',
        9, 'ArrowUpDown', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": true, "minItems": 3, "maxItems": 10}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 10. Eşleştirme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'matching_pairs',
        'Matching Pairs',
        'Match items from two lists',
        10, 'Link', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": true, "minPairs": 3, "maxPairs": 8}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 11. Tablo Eşleştirme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'table_matching',
        'Table Matching',
        'Match items in table format',
        11, 'Table', true, true, true, 'global',
        '{"category": "classic", "difficulty": "medium", "hasOptions": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 12. Matrix/Kıyaslama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'matrix_type',
        'Matrix/Grid',
        'Multiple questions in matrix format',
        12, 'Grid', true, true, true, 'global',
        '{"category": "classic", "difficulty": "hard", "hasOptions": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Classic question types (1-12) added!';

    -- ============================================
    -- KATEGORI 2: İLERİ ETKİLEŞİMLİ (13-22)
    -- ============================================

    -- 13. Sürükle-Bırak Metin
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'drag_drop_text',
        'Drag & Drop (Text)',
        'Drag text items to correct positions',
        13, 'Move', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 14. Sürükle-Bırak Görsel
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'drag_drop_image',
        'Drag & Drop (Image)',
        'Drag images to correct positions',
        14, 'Image', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 15. Hotspot (Tek Nokta)
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'hotspot',
        'Hotspot (Single Point)',
        'Click on correct area in image',
        15, 'MapPin', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": false, "requiresInteraction": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 16. Multi-Hotspot (Çoklu Nokta)
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'multi_hotspot',
        'Multi Hotspot',
        'Click on multiple correct areas',
        16, 'MousePointer', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 17. Etiketleme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'image_labeling',
        'Image Labeling',
        'Label parts of an image',
        17, 'Tag', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 18. Harita Nokta Seçme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'map_point_select',
        'Map Point Selection',
        'Select location on map',
        18, 'Map', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": false, "requiresInteraction": true, "supportsMap": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 19. Alan Seçme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'area_selection',
        'Area Selection',
        'Select specific area/region',
        19, 'Square', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": false, "requiresInteraction": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 20. Simülasyon Tabanlı
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'simulation_based',
        'Simulation Based',
        'Interactive simulation scenario',
        20, 'Cpu', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsSimulation": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 21. 3D Model İşaretleme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        '3d_model_marking',
        '3D Model Marking',
        'Mark points on 3D model',
        21, 'Box', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supports3D": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 22. Kategori Ayırma
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'sorting_categories',
        'Sorting/Categorization',
        'Sort items into categories',
        22, 'FolderTree', true, true, true, 'global',
        '{"category": "interactive", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Interactive question types (13-22) added!';

    -- ============================================
    -- KATEGORI 3: MEDYA TABANLI (23-30)
    -- ============================================

    -- 23. Video Tabanlı Soru
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'video_prompt',
        'Video Based Question',
        'Question with video content',
        23, 'Video', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsVideo": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 24. Ses Dinleme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'audio_response',
        'Audio Listening',
        'Listen to audio and answer',
        24, 'Headphones', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsAudio": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 25. Konuşarak Cevap
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'speech_oral_exam',
        'Speech/Oral Exam',
        'Record spoken answer',
        25, 'Mic', true, true, true, 'global',
        '{"category": "media", "difficulty": "hard", "hasOptions": false, "requiresMicrophone": true, "supportsAudio": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 26. Resim Tabanlı
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'image_prompt',
        'Image Based Question',
        'Question with image content',
        26, 'Image', true, true, true, 'global',
        '{"category": "media", "difficulty": "easy", "hasOptions": true, "supportsImage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 27. GIF/Animasyon
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'gif_animation',
        'GIF/Animation',
        'Question with animated content',
        27, 'Film', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsAnimation": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 28. PDF Doküman
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'pdf_document',
        'PDF Document',
        'Question based on PDF document',
        28, 'FileText', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsPDF": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 29. Chart/Grafik
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'chart_graph',
        'Chart/Graph Analysis',
        'Interpret charts and graphs',
        29, 'BarChart', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsChart": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 30. Tablo Analizi
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'table_data',
        'Table Data Analysis',
        'Analyze data in table format',
        30, 'Table', true, true, true, 'global',
        '{"category": "media", "difficulty": "medium", "hasOptions": true, "supportsTable": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Media-based question types (23-30) added!';

    -- ============================================
    -- KATEGORI 4: MATEMATİK & BİLİM (31-40)
    -- ============================================

    -- 31. Matematiksel İfade
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'mathematical_expression',
        'Mathematical Expression',
        'Enter mathematical formula or equation',
        31, 'Calculator', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": false, "supportsMath": true, "supportsLatex": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 32. Grafik Çizimi
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'graph_drawing',
        'Graph Drawing',
        'Draw function graph or plot',
        32, 'TrendingUp', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsGraph": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 33. Geometrik Şekil
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'geometric_shape',
        'Geometric Shape',
        'Draw or manipulate geometric shapes',
        33, 'Triangle', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "medium", "hasOptions": false, "requiresInteraction": true, "supportsGeometry": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 34. Kimyasal Formül
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'chemical_formula',
        'Chemical Formula',
        'Enter or build chemical formula',
        34, 'Beaker', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": false, "supportsChemistry": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 35. Lab Simülasyonu
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'lab_simulation',
        'Lab Simulation',
        'Virtual laboratory experiment',
        35, 'Flask', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsSimulation": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 36. Bilimsel Diyagram
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'scientific_diagram',
        'Scientific Diagram',
        'Label or interpret scientific diagram',
        36, 'GitBranch', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "medium", "hasOptions": true, "supportsImage": true, "supportsDiagram": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 37. Veri Analizi
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'data_analysis',
        'Data Analysis',
        'Analyze dataset and draw conclusions',
        37, 'Database', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": true, "supportsTable": true, "supportsChart": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 38. Zaman Çizelgesi
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'timeline',
        'Timeline',
        'Arrange events on timeline',
        38, 'Calendar', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true, "supportsTimeline": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 39. Akış Şeması
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'flowchart',
        'Flowchart',
        'Complete or interpret flowchart',
        39, 'GitMerge', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "medium", "hasOptions": true, "supportsDiagram": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 40. Konsept Haritası
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'concept_map',
        'Concept Map',
        'Build or complete concept map',
        40, 'Network', true, true, true, 'global',
        '{"category": "math_science", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsDiagram": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Math & Science question types (31-40) added!';

    -- ============================================
    -- KATEGORI 5: DİL & İLETİŞİM (41-50)
    -- ============================================

    -- 41. Kelime Tamamlama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'word_completion',
        'Word Completion',
        'Complete missing letters in word',
        41, 'Type', true, true, true, 'global',
        '{"category": "language", "difficulty": "easy", "hasOptions": false, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 42. Cümle Düzeltme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'sentence_correction',
        'Sentence Correction',
        'Identify and fix grammar errors',
        42, 'AlertCircle', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 43. Paragraf Sıralama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'paragraph_ordering',
        'Paragraph Ordering',
        'Arrange paragraphs in correct order',
        43, 'List', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 44. Kelime Eşleştirme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'vocabulary_matching',
        'Vocabulary Matching',
        'Match words with definitions',
        44, 'BookOpen', true, true, true, 'global',
        '{"category": "language", "difficulty": "easy", "hasOptions": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 45. Çeviri
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'translation',
        'Translation',
        'Translate text to another language',
        45, 'Languages', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": false, "supportsLanguage": true, "supportsMultiLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 46. Okuduğunu Anlama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'reading_comprehension',
        'Reading Comprehension',
        'Questions based on reading passage',
        46, 'BookMarked', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": true, "supportsLanguage": true, "hasPassage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 47. Yazım Kontrolü
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'spelling_check',
        'Spelling Check',
        'Identify misspelled words',
        47, 'Spellcheck', true, true, true, 'global',
        '{"category": "language", "difficulty": "easy", "hasOptions": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 48. Noktalama İşaretleri
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'punctuation',
        'Punctuation',
        'Add or correct punctuation marks',
        48, 'Edit3', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 49. Eş Anlamlı/Zıt Anlamlı
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'synonyms_antonyms',
        'Synonyms/Antonyms',
        'Find synonyms or antonyms',
        49, 'RefreshCw', true, true, true, 'global',
        '{"category": "language", "difficulty": "easy", "hasOptions": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 50. Kelime Oyunu
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'word_puzzle',
        'Word Puzzle',
        'Crossword, word search, anagram',
        50, 'Puzzle', true, true, true, 'global',
        '{"category": "language", "difficulty": "medium", "hasOptions": false, "requiresInteraction": true, "supportsLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Language & Communication question types (41-50) added!';

    -- ============================================
    -- KATEGORI 6: DEĞERLENDİRME & ANALİZ (51-60)
    -- ============================================

    -- 51. Kıyaslama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'comparison',
        'Comparison',
        'Compare and contrast items',
        51, 'GitCompare', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "medium", "hasOptions": false}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 52. Sınıflandırma
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'classification',
        'Classification',
        'Classify items into groups',
        52, 'FolderTree', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "medium", "hasOptions": true, "requiresInteraction": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 53. Neden-Sonuç
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'cause_effect',
        'Cause and Effect',
        'Identify cause-effect relationships',
        53, 'Zap', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "medium", "hasOptions": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 54. Problem Çözme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'problem_solving',
        'Problem Solving',
        'Multi-step problem solving',
        54, 'Target', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "hard", "hasOptions": false, "requiresSteps": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 55. Eleştirel Düşünme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'critical_thinking',
        'Critical Thinking',
        'Analyze argument or evidence',
        55, 'Brain', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "hard", "hasOptions": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 56. Öz Değerlendirme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'self_assessment',
        'Self Assessment',
        'Reflect on own understanding',
        56, 'UserCheck', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "easy", "hasOptions": true, "isReflective": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 57. Akran Değerlendirme
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'peer_review',
        'Peer Review',
        'Evaluate peer work',
        57, 'Users', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "medium", "hasOptions": false, "isCollaborative": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 58. Rubrik Bazlı
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'rubric_based',
        'Rubric Based',
        'Assessed using rubric criteria',
        58, 'ClipboardCheck', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "medium", "hasOptions": false, "hasRubric": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 59. Portfolio
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'portfolio',
        'Portfolio',
        'Collection of work over time',
        59, 'Briefcase', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "hard", "hasOptions": false, "isLongTerm": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 60. Performans Görevi
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'performance_task',
        'Performance Task',
        'Demonstrate skill through task',
        60, 'Award', true, true, true, 'global',
        '{"category": "evaluation", "difficulty": "hard", "hasOptions": false, "isPerformance": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Evaluation & Analysis question types (51-60) added!';

    -- ============================================
    -- KATEGORI 7: ÖZEL FORMAT (61-65)
    -- ============================================

    -- 61. QR Kod
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'qr_code',
        'QR Code',
        'Scan QR code for question',
        61, 'QrCode', true, true, true, 'global',
        '{"category": "special", "difficulty": "easy", "hasOptions": true, "supportsQR": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 62. Gamified
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'gamified',
        'Gamified Question',
        'Question in game format',
        62, 'Gamepad2', true, true, true, 'global',
        '{"category": "special", "difficulty": "medium", "hasOptions": true, "isGamified": true, "requiresInteraction": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 63. Adaptif
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'adaptive',
        'Adaptive Question',
        'Difficulty adjusts based on performance',
        63, 'TrendingUp', true, true, true, 'global',
        '{"category": "special", "difficulty": "medium", "hasOptions": true, "isAdaptive": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 64. Kodlama
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'coding',
        'Coding/Programming',
        'Write or debug code',
        64, 'Code', true, true, true, 'global',
        '{"category": "special", "difficulty": "hard", "hasOptions": false, "supportsCoding": true, "supportsMultiLanguage": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    -- 65. Sanal Gerçeklik
    INSERT INTO core_schema.definitions (
        "GroupId", "Code", "Value", "Description",
        "DisplayOrder", "IconName", "IsSystemReserved", "IsActive", "IsSelectable",
        "Scope", "Metadata", "CreatedBy", "CreatedAt", "UpdatedAt", "Version", "Status"
    ) VALUES (
        question_types_group_id,
        'virtual_reality',
        'Virtual Reality',
        'Question in VR environment',
        65, 'Glasses', true, true, true, 'global',
        '{"category": "special", "difficulty": "hard", "hasOptions": false, "requiresInteraction": true, "supportsVR": true}'::jsonb,
        admin_user_id, NOW(), NOW(), 1, 'active'
    ) ON CONFLICT ("Code", "GroupId", "TenantId") DO NOTHING;

    RAISE NOTICE '✅ Special Format question types (61-65) added!';
    RAISE NOTICE '🎉 ALL 65 QUESTION TYPES SUCCESSFULLY SEEDED!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Seed failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'question_types' as category,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE "IsActive" = true) as active_count
FROM core_schema.definitions
WHERE "GroupId" = (SELECT "Id" FROM core_schema.definition_groups WHERE "Code" = 'question_types');

