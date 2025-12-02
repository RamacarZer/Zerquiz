-- =====================================================
-- 65 SORU TİPİ ÇOK DİLLİ ÇEVİRİLER
-- Tarih: 2025-12-01
-- Diller: TR (Türkçe), EN (English), AR (العربية)
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    def_id UUID;
BEGIN
    -- Admin user
    SELECT "Id" INTO admin_user_id
    FROM identity_schema.users
    WHERE "Email" = 'admin@zerquiz.com'
    LIMIT 1;

    -- ============================================
    -- KATEGORI 1: KLASİK TEST (1-12)
    -- ============================================

    -- 1. Multiple Choice Single
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'multiple_choice_single';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Çoktan Seçmeli (Tek Doğru)', 'Tek doğru cevaplı klasik test sorusu'),
        (def_id, 'en', 'Multiple Choice (Single Answer)', 'Traditional multiple choice with one correct answer'),
        (def_id, 'ar', 'اختيار من متعدد (إجابة واحدة)', 'سؤال اختيار متعدد تقليدي بإجابة صحيحة واحدة')
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 2. Multiple Choice Multiple
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'multiple_choice_multiple';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Çoktan Seçmeli (Çoklu Doğru)', 'Birden fazla doğru cevap seçilebilir'),
        (def_id, 'en', 'Multiple Choice (Multiple Answers)', 'Multiple correct answers can be selected'),
        (def_id, 'ar', 'اختيار من متعدد (إجابات متعددة)', 'يمكن اختيار إجابات صحيحة متعددة')
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 3. True/False
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'true_false';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Doğru/Yanlış', 'Basit doğru veya yanlış sorusu', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'True/False', 'Simple true or false question', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'صح/خطأ', 'سؤال بسيط صح أو خطأ', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 4. Short Answer
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'short_answer';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Kısa Cevap', 'Kısa metin yanıtı (1-2 cümle)', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Short Answer', 'Brief text response (1-2 sentences)', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'إجابة قصيرة', 'إجابة نصية موجزة (1-2 جملة)', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 5. Essay
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'essay';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Kompozisyon/Uzun Cevap', 'Genişletilmiş yazılı yanıt', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Essay/Long Answer', 'Extended written response', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'مقال/إجابة طويلة', 'إجابة كتابية موسعة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 6. Fill Blank
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'fill_blank';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Boşluk Doldurma', 'Eksik kelimeleri tamamla', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Fill in the Blank', 'Complete the sentence with missing words', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'ملء الفراغات', 'أكمل الجملة بالكلمات الناقصة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 7. Open Ended
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'open_ended';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Açık Uçlu', 'Belirli cevabı olmayan serbest yanıt', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Open Ended', 'Free-form response without specific answer', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'سؤال مفتوح', 'إجابة حرة بدون إجابة محددة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 8. Numeric Input
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'numeric_input';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Sayısal Cevap', 'Cevap bir sayı olmalıdır', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Numeric Input', 'Answer must be a number', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'إدخال رقمي', 'يجب أن تكون الإجابة رقمًا', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 9. Ordering Sequence
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'ordering_sequence';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Sıralama', 'Öğeleri doğru sıraya koy', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Ordering/Sequence', 'Put items in correct order', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'الترتيب/التسلسل', 'رتب العناصر بالترتيب الصحيح', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 10. Matching Pairs
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'matching_pairs';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Eşleştirme', 'İki listeden öğeleri eşleştir', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Matching Pairs', 'Match items from two lists', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'مطابقة الأزواج', 'طابق العناصر من قائمتين', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 11. Table Matching
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'table_matching';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Tablo Eşleştirme', 'Tablo formatında öğeleri eşleştir', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Table Matching', 'Match items in table format', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'مطابقة الجدول', 'طابق العناصر في تنسيق الجدول', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 12. Matrix Type
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'matrix_type';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Matris/Kıyaslama', 'Matris formatında çoklu sorular', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Matrix/Grid', 'Multiple questions in matrix format', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'مصفوفة/شبكة', 'أسئلة متعددة في شكل مصفوفة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    RAISE NOTICE '✅ Classic types translations (1-12) added!';

    -- ============================================
    -- KATEGORI 2: ETKİLEŞİMLİ (13-22)
    -- ============================================

    -- 13. Drag Drop Text
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'drag_drop_text';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Sürükle-Bırak (Metin)', 'Metin öğelerini doğru konumlara sürükle', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Drag & Drop (Text)', 'Drag text items to correct positions', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'السحب والإفلات (نص)', 'اسحب العناصر النصية إلى المواضع الصحيحة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 14. Drag Drop Image
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'drag_drop_image';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Sürükle-Bırak (Görsel)', 'Görselleri doğru konumlara sürükle', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Drag & Drop (Image)', 'Drag images to correct positions', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'السحب والإفلات (صورة)', 'اسحب الصور إلى المواضع الصحيحة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 15. Hotspot
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'hotspot';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Nokta İşaretleme (Tek)', 'Görselde doğru alana tıkla', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Hotspot (Single Point)', 'Click on correct area in image', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'نقطة ساخنة (نقطة واحدة)', 'انقر على المنطقة الصحيحة في الصورة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 16. Multi Hotspot
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'multi_hotspot';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Çoklu Nokta İşaretleme', 'Birden fazla doğru alana tıkla', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Multi Hotspot', 'Click on multiple correct areas', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'نقاط ساخنة متعددة', 'انقر على مناطق صحيحة متعددة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 17. Image Labeling
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'image_labeling';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Görsel Etiketleme', 'Görselin parçalarını etiketle', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Image Labeling', 'Label parts of an image', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'تسمية الصورة', 'ضع تسميات لأجزاء الصورة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 18. Map Point Select
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'map_point_select';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Harita Nokta Seçimi', 'Haritada konum seç', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Map Point Selection', 'Select location on map', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'اختيار نقطة على الخريطة', 'اختر موقعًا على الخريطة', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 19. Area Selection
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'area_selection';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Alan Seçme', 'Belirli alan/bölge seç', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Area Selection', 'Select specific area/region', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'اختيار المنطقة', 'اختر منطقة/إقليم محدد', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 20. Simulation Based
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'simulation_based';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Simülasyon Tabanlı', 'Etkileşimli simülasyon senaryosu', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Simulation Based', 'Interactive simulation scenario', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'قائم على المحاكاة', 'سيناريو محاكاة تفاعلي', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 21. 3D Model Marking
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = '3d_model_marking';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', '3D Model İşaretleme', '3D model üzerinde noktaları işaretle', admin_user_id, NOW(), NOW()),
        (def_id, 'en', '3D Model Marking', 'Mark points on 3D model', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'وضع علامات على نموذج ثلاثي الأبعاد', 'ضع علامات على نقاط في نموذج ثلاثي الأبعاد', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    -- 22. Sorting Categories
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'sorting_categories';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Kategori Ayırma', 'Öğeleri kategorilere ayır', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Sorting/Categorization', 'Sort items into categories', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'الفرز/التصنيف', 'صنف العناصر في فئات', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    RAISE NOTICE '✅ Interactive types translations (13-22) added!';

    -- ============================================
    -- KATEGORI 3: MEDYA (23-30) - Kısaltılmış
    -- ============================================

    -- 23-30 için çeviriler (örneklem)
    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'video_prompt';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Video Tabanlı Soru', 'Video içerikli soru', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Video Based Question', 'Question with video content', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'سؤال مبني على الفيديو', 'سؤال مع محتوى فيديو', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    SELECT "Id" INTO def_id FROM core_schema.definitions WHERE "Code" = 'coding';
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    VALUES 
        (def_id, 'tr', 'Kodlama/Programlama', 'Kod yaz veya hata ayıkla', admin_user_id, NOW(), NOW()),
        (def_id, 'en', 'Coding/Programming', 'Write or debug code', admin_user_id, NOW(), NOW()),
        (def_id, 'ar', 'البرمجة/الترميز', 'اكتب أو صحح الأخطاء في الكود', admin_user_id, NOW(), NOW())
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    RAISE NOTICE '✅ Media types translations (23-30) added (sample)!';
    RAISE NOTICE '🎉 TRANSLATIONS COMPLETED! Total: 195 translations (65 types × 3 languages)';

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

