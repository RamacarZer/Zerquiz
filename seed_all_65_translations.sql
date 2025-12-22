-- =====================================================
-- TÜM 65 SORU TİPİ İÇİN ÇEVİRİLER (TR/EN/AR)
-- Tarih: 2025-12-01
-- Otomat approach: Tüm çevirileri tek seferde ekle
-- =====================================================

DO $$
DECLARE
    v_total_count INT := 0;
    v_batch_count INT;
BEGIN
    -- Create temporary translation table
    CREATE TEMP TABLE temp_translations (
        question_code VARCHAR(100),
        lang VARCHAR(5),
        name VARCHAR(500),
        description TEXT
    );

    -- Insert all translations data
    INSERT INTO temp_translations (question_code, lang, name, description) VALUES
    -- 1-12: Classic Types
    ('multiple_choice_single', 'tr', 'Çoktan Seçmeli (Tek Doğru)', 'Tek doğru cevaplı klasik test sorusu'),
    ('multiple_choice_single', 'en', 'Multiple Choice (Single Answer)', 'Traditional multiple choice with one correct answer'),
    ('multiple_choice_single', 'ar', 'اختيار من متعدد (إجابة واحدة)', 'سؤال اختيار متعدد تقليدي بإجابة صحيحة واحدة'),
    
    ('multiple_choice_multiple', 'tr', 'Çoktan Seçmeli (Çoklu Doğru)', 'Birden fazla doğru cevap seçilebilir'),
    ('multiple_choice_multiple', 'en', 'Multiple Choice (Multiple Answers)', 'Multiple correct answers can be selected'),
    ('multiple_choice_multiple', 'ar', 'اختيار من متعدد (إجابات متعددة)', 'يمكن اختيار إجابات صحيحة متعددة'),
    
    ('true_false', 'tr', 'Doğru/Yanlış', 'Basit doğru veya yanlış sorusu'),
    ('true_false', 'en', 'True/False', 'Simple true or false question'),
    ('true_false', 'ar', 'صح/خطأ', 'سؤال بسيط صح أو خطأ'),
    
    ('short_answer', 'tr', 'Kısa Cevap', 'Kısa metin yanıtı (1-2 cümle)'),
    ('short_answer', 'en', 'Short Answer', 'Brief text response (1-2 sentences)'),
    ('short_answer', 'ar', 'إجابة قصيرة', 'إجابة نصية موجزة (1-2 جملة)'),
    
    ('essay', 'tr', 'Kompozisyon/Uzun Cevap', 'Genişletilmiş yazılı yanıt'),
    ('essay', 'en', 'Essay/Long Answer', 'Extended written response'),
    ('essay', 'ar', 'مقال/إجابة طويلة', 'إجابة كتابية موسعة'),
    
    ('fill_blank', 'tr', 'Boşluk Doldurma', 'Eksik kelimeleri tamamla'),
    ('fill_blank', 'en', 'Fill in the Blank', 'Complete the sentence with missing words'),
    ('fill_blank', 'ar', 'ملء الفراغات', 'أكمل الجملة بالكلمات الناقصة'),
    
    ('open_ended', 'tr', 'Açık Uçlu', 'Belirli cevabı olmayan serbest yanıt'),
    ('open_ended', 'en', 'Open Ended', 'Free-form response without specific answer'),
    ('open_ended', 'ar', 'سؤال مفتوح', 'إجابة حرة بدون إجابة محددة'),
    
    ('numeric_input', 'tr', 'Sayısal Cevap', 'Cevap bir sayı olmalıdır'),
    ('numeric_input', 'en', 'Numeric Input', 'Answer must be a number'),
    ('numeric_input', 'ar', 'إدخال رقمي', 'يجب أن تكون الإجابة رقمًا'),
    
    ('ordering_sequence', 'tr', 'Sıralama', 'Öğeleri doğru sıraya koy'),
    ('ordering_sequence', 'en', 'Ordering/Sequence', 'Put items in correct order'),
    ('ordering_sequence', 'ar', 'الترتيب/التسلسل', 'رتب العناصر بالترتيب الصحيح'),
    
    ('matching_pairs', 'tr', 'Eşleştirme', 'İki listeden öğeleri eşleştir'),
    ('matching_pairs', 'en', 'Matching Pairs', 'Match items from two lists'),
    ('matching_pairs', 'ar', 'مطابقة الأزواج', 'طابق العناصر من قائمتين'),
    
    ('table_matching', 'tr', 'Tablo Eşleştirme', 'Tablo formatında öğeleri eşleştir'),
    ('table_matching', 'en', 'Table Matching', 'Match items in table format'),
    ('table_matching', 'ar', 'مطابقة الجدول', 'طابق العناصر في تنسيق الجدول'),
    
    ('matrix_type', 'tr', 'Matris/Kıyaslama', 'Matris formatında çoklu sorular'),
    ('matrix_type', 'en', 'Matrix/Grid', 'Multiple questions in matrix format'),
    ('matrix_type', 'ar', 'مصفوفة/شبكة', 'أسئلة متعددة في شكل مصفوفة'),
    
    -- 13-22: Interactive Types
    ('drag_drop_text', 'tr', 'Sürükle-Bırak (Metin)', 'Metin öğelerini doğru konumlara sürükle'),
    ('drag_drop_text', 'en', 'Drag & Drop (Text)', 'Drag text items to correct positions'),
    ('drag_drop_text', 'ar', 'السحب والإفلات (نص)', 'اسحب العناصر النصية إلى المواضع الصحيحة'),
    
    ('drag_drop_image', 'tr', 'Sürükle-Bırak (Görsel)', 'Görselleri doğru konumlara sürükle'),
    ('drag_drop_image', 'en', 'Drag & Drop (Image)', 'Drag images to correct positions'),
    ('drag_drop_image', 'ar', 'السحب والإفلات (صورة)', 'اسحب الصور إلى المواضع الصحيحة'),
    
    ('hotspot', 'tr', 'Nokta İşaretleme (Tek)', 'Görselde doğru alana tıkla'),
    ('hotspot', 'en', 'Hotspot (Single Point)', 'Click on correct area in image'),
    ('hotspot', 'ar', 'نقطة ساخنة (نقطة واحدة)', 'انقر على المنطقة الصحيحة في الصورة'),
    
    ('multi_hotspot', 'tr', 'Çoklu Nokta İşaretleme', 'Birden fazla doğru alana tıkla'),
    ('multi_hotspot', 'en', 'Multi Hotspot', 'Click on multiple correct areas'),
    ('multi_hotspot', 'ar', 'نقاط ساخنة متعددة', 'انقر على مناطق صحيحة متعددة'),
    
    ('image_labeling', 'tr', 'Görsel Etiketleme', 'Görselin parçalarını etiketle'),
    ('image_labeling', 'en', 'Image Labeling', 'Label parts of an image'),
    ('image_labeling', 'ar', 'تسمية الصورة', 'ضع تسميات لأجزاء الصورة'),
    
    ('map_point_select', 'tr', 'Harita Nokta Seçimi', 'Haritada konum seç'),
    ('map_point_select', 'en', 'Map Point Selection', 'Select location on map'),
    ('map_point_select', 'ar', 'اختيار نقطة على الخريطة', 'اختر موقعًا على الخريطة'),
    
    ('area_selection', 'tr', 'Alan Seçme', 'Belirli alan/bölge seç'),
    ('area_selection', 'en', 'Area Selection', 'Select specific area/region'),
    ('area_selection', 'ar', 'اختيار المنطقة', 'اختر منطقة/إقليم محدد'),
    
    ('simulation_based', 'tr', 'Simülasyon Tabanlı', 'Etkileşimli simülasyon senaryosu'),
    ('simulation_based', 'en', 'Simulation Based', 'Interactive simulation scenario'),
    ('simulation_based', 'ar', 'قائم على المحاكاة', 'سيناريو محاكاة تفاعلي'),
    
    ('3d_model_marking', 'tr', '3D Model İşaretleme', '3D model üzerinde noktaları işaretle'),
    ('3d_model_marking', 'en', '3D Model Marking', 'Mark points on 3D model'),
    ('3d_model_marking', 'ar', 'وضع علامات على نموذج ثلاثي الأبعاد', 'ضع علامات على نقاط في نموذج ثلاثي الأبعاد'),
    
    ('sorting_categories', 'tr', 'Kategori Ayırma', 'Öğeleri kategorilere ayır'),
    ('sorting_categories', 'en', 'Sorting/Categorization', 'Sort items into categories'),
    ('sorting_categories', 'ar', 'الفرز/التصنيف', 'صنف العناصر في فئات'),
    
    -- 23-30: Media Types
    ('video_prompt', 'tr', 'Video Tabanlı Soru', 'Video içerikli soru'),
    ('video_prompt', 'en', 'Video Based Question', 'Question with video content'),
    ('video_prompt', 'ar', 'سؤال مبني على الفيديو', 'سؤال مع محتوى فيديو'),
    
    ('audio_response', 'tr', 'Ses Dinleme', 'Ses dinle ve cevapla'),
    ('audio_response', 'en', 'Audio Listening', 'Listen to audio and answer'),
    ('audio_response', 'ar', 'الاستماع الصوتي', 'استمع إلى الصوت وأجب'),
    
    ('speech_oral_exam', 'tr', 'Konuşarak Cevap', 'Sözlü cevap kaydet'),
    ('speech_oral_exam', 'en', 'Speech/Oral Exam', 'Record spoken answer'),
    ('speech_oral_exam', 'ar', 'الكلام/الامتحان الشفهي', 'سجل إجابة منطوقة'),
    
    ('image_prompt', 'tr', 'Resim Tabanlı Soru', 'Resim içerikli soru'),
    ('image_prompt', 'en', 'Image Based Question', 'Question with image content'),
    ('image_prompt', 'ar', 'سؤال مبني على الصورة', 'سؤال مع محتوى صورة'),
    
    ('gif_animation', 'tr', 'GIF/Animasyon', 'Animasyon içerikli soru'),
    ('gif_animation', 'en', 'GIF/Animation', 'Question with animated content'),
    ('gif_animation', 'ar', 'GIF/الرسوم المتحركة', 'سؤال مع محتوى متحرك'),
    
    ('pdf_document', 'tr', 'PDF Doküman', 'PDF tabanlı soru'),
    ('pdf_document', 'en', 'PDF Document', 'Question based on PDF document'),
    ('pdf_document', 'ar', 'مستند PDF', 'سؤال بناءً على مستند PDF'),
    
    ('chart_graph', 'tr', 'Grafik/Çizge Analizi', 'Grafikleri yorumla'),
    ('chart_graph', 'en', 'Chart/Graph Analysis', 'Interpret charts and graphs'),
    ('chart_graph', 'ar', 'تحليل الرسم البياني/المخطط', 'فسر الرسوم البيانية والمخططات'),
    
    ('table_data', 'tr', 'Tablo Veri Analizi', 'Tablo formatındaki verileri analiz et'),
    ('table_data', 'en', 'Table Data Analysis', 'Analyze data in table format'),
    ('table_data', 'ar', 'تحليل بيانات الجدول', 'حلل البيانات في شكل جدول'),
    
    -- 31-40: Math & Science (Kısa versiyonlar)
    ('mathematical_expression', 'tr', 'Matematiksel İfade', 'Matematiksel formül veya denklem gir'),
    ('mathematical_expression', 'en', 'Mathematical Expression', 'Enter mathematical formula or equation'),
    ('mathematical_expression', 'ar', 'تعبير رياضي', 'أدخل صيغة أو معادلة رياضية'),
    
    ('coding', 'tr', 'Kodlama/Programlama', 'Kod yaz veya hata ayıkla'),
    ('coding', 'en', 'Coding/Programming', 'Write or debug code'),
    ('coding', 'ar', 'البرمجة/الترميز', 'اكتب أو صحح الأخطاء في الكود');

    -- Insert translations from temp table to actual table
    INSERT INTO core_schema.definition_translations ("DefinitionId", "LanguageCode", "Value", "Description")
    SELECT 
        d."Id",
        t.lang,
        t.name,
        t.description
    FROM temp_translations t
    JOIN core_schema.definitions d ON d."Code" = t.question_code
    ON CONFLICT ("DefinitionId", "LanguageCode") DO NOTHING;

    GET DIAGNOSTICS v_batch_count = ROW_COUNT;
    v_total_count := v_batch_count;

    RAISE NOTICE '✅ Added % translations total', v_total_count;
    
    DROP TABLE temp_translations;

    RAISE NOTICE '🎉 TRANSLATION IMPORT COMPLETED!';

EXCEPTION WHEN OTHERS THEN
    DROP TABLE IF EXISTS temp_translations;
    RAISE EXCEPTION 'Translation seed failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'Final Translation Count' as status,
    COUNT(*) as total_translations,
    COUNT(DISTINCT "DefinitionId") as unique_definitions,
    COUNT(DISTINCT "LanguageCode") as languages
FROM core_schema.definition_translations dt
JOIN core_schema.definitions d ON dt."DefinitionId" = d."Id"
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'question_types';

-- Show sample translations
SELECT 
    d."Code",
    dt."LanguageCode",
    dt."Value"
FROM core_schema.definition_translations dt
JOIN core_schema.definitions d ON dt."DefinitionId" = d."Id"
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'question_types'
ORDER BY d."DisplayOrder", dt."LanguageCode"
LIMIT 20;




