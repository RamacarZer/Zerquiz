-- Seed Departments
INSERT INTO identity_schema.departments ("Id", "Code", "Name", "Description", "ParentDepartmentId", "DisplayOrder", "TenantId", "CreatedAt", "UpdatedAt", "IsActive", "Version")
VALUES
('a0000000-0000-0000-0000-000000000001', 'EGITIM', 'Eğitim Departmanı', 'Tüm eğitim kadrosu', NULL, 1, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('a0000000-0000-0000-0000-000000000002', 'ÖLÇME_DEG', 'Ölçme ve Değerlendirme', 'Sınav ve değerlendirme birimi', NULL, 2, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('a0000000-0000-0000-0000-000000000003', 'YONETIM', 'Yönetim', 'İdari kadro', NULL, 3, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('a0000000-0000-0000-0000-000000000004', 'YAYIN', 'Yayın Departmanı', 'İçerik yayın ve telif yönetimi', NULL, 4, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1)
ON CONFLICT ("Id") DO UPDATE SET "UpdatedAt" = NOW();

-- Seed Positions  
INSERT INTO identity_schema.positions ("Id", "Code", "Name", "Description", "Level", "DisplayOrder", "TenantId", "CreatedAt", "UpdatedAt", "IsActive", "Version")
VALUES
-- Yönetim Seviyeleri
('b0000000-0000-0000-0000-000000000001', 'MUDUR', 'Müdür', 'Kurum müdürü', 1, 1, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-000000000002', 'MUDUR_YRD', 'Müdür Yardımcısı', 'Müdür yardımcısı', 2, 2, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),

-- Koordinatörler
('b0000000-0000-0000-0000-000000000003', 'SINAV_KOOR', 'Sınav Koordinatörü', 'Sınav süreçlerini yöneten koordinatör', 3, 3, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-000000000004', 'YAYIN_KOOR', 'Yayın Koordinatörü', 'İçerik yayın koordinatörü', 3, 4, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-000000000005', 'EGITIM_KOOR', 'Eğitim Koordinatörü', 'Eğitim programları koordinatörü', 3, 5, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),

-- Zümre ve Öğretmenler
('b0000000-0000-0000-0000-000000000006', 'ZUMRE_BSK', 'Zümre Başkanı', 'Branş zümre başkanı', 4, 6, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-000000000007', 'OGRETMEN', 'Öğretmen', 'Branş öğretmeni', 5, 7, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),

-- Yazarlar ve İçerik Üreticiler
('b0000000-0000-0000-0000-000000000008', 'YAZAR', 'Yazar', 'Soru ve içerik yazarı', 5, 8, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-000000000009', 'EDİTOR', 'Editör', 'İçerik editörü', 4, 9, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),

-- Öğrenci ve Veli
('b0000000-0000-0000-0000-00000000000a', 'OGRENCI', 'Öğrenci', 'Öğrenci', 10, 10, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1),
('b0000000-0000-0000-0000-00000000000b', 'VELI', 'Veli', 'Öğrenci velisi', 10, 11, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), true, 1)
ON CONFLICT ("Id") DO UPDATE SET "UpdatedAt" = NOW();

