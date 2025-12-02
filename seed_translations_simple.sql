-- =====================================================
-- SORU TİPLERİ İÇİN ÇEVİRİLER (BASİTLEŞTİRİLMİŞ)
-- Tarih: 2025-12-01
-- =====================================================

DO $$
DECLARE
    v_count INT := 0;
BEGIN
    -- 1. Multiple Choice Single
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE 
            WHEN lang.code = 'tr' THEN 'Çoktan Seçmeli (Tek Doğru)'
            WHEN lang.code = 'en' THEN 'Multiple Choice (Single Answer)'
            WHEN lang.code = 'ar' THEN 'اختيار من متعدد (إجابة واحدة)'
        END,
        CASE 
            WHEN lang.code = 'tr' THEN 'Tek doğru cevaplı klasik test sorusu'
            WHEN lang.code = 'en' THEN 'Traditional multiple choice with one correct answer'
            WHEN lang.code = 'ar' THEN 'سؤال اختيار متعدد تقليدي بإجابة صحيحة واحدة'
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."Code" = 'multiple_choice_single'
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Added % translations for multiple_choice_single', v_count;

    -- 2. Multiple Choice Multiple
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE 
            WHEN lang.code = 'tr' THEN 'Çoktan Seçmeli (Çoklu Doğru)'
            WHEN lang.code = 'en' THEN 'Multiple Choice (Multiple Answers)'
            WHEN lang.code = 'ar' THEN 'اختيار من متعدد (إجابات متعددة)'
        END,
        CASE 
            WHEN lang.code = 'tr' THEN 'Birden fazla doğru cevap seçilebilir'
            WHEN lang.code = 'en' THEN 'Multiple correct answers can be selected'
            WHEN lang.code = 'ar' THEN 'يمكن اختيار إجابات صحيحة متعددة'
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."Code" = 'multiple_choice_multiple'
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Added % translations for multiple_choice_multiple', v_count;

    -- 3. True/False
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE 
            WHEN lang.code = 'tr' THEN 'Doğru/Yanlış'
            WHEN lang.code = 'en' THEN 'True/False'
            WHEN lang.code = 'ar' THEN 'صح/خطأ'
        END,
        CASE 
            WHEN lang.code = 'tr' THEN 'Basit doğru veya yanlış sorusu'
            WHEN lang.code = 'en' THEN 'Simple true or false question'
            WHEN lang.code = 'ar' THEN 'سؤال بسيط صح أو خطأ'
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."Code" = 'true_false'
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Added % translations for true_false', v_count;

    -- 4. Short Answer
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE 
            WHEN lang.code = 'tr' THEN 'Kısa Cevap'
            WHEN lang.code = 'en' THEN 'Short Answer'
            WHEN lang.code = 'ar' THEN 'إجابة قصيرة'
        END,
        CASE 
            WHEN lang.code = 'tr' THEN 'Kısa metin yanıtı (1-2 cümle)'
            WHEN lang.code = 'en' THEN 'Brief text response (1-2 sentences)'
            WHEN lang.code = 'ar' THEN 'إجابة نصية موجزة (1-2 جملة)'
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."Code" = 'short_answer'
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Added % translations for short_answer', v_count;

    -- 5. Essay
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        lang.code,
        CASE 
            WHEN lang.code = 'tr' THEN 'Kompozisyon/Uzun Cevap'
            WHEN lang.code = 'en' THEN 'Essay/Long Answer'
            WHEN lang.code = 'ar' THEN 'مقال/إجابة طويلة'
        END,
        CASE 
            WHEN lang.code = 'tr' THEN 'Genişletilmiş yazılı yanıt'
            WHEN lang.code = 'en' THEN 'Extended written response'
            WHEN lang.code = 'ar' THEN 'إجابة كتابية موسعة'
        END
    FROM core_schema.definitions d
    CROSS JOIN (VALUES ('tr'), ('en'), ('ar')) AS lang(code)
    WHERE d."Code" = 'essay'
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Added % translations for essay', v_count;

    RAISE NOTICE '✅ Successfully added translations for first 5 question types!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Translation seed failed: %', SQLERRM;
END $$;

-- Verification
SELECT 
    'Translations Added' as status,
    COUNT(*) as total_count,
    COUNT(DISTINCT "DefinitionId") as unique_definitions,
    COUNT(DISTINCT "LanguageCode") as languages
FROM core_schema.definition_translations dt
JOIN core_schema.definitions d ON dt."DefinitionId" = d."Id"
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'question_types';

