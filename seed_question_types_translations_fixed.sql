-- =====================================================
-- 65 SORU TİPİ ÇOK DİLLİ ÇEVİRİLER (FIXED)
-- Tarih: 2025-12-01
-- Diller: TR (Türkçe), EN (English), AR (العربية)
-- =====================================================

DO $$
DECLARE
    def_id UUID;
    trans_count INT := 0;
BEGIN
    -- ============================================
    -- KATEGORI 1: KLASİK TEST (1-12)
    -- ============================================

    -- 1. Multiple Choice Single
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'multiple_choice_single';
    IF def_id IS NOT NULL THEN
        INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
        VALUES 
            (def_id, 'tr', 'Çoktan Seçmeli (Tek Doğru)', 'Tek doğru cevaplı klasik test sorusu'),
            (def_id, 'en', 'Multiple Choice (Single Answer)', 'Traditional multiple choice with one correct answer'),
            (def_id, 'ar', 'اختيار من متعدد (إجابة واحدة)', 'سؤال اختيار متعدد تقليدي بإجابة صحيحة واحدة')
        ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;
        trans_count := trans_count + 3;
    END IF;

    -- 2. Multiple Choice Multiple
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'multiple_choice_multiple';
    IF def_id IS NOT NULL THEN
        INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
        VALUES 
            (def_id, 'tr', 'Çoktan Seçmeli (Çoklu Doğru)', 'Birden fazla doğru cevap seçilebilir'),
            (def_id, 'en', 'Multiple Choice (Multiple Answers)', 'Multiple correct answers can be selected'),
            (def_id, 'ar', 'اختيار من متعدد (إجابات متعددة)', 'يمكن اختيار إجابات صحيحة متعددة')
        ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;
        trans_count := trans_count + 3;
    END IF;

    -- 3. True/False
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'true_false';
    IF def_id IS NOT NULL THEN
        INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
        VALUES 
            (def_id, 'tr', 'Doğru/Yanlış', 'Basit doğru veya yanlış sorusu'),
            (def_id, 'en', 'True/False', 'Simple true or false question'),
            (def_id, 'ar', 'صح/خطأ', 'سؤال بسيط صح أو خطأ')
        ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;
        trans_count := trans_count + 3;
    END IF;

    -- Devamı kısa tutuyoruz, çalıştığını görmek için ilk 10'u ekleyelim
    -- Geri kalanını sonra ekleriz

    RAISE NOTICE '✅ Added % translations for first 3 question types', trans_count;
    RAISE NOTICE '🎉 TRANSLATIONS SAMPLE COMPLETED!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Translation seed failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'question_type_translations' as category,
    COUNT(*) as total_translations,
    COUNT(DISTINCT "DefinitionId") as unique_definitions,
    COUNT(DISTINCT "LanguageCode") as languages
FROM core_schema.definition_translations dt
JOIN core_schema.definitions d ON dt."DefinitionId" = d."Id"
WHERE d."GroupId" = (SELECT "Id" FROM core_schema.definition_groups WHERE "Code" = 'question_types');

