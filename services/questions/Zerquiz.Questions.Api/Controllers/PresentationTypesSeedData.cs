using Zerquiz.Questions.Domain.Entities;

namespace Zerquiz.Questions.Api.Controllers;

/// <summary>
/// Comprehensive 60+ Question Presentation Types Seed Data
/// </summary>
public static class PresentationTypesSeedData
{
    public static QuestionPresentationType[] GetAllPresentationTypes(Guid tenantId, DateTime now)
    {
        return new[]
        {
            // ========== 1) KLASİK SINAV / TEST SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "multiple_choice_single",
                Name = "Çoktan Seçmeli (Tek Doğru)", Description = "Klasik çoktan seçmeli - tek doğru cevap",
                AnswerType = "options", MinOptions = 2, MaxOptions = 10, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "multiple_choice_multiple",
                Name = "Çoktan Seçmeli (Çoklu Doğru - MSQ)", Description = "Birden fazla doğru cevap seçilebilir",
                AnswerType = "options_multiple", MinOptions = 2, MaxOptions = 10, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "true_false",
                Name = "Doğru / Yanlış", Description = "İki seçenekli (Doğru veya Yanlış)",
                AnswerType = "boolean", MinOptions = 2, MaxOptions = 2, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "short_answer",
                Name = "Kısa Cevap", Description = "Kısa metin girişi (1-2 cümle)",
                AnswerType = "text_input", RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 4, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "essay",
                Name = "Uzun Cevap / Kompozisyon", Description = "Uzun metin girişi, paragraf düzeyinde cevap",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"minWords\": 50, \"maxWords\": 500, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 5, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "fill_blank",
                Name = "Boşluk Doldurma (Cloze)", Description = "Metin içindeki boşlukları doldurma",
                AnswerType = "text_input", RequiresAnswer = true,
                ConfigSchema = "{\"allowMultipleBlanks\": true, \"blanksInText\": true}",
                IsSystem = true, DisplayOrder = 6, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "open_ended",
                Name = "Açık Uçlu Metin", Description = "Serbest format metin cevabı",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 7, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "numeric_input",
                Name = "Sayısal Cevap", Description = "Numerik değer girişi",
                AnswerType = "number", RequiresAnswer = true,
                ConfigSchema = "{\"allowDecimals\": true, \"allowNegative\": true}",
                IsSystem = true, DisplayOrder = 8, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "ordering_sequence",
                Name = "Sıralama / Sıra Belirleme", Description = "Öğeleri doğru sıraya dizme",
                AnswerType = "ordering", MinOptions = 2, MaxOptions = 10, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 9, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "matching_pairs",
                Name = "Eşleştirme (Matching Pairs)", Description = "İki liste arasında eşleştirme yapma",
                AnswerType = "matching", MinOptions = 2, MaxOptions = 10, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 10, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "table_matching",
                Name = "Tablo Üzerinde Eşleştirme", Description = "Tablo yapısında çoklu eşleştirme",
                AnswerType = "matching_table", RequiresAnswer = true,
                ConfigSchema = "{\"tableFormat\": true, \"multipleColumns\": true}",
                IsSystem = true, DisplayOrder = 11, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "matrix_type",
                Name = "Kıyaslama / Matrix Type", Description = "Satır-sütun kesişiminde seçim yapma",
                AnswerType = "matrix", RequiresAnswer = true,
                ConfigSchema = "{\"multipleRows\": true, \"multipleColumns\": true}",
                IsSystem = true, DisplayOrder = 12, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 2) İLERİ SEVİYE ETKİLEŞİMLİ SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "drag_drop_text",
                Name = "Sürükle-Bırak → Metin", Description = "Metin öğelerini sürükleyip bırakma",
                AnswerType = "drag_drop", RequiresAnswer = true,
                ConfigSchema = "{\"itemType\": \"text\", \"allowMultiple\": true}",
                IsSystem = true, DisplayOrder = 13, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "drag_drop_image",
                Name = "Sürükle-Bırak → Görsel", Description = "Görsel öğeleri sürükleyip bırakma",
                AnswerType = "drag_drop", RequiresAnswer = true,
                ConfigSchema = "{\"itemType\": \"image\", \"allowMultiple\": true}",
                IsSystem = true, DisplayOrder = 14, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "hotspot_single",
                Name = "Görüntü Üzerinde İşaretleme (Hotspot)", Description = "Görsel üzerinde belirli nokta seçme",
                AnswerType = "hotspot", RequiresAnswer = true,
                ConfigSchema = "{\"allowSinglePoint\": true, \"imageRequired\": true}",
                IsSystem = true, DisplayOrder = 15, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "hotspot_multiple",
                Name = "Görüntü Üzerinde Çoklu Nokta İşaretleme", Description = "Görselde birden fazla nokta işaretleme",
                AnswerType = "hotspot_multiple", RequiresAnswer = true,
                ConfigSchema = "{\"allowMultiplePoints\": true, \"minPoints\": 1, \"maxPoints\": 10}",
                IsSystem = true, DisplayOrder = 16, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "image_labeling",
                Name = "Etiketleme (Image Labeling)", Description = "Görsel üzerinde etiketleme/isimlendirme",
                AnswerType = "labeling", RequiresAnswer = true,
                ConfigSchema = "{\"allowTextLabels\": true, \"imageRequired\": true}",
                IsSystem = true, DisplayOrder = 17, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "map_point_select",
                Name = "Harita Üzerinde Nokta Seçme", Description = "Harita görselinde konum belirleme",
                AnswerType = "map_point", RequiresAnswer = true,
                ConfigSchema = "{\"mapType\": true, \"allowCoordinates\": true}",
                IsSystem = true, DisplayOrder = 18, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "area_selection",
                Name = "Görsel Alan Seçme", Description = "Görsel üzerinde alan/bölge seçme",
                AnswerType = "area_select", RequiresAnswer = true,
                ConfigSchema = "{\"allowPolygon\": true, \"allowRectangle\": true, \"allowCircle\": true}",
                IsSystem = true, DisplayOrder = 19, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "simulation_based",
                Name = "Simülasyon Tabanlı Soru", Description = "İnteraktif simülasyon üzerinden cevaplama",
                AnswerType = "simulation", RequiresAnswer = true,
                ConfigSchema = "{\"requiresSimulation\": true, \"trackInteractions\": true}",
                IsSystem = true, DisplayOrder = 20, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "3d_model_marking",
                Name = "3D Model Üzerinde İşaretleme", Description = "3D obje üzerinde nokta/alan belirleme",
                AnswerType = "3d_marking", RequiresAnswer = true,
                ConfigSchema = "{\"requires3D\": true, \"allowRotation\": true}",
                IsSystem = true, DisplayOrder = 21, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "sorting_categories",
                Name = "Kategori Ayırma (Sorting)", Description = "Öğeleri kategorilere ayırma",
                AnswerType = "categorize", MinOptions = 2, RequiresAnswer = true,
                ConfigSchema = "{\"allowMultipleCategories\": true}",
                IsSystem = true, DisplayOrder = 22, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 3) MEDYA / ÇOKLU ORTAM TABANLI SORULAR ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "video_prompt",
                Name = "Video Tabanlı Soru", Description = "Video izlettirip sonra soru sorma",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresVideo\": true, \"trackWatchTime\": true}",
                IsSystem = true, DisplayOrder = 23, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "audio_listening",
                Name = "Ses Dinleme – Cevaplama", Description = "Ses kaydı dinleyip cevaplama",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresAudio\": true, \"allowReplay\": true}",
                IsSystem = true, DisplayOrder = 24, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "speech_recording",
                Name = "Konuşarak Cevap (Mikrofon Kaydı)", Description = "Sözlü sınav / ses kaydı ile cevap",
                AnswerType = "audio_record", RequiresAnswer = true,
                ConfigSchema = "{\"requiresMicrophone\": true, \"maxDuration\": 180, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 25, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "image_prompt",
                Name = "Resim Tabanlı Soru", Description = "Görsel gösterip soru sorma",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresImage\": true}",
                IsSystem = true, DisplayOrder = 26, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "gif_animation_prompt",
                Name = "GIF / Animasyon İpucuyla Soru", Description = "Animasyon gösterip soru",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresAnimation\": true, \"allowLoop\": true}",
                IsSystem = true, DisplayOrder = 27, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "pdf_document_based",
                Name = "PDF Üzerinde Soru", Description = "PDF doküman okuyup cevaplama",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresPDF\": true, \"allowNavigation\": true}",
                IsSystem = true, DisplayOrder = 28, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "reading_comprehension",
                Name = "Okuma Parçası – Bağlantılı Soru", Description = "Uzun metin okutup ilgili soru",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresReadingText\": true, \"minWords\": 100}",
                IsSystem = true, DisplayOrder = 29, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 4) YABANCI DİL & AKADEMİK SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "listening_comprehension",
                Name = "Listening (Dinleme)", Description = "Yabancı dil dinleme sorusu",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresAudio\": true, \"language\": \"foreign\"}",
                IsSystem = true, DisplayOrder = 30, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "speaking_oral",
                Name = "Speaking (Konuşma)", Description = "Sözlü ifade / konuşma sınavı",
                AnswerType = "audio_record", RequiresAnswer = true,
                ConfigSchema = "{\"requiresMicrophone\": true, \"language\": \"foreign\", \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 31, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "reading_foreign",
                Name = "Reading (Okuduğunu Anlama)", Description = "Yabancı dil okuma parçası",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"requiresReadingText\": true, \"language\": \"foreign\"}",
                IsSystem = true, DisplayOrder = 32, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "writing_composition",
                Name = "Writing (Yazma / Kompozisyon)", Description = "Yazılı anlatım sorusu",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"minWords\": 50, \"maxWords\": 300, \"requiresManualGrading\": true, \"language\": \"foreign\"}",
                IsSystem = true, DisplayOrder = 33, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "paragraph_main_idea",
                Name = "Paragrafta Anlam – Ana Fikir", Description = "Paragraf analiz ve ana fikir bulma",
                AnswerType = "options", RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 34, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "cloze_test",
                Name = "Cloze Test (Metin İçi Boşluk)", Description = "Metin içindeki boşlukları tamamlama",
                AnswerType = "text_input", RequiresAnswer = true,
                ConfigSchema = "{\"multipleBlanks\": true, \"inContext\": true}",
                IsSystem = true, DisplayOrder = 35, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "synonym_antonym",
                Name = "Eş Anlam / Zıt Anlam", Description = "Kelime ilişkileri bulma",
                AnswerType = "matching", RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 36, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "translation",
                Name = "Çeviri (Translation)", Description = "Bir dilden diğerine çeviri yapma",
                AnswerType = "text_input", RequiresAnswer = true,
                ConfigSchema = "{\"sourceLanguage\": true, \"targetLanguage\": true}",
                IsSystem = true, DisplayOrder = 37, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "grammar_focused",
                Name = "Gramer Odaklı Sorular", Description = "Dil bilgisi kuralları üzerine",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"grammarRule\": true}",
                IsSystem = true, DisplayOrder = 38, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "paragraph_ordering",
                Name = "Paragraf / Cümle Sıralama", Description = "Karışık cümleleri sıraya koyma",
                AnswerType = "ordering", MinOptions = 3, RequiresAnswer = true,
                IsSystem = true, DisplayOrder = 39, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "dialogue_completion",
                Name = "Diyalog Tamamlama", Description = "Konuşma boşluklarını doldurma",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"dialogueFormat\": true}",
                IsSystem = true, DisplayOrder = 40, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 5) KODLAMA / TEKNİK / STEM SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "coding_question",
                Name = "Kod Yazma Sorusu", Description = "Programlama sorusu, kod yazma",
                AnswerType = "code_editor", RequiresAnswer = true,
                ConfigSchema = "{\"language\": [\"python\", \"javascript\", \"java\", \"cpp\"], \"allowExecution\": true}",
                IsSystem = true, DisplayOrder = 41, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "code_execution",
                Name = "Kod Çalıştırma (Test Cases)", Description = "Kod yazıp test case'lerle doğrulama",
                AnswerType = "code_editor", RequiresAnswer = true,
                ConfigSchema = "{\"autoGrade\": true, \"testCases\": true, \"timeLimit\": true}",
                IsSystem = true, DisplayOrder = 42, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "debugging",
                Name = "Hata Bulma (Debugging)", Description = "Kodda hata bulma ve düzeltme",
                AnswerType = "code_editor", RequiresAnswer = true,
                ConfigSchema = "{\"buggyCode\": true, \"allowFix\": true}",
                IsSystem = true, DisplayOrder = 43, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "output_prediction",
                Name = "Çıktı Tahmini", Description = "Verilen kodun çıktısını tahmin etme",
                AnswerType = "text_input", RequiresAnswer = true,
                ConfigSchema = "{\"codeProvided\": true}",
                IsSystem = true, DisplayOrder = 44, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "math_formula_latex",
                Name = "Matematik Formül Girişi (LaTeX)", Description = "Matematiksel ifade yazma",
                AnswerType = "latex", RequiresAnswer = true,
                ConfigSchema = "{\"latexEditor\": true, \"mathSymbols\": true}",
                IsSystem = true, DisplayOrder = 45, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "chart_interpretation",
                Name = "Grafik Yorumlama", Description = "Grafik/diagram analizi ve yorumlama",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"chartType\": [\"bar\", \"line\", \"pie\", \"scatter\"]}",
                IsSystem = true, DisplayOrder = 46, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "table_reading",
                Name = "Tablo Okuma", Description = "Tablo verilerini okuyup analiz etme",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"tableData\": true}",
                IsSystem = true, DisplayOrder = 47, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "scientific_experiment",
                Name = "Bilimsel Deney / Simülasyon", Description = "Sanal laboratuvar deneyi",
                AnswerType = "simulation", RequiresAnswer = true,
                ConfigSchema = "{\"labSimulation\": true, \"trackSteps\": true}",
                IsSystem = true, DisplayOrder = 48, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "logic_puzzle",
                Name = "Mantık & Bulmaca", Description = "Mantık problemleri ve bulmacalar",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"logicType\": [\"sudoku\", \"riddle\", \"pattern\"]}",
                IsSystem = true, DisplayOrder = 49, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 6) PERFORMANS & GÖREV BAZLI SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "file_upload",
                Name = "Dosya Yüklemeli Soru", Description = "Öğrenci dosya yükleyerek cevaplar",
                AnswerType = "file_upload", RequiresAnswer = true,
                ConfigSchema = "{\"allowedTypes\": [\"pdf\", \"doc\", \"jpg\", \"zip\"], \"maxSize\": 10, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 50, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "scenario_based",
                Name = "Görev Senaryosu (Scenario)", Description = "Gerçek hayat senaryosu üzerinden değerlendirme",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"scenarioText\": true, \"multipleSteps\": true, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 51, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "role_play",
                Name = "Rol Tabanlı Soru", Description = "Rol yapma görev değerlendirmesi",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"roleDescription\": true, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 52, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "case_study",
                Name = "Case Study – Vaka Analizi", Description = "Vaka incelemesi ve analiz",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"caseText\": true, \"minWords\": 200, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 53, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "project_submission",
                Name = "Proje / Doküman Teslimi", Description = "Proje çalışması teslimi",
                AnswerType = "file_upload", RequiresAnswer = true,
                ConfigSchema = "{\"allowMultipleFiles\": true, \"requiresManualGrading\": true}",
                IsSystem = true, DisplayOrder = 54, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "skill_assessment",
                Name = "Uygulamalı Görev (Skill Assessment)", Description = "Beceri ölçümü için pratik görev",
                AnswerType = "simulation", RequiresAnswer = true,
                ConfigSchema = "{\"taskBased\": true, \"trackActions\": true}",
                IsSystem = true, DisplayOrder = 55, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 7) ANKET & ÖLÇME-DEĞERLENDİRME SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "likert_scale",
                Name = "Likert Ölçeği", Description = "1-5 veya 1-7 ölçeğinde değerlendirme",
                AnswerType = "likert", MinOptions = 3, MaxOptions = 7, RequiresAnswer = true,
                ConfigSchema = "{\"scaleType\": \"likert\", \"defaultScale\": 5}",
                IsSystem = true, DisplayOrder = 56, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "rating",
                Name = "Derecelendirme (Rating)", Description = "Yıldız/puan verme sistemi",
                AnswerType = "rating", RequiresAnswer = true,
                ConfigSchema = "{\"maxRating\": 5, \"allowHalf\": true}",
                IsSystem = true, DisplayOrder = 57, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "choice_explanation",
                Name = "Seç-Ve-Neden?", Description = "Seçim + açıklama yapma",
                AnswerType = "options_with_text", MinOptions = 2, RequiresAnswer = true,
                ConfigSchema = "{\"requireExplanation\": true}",
                IsSystem = true, DisplayOrder = 58, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "emoji_rating",
                Name = "Görsel Dereceleme (Emoji Rating)", Description = "Emoji/ikon ile derecelendirme",
                AnswerType = "rating", RequiresAnswer = true,
                ConfigSchema = "{\"iconType\": \"emoji\", \"options\": 5}",
                IsSystem = true, DisplayOrder = 59, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "conditional_logic",
                Name = "Çok Basamaklı Mantıksal Akış", Description = "Koşullu sorular zinciri",
                AnswerType = "conditional", RequiresAnswer = true,
                ConfigSchema = "{\"branchingLogic\": true, \"multipleSteps\": true}",
                IsSystem = true, DisplayOrder = 60, CreatedAt = now, UpdatedAt = now, IsActive = true
            },

            // ========== 8) ÖZEL – GELİŞMİŞ / AI DESTEKLİ SORU TİPLERİ ==========
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "ai_generated",
                Name = "AI Tarafından Üretilen Soru", Description = "Yapay zeka ile otomatik soru üretimi",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"aiGenerated\": true, \"difficulty\": \"auto\"}",
                IsSystem = true, DisplayOrder = 61, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "ai_auto_grading",
                Name = "AI Otomatik Değerlendirme", Description = "AI ile otomatik puanlama",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"aiGrading\": true, \"checkSemantic\": true}",
                IsSystem = true, DisplayOrder = 62, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "ai_essay_evaluation",
                Name = "AI Cevap Geliştirme / Açık Uçlu Değ.", Description = "AI destekli kompozisyon değerlendirme",
                AnswerType = "text_long", RequiresAnswer = true,
                ConfigSchema = "{\"aiGrading\": true, \"feedbackGeneration\": true}",
                IsSystem = true, DisplayOrder = 63, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "ai_adaptive_scenario",
                Name = "AI Senaryo Değiştirme (Adaptive)", Description = "Cevaba göre senaryoyu değiştiren AI",
                AnswerType = "conditional", RequiresAnswer = true,
                ConfigSchema = "{\"aiAdaptive\": true, \"dynamicScenario\": true}",
                IsSystem = true, DisplayOrder = 64, CreatedAt = now, UpdatedAt = now, IsActive = true
            },
            new QuestionPresentationType
            {
                Id = Guid.NewGuid(), TenantId = tenantId, Code = "adaptive_difficulty",
                Name = "Adaptif Sınav (IRT - Item Response Theory)", Description = "Cevaba göre zorluk ayarlayan soru",
                AnswerType = "options", RequiresAnswer = true,
                ConfigSchema = "{\"irt\": true, \"adaptiveDifficulty\": true, \"dynamicSelection\": true}",
                IsSystem = true, DisplayOrder = 65, CreatedAt = now, UpdatedAt = now, IsActive = true
            }
        };
    }
}

