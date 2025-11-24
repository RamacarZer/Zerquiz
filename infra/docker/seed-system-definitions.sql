-- ============================================
-- DİNAMİK TANIMLAMALAR - SEED DATA
-- ============================================

\c zerquiz_db;

-- ============================================
-- 1. SORU ZORLUK SEVİYELERİ
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Color", "Icon", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('10000000-0000-0000-0000-000000000001', 'question_difficulty', 'easy', 'Kolay', 'Easy', 'Kolay', 1, '#10B981', '😊', true, false, true, NOW(), NOW(), 1),
('10000000-0000-0000-0000-000000000002', 'question_difficulty', 'medium', 'Orta', 'Medium', 'Orta', 2, '#F59E0B', '🤔', true, false, true, NOW(), NOW(), 1),
('10000000-0000-0000-0000-000000000003', 'question_difficulty', 'hard', 'Zor', 'Hard', 'Zor', 3, '#EF4444', '😤', true, false, true, NOW(), NOW(), 1),
('10000000-0000-0000-0000-000000000004', 'question_difficulty', 'expert', 'Uzman', 'Expert', 'Uzman', 4, '#8B5CF6', '🧠', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 2. SINAV MODLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Icon", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('20000000-0000-0000-0000-000000000001', 'exam_mode', 'online', 'Çevrimiçi', 'Online', 'Çevrimiçi', 1, '💻', true, false, true, NOW(), NOW(), 1),
('20000000-0000-0000-0000-000000000002', 'exam_mode', 'offline', 'Çevrimdışı', 'Offline', 'Çevrimdışı', 2, '📱', true, false, true, NOW(), NOW(), 1),
('20000000-0000-0000-0000-000000000003', 'exam_mode', 'printed', 'Matbu', 'Printed', 'Matbu', 3, '📄', true, false, true, NOW(), NOW(), 1),
('20000000-0000-0000-0000-000000000004', 'exam_mode', 'hybrid', 'Hibrit', 'Hybrid', 'Hibrit', 4, '🔀', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 3. SINAV DURUMLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Color", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('30000000-0000-0000-0000-000000000001', 'exam_status', 'draft', 'Taslak', 'Draft', 'Taslak', 1, '#6B7280', true, false, true, NOW(), NOW(), 1),
('30000000-0000-0000-0000-000000000002', 'exam_status', 'scheduled', 'Planlandı', 'Scheduled', 'Planlandı', 2, '#3B82F6', true, false, true, NOW(), NOW(), 1),
('30000000-0000-0000-0000-000000000003', 'exam_status', 'active', 'Aktif', 'Active', 'Aktif', 3, '#10B981', true, false, true, NOW(), NOW(), 1),
('30000000-0000-0000-0000-000000000004', 'exam_status', 'completed', 'Tamamlandı', 'Completed', 'Tamamlandı', 4, '#8B5CF6', true, false, true, NOW(), NOW(), 1),
('30000000-0000-0000-0000-000000000005', 'exam_status', 'cancelled', 'İptal', 'Cancelled', 'İptal', 5, '#EF4444', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 4. SORU DURUMLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Color", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('40000000-0000-0000-0000-000000000001', 'question_status', 'draft', 'Taslak', 'Draft', 'Taslak', 1, '#6B7280', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000002', 'question_status', 'review', 'İncelemede', 'In Review', 'İncelemede', 2, '#F59E0B', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000003', 'question_status', 'approved', 'Onaylandı', 'Approved', 'Onaylandı', 3, '#10B981', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000004', 'question_status', 'published', 'Yayınlandı', 'Published', 'Yayınlandı', 4, '#3B82F6', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000005', 'question_status', 'revision', 'Revizyon', 'Revision Required', 'Revizyon', 5, '#F97316', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000006', 'question_status', 'rejected', 'Reddedildi', 'Rejected', 'Reddedildi', 6, '#EF4444', true, false, true, NOW(), NOW(), 1),
('40000000-0000-0000-0000-000000000007', 'question_status', 'archived', 'Arşivlendi', 'Archived', 'Arşivlendi', 7, '#6B7280', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 5. KULLANICI DURUMLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Color", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('50000000-0000-0000-0000-000000000001', 'user_status', 'active', 'Aktif', 'Active', 'Aktif', 1, '#10B981', true, false, true, NOW(), NOW(), 1),
('50000000-0000-0000-0000-000000000002', 'user_status', 'inactive', 'Pasif', 'Inactive', 'Pasif', 2, '#6B7280', true, false, true, NOW(), NOW(), 1),
('50000000-0000-0000-0000-000000000003', 'user_status', 'suspended', 'Askıda', 'Suspended', 'Askıda', 3, '#F59E0B', true, false, true, NOW(), NOW(), 1),
('50000000-0000-0000-0000-000000000004', 'user_status', 'pending', 'Beklemede', 'Pending', 'Beklemede', 4, '#3B82F6', true, false, true, NOW(), NOW(), 1),
('50000000-0000-0000-0000-000000000005', 'user_status', 'banned', 'Yasaklı', 'Banned', 'Yasaklı', 5, '#EF4444', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 6. ÖDEME DURUMLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Color", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('60000000-0000-0000-0000-000000000001', 'payment_status', 'pending', 'Beklemede', 'Pending', 'Beklemede', 1, '#F59E0B', true, false, true, NOW(), NOW(), 1),
('60000000-0000-0000-0000-000000000002', 'payment_status', 'processing', 'İşleniyor', 'Processing', 'İşleniyor', 2, '#3B82F6', true, false, true, NOW(), NOW(), 1),
('60000000-0000-0000-0000-000000000003', 'payment_status', 'completed', 'Tamamlandı', 'Completed', 'Tamamlandı', 3, '#10B981', true, false, true, NOW(), NOW(), 1),
('60000000-0000-0000-0000-000000000004', 'payment_status', 'failed', 'Başarısız', 'Failed', 'Başarısız', 4, '#EF4444', true, false, true, NOW(), NOW(), 1),
('60000000-0000-0000-0000-000000000005', 'payment_status', 'refunded', 'İade Edildi', 'Refunded', 'İade Edildi', 5, '#8B5CF6', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 7. ASSET TİPLERİ
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Icon", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('70000000-0000-0000-0000-000000000001', 'asset_type', 'image', 'Görsel', 'Image', 'Görsel', 1, '🖼️', true, false, true, NOW(), NOW(), 1),
('70000000-0000-0000-0000-000000000002', 'asset_type', 'audio', 'Ses', 'Audio', 'Ses', 2, '🎵', true, false, true, NOW(), NOW(), 1),
('70000000-0000-0000-0000-000000000003', 'asset_type', 'video', 'Video', 'Video', 'Video', 3, '🎬', true, false, true, NOW(), NOW(), 1),
('70000000-0000-0000-0000-000000000004', 'asset_type', 'document', 'Doküman', 'Document', 'Doküman', 4, '📄', true, false, true, NOW(), NOW(), 1),
('70000000-0000-0000-0000-000000000005', 'asset_type', 'latex', 'LaTeX', 'LaTeX', 'LaTeX', 5, '🧮', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 8. DİL KODLARI
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "Icon", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('80000000-0000-0000-0000-000000000001', 'language', 'tr', 'Türkçe', 'Turkish', 'Türkçe', 1, '🇹🇷', true, false, true, NOW(), NOW(), 1),
('80000000-0000-0000-0000-000000000002', 'language', 'en', 'English', 'English', 'İngilizce', 2, '🇬🇧', true, false, true, NOW(), NOW(), 1),
('80000000-0000-0000-0000-000000000003', 'language', 'ar', 'العربية', 'Arabic', 'Arapça', 3, '🇸🇦', true, false, true, NOW(), NOW(), 1),
('80000000-0000-0000-0000-000000000004', 'language', 'de', 'Deutsch', 'German', 'Almanca', 4, '🇩🇪', true, false, true, NOW(), NOW(), 1),
('80000000-0000-0000-0000-000000000005', 'language', 'fr', 'Français', 'French', 'Fransızca', 5, '🇫🇷', true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

-- ============================================
-- 9. PARA BİRİMLERİ
-- ============================================
INSERT INTO core_schema.system_definitions 
("Id", "Category", "Code", "Name", "NameEn", "NameTr", "DisplayOrder", "ConfigurationJson", "IsSystemReserved", "IsEditable", "IsActive", "CreatedAt", "UpdatedAt", "Version")
VALUES
('90000000-0000-0000-0000-000000000001', 'currency', 'TRY', 'Türk Lirası', 'Turkish Lira', 'Türk Lirası', 1, '{"symbol": "₺", "decimals": 2}'::jsonb, true, false, true, NOW(), NOW(), 1),
('90000000-0000-0000-0000-000000000002', 'currency', 'USD', 'US Dollar', 'US Dollar', 'Amerikan Doları', 2, '{"symbol": "$", "decimals": 2}'::jsonb, true, false, true, NOW(), NOW(), 1),
('90000000-0000-0000-0000-000000000003', 'currency', 'EUR', 'Euro', 'Euro', 'Euro', 3, '{"symbol": "€", "decimals": 2}'::jsonb, true, false, true, NOW(), NOW(), 1),
('90000000-0000-0000-0000-000000000004', 'currency', 'GBP', 'British Pound', 'British Pound', 'İngiliz Sterlini', 4, '{"symbol": "£", "decimals": 2}'::jsonb, true, false, true, NOW(), NOW(), 1),
('90000000-0000-0000-0000-000000000005', 'currency', 'SAR', 'Saudi Riyal', 'Saudi Riyal', 'Suudi Riyali', 5, '{"symbol": "﷼", "decimals": 2}'::jsonb, true, false, true, NOW(), NOW(), 1)
ON CONFLICT ("Id") DO UPDATE SET "Name" = EXCLUDED."Name", "UpdatedAt" = NOW();

SELECT '✅ Dinamik tanımlamalar seed data yüklendi!' AS result;
SELECT COUNT(*) || ' adet tanımlama oluşturuldu.' AS result FROM core_schema.system_definitions;
