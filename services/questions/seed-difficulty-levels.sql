-- Insert Question Difficulty Levels
INSERT INTO questions_schema.question_difficulty_levels 
  ("Id", "TenantId", "Code", "Name", "Description", "Level", "Color", "CreatedAt", "UpdatedAt", "IsActive", "IsSystem", "DisplayOrder")
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'very_easy', 'Çok Kolay', 'Temel seviye sorular', 1, '#4ade80', NOW(), NOW(), true, true, 1),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'easy', 'Kolay', 'Kolay seviye sorular', 2, '#86efac', NOW(), NOW(), true, true, 2),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'medium', 'Orta', 'Orta seviye sorular', 3, '#fbbf24', NOW(), NOW(), true, true, 3),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'hard', 'Zor', 'Zor seviye sorular', 4, '#fb923c', NOW(), NOW(), true, true, 4),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'very_hard', 'Çok Zor', 'İleri seviye sorular', 5, '#ef4444', NOW(), NOW(), true, true, 5)
ON CONFLICT ("Code") DO NOTHING;

