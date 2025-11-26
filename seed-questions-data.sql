-- Questions Service - Zorluk Seviyeleri ve Sunum Şekilleri
-- Önce mevcut kayıtları temizle
DELETE FROM questions_schema.question_difficulty_levels;
DELETE FROM questions_schema.question_presentation_types;
DELETE FROM questions_schema.question_format_types;
DELETE FROM questions_schema.question_pedagogical_types;

-- Zorluk Seviyeleri
INSERT INTO questions_schema.question_difficulty_levels 
("Id", "TenantId", "Code", "Name", "Description", "Level", "Color", "IsActive", "IsSystem", "DisplayOrder", "CreatedAt", "UpdatedAt")
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'very_easy', 'Çok Kolay', 'Temel seviye', 1, '#4ade80', true, true, 1, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'easy', 'Kolay', 'Kolay seviye', 2, '#86efac', true, true, 2, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'medium', 'Orta', 'Orta seviye', 3, '#fbbf24', true, true, 3, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'hard', 'Zor', 'Zor seviye', 4, '#fb923c', true, true, 4, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'very_hard', 'Çok Zor', 'İleri seviye', 5, '#ef4444', true, true, 5, NOW(), NOW());

-- Sunum Şekilleri
INSERT INTO questions_schema.question_presentation_types
("Id", "TenantId", "Code", "Name", "Description", "AnswerType", "MinOptions", "MaxOptions", "IsActive", "IsSystem", "DisplayOrder", "CreatedAt", "UpdatedAt")
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'multiple_choice', 'Çoktan Seçmeli', 'Klasik çoktan seçmeli soru', 'single', 2, 5, true, true, 1, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'multiple_answer', 'Çoklu Cevap', 'Birden fazla doğru cevap', 'multiple', 2, 8, true, true, 2, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'true_false', 'Doğru/Yanlış', 'İki şıklı soru', 'single', 2, 2, true, true, 3, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'fill_blank', 'Boşluk Doldurma', 'Boşluk doldurmalı soru', 'text', 0, 0, true, true, 4, NOW(), NOW()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'matching', 'Eşleştirme', 'Eşleştirme sorusu', 'matching', 2, 10, true, true, 5, NOW(), NOW());

SELECT 'Seed completed successfully!' as status;

