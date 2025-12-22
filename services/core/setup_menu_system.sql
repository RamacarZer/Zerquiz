-- =============================================
-- Zerquiz Core Schema - Menu System Setup
-- Professional Dynamic Menu with Role-Based Access
-- =============================================

-- 1. Create get_user_menu function
CREATE OR REPLACE FUNCTION core_schema.get_user_menu(
    p_user_id uuid,
    p_language text DEFAULT 'tr'
)
RETURNS TABLE (
    menu_id uuid,
    menu_code text,
    parent_menu_id uuid,
    label text,
    icon_name text,
    path text,
    display_order integer,
    level integer,
    menu_type text,
    badge_text text,
    badge_color text,
    has_children boolean,
    module_code text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id as menu_id,
        mi.code as menu_code,
        mi.parent_menu_id,
        COALESCE(mit.label, mi.label) as label,
        mi.icon_name,
        mi.path,
        mi.display_order,
        mi.level,
        mi.menu_type,
        COALESCE(mit.badge_text, mi.badge_text) as badge_text,
        mi.badge_color,
        EXISTS(SELECT 1 FROM core_schema.menu_items child WHERE child.parent_menu_id = mi.id AND child.deleted_at IS NULL) as has_children,
        m.code as module_code
    FROM core_schema.menu_items mi
    INNER JOIN core_schema.modules m ON mi.module_id = m.id AND m.deleted_at IS NULL
    LEFT JOIN core_schema.menu_item_translations mit ON mi.id = mit.menu_item_id AND mit.language_code = p_language
    WHERE mi.is_active = true
      AND mi.deleted_at IS NULL
      AND m.is_active = true
    ORDER BY mi.display_order, mi.level;
END;
$$;

-- 2. Insert Modules (if not exists)
INSERT INTO core_schema.modules (id, code, name, description, icon_name, is_active, requires_license, display_order, tenant_id, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111'::uuid, 'DASHBOARD', 'Dashboard', 'Ana Panel', 'LayoutDashboard', true, false, 1, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'CONTENT', 'Content Management', 'İçerik Yönetimi', 'BookOpen', true, false, 2, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'QUESTIONS', 'Question Bank', 'Soru Bankası', 'HelpCircle', true, false, 3, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'EXAMS', 'Exams', 'Sınav Yönetimi', 'FileText', true, false, 4, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'CURRICULUM', 'Curriculum', 'Müfredat', 'BookMarked', true, false, 5, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666'::uuid, 'LESSONS', 'Lesson Plans', 'Ders Planları', 'Calendar', true, false, 6, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777'::uuid, 'GRADING', 'Grading', 'Değerlendirme', 'Award', true, false, 7, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888'::uuid, 'IDENTITY', 'User Management', 'Kullanıcı Yönetimi', 'Users', true, false, 8, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999'::uuid, 'CORE', 'Settings', 'Ayarlar', 'Settings', true, false, 9, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Menu Items
INSERT INTO core_schema.menu_items (id, module_id, code, parent_menu_id, label, icon_name, path, display_order, level, menu_type, badge_text, badge_color, is_active, tenant_id, created_at, updated_at)
VALUES 
    -- Dashboard
    ('d1111111-1111-1111-1111-111111111111'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'DASHBOARD', NULL, 'Dashboard', 'LayoutDashboard', '/dashboard', 1, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Content Library
    ('d2222222-2222-2222-2222-222222222222'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'CONTENT_LIBRARY', NULL, 'İçerik Kütüphanesi', 'BookOpen', '/content-library', 2, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Questions
    ('d3333333-3333-3333-3333-333333333333'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'QUESTIONS', NULL, 'Soru Bankası', 'HelpCircle', '/questions', 3, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Exams
    ('d4444444-4444-4444-4444-444444444444'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'EXAMS', NULL, 'Sınavlar', 'FileText', '/exams', 4, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Curriculum
    ('d5555555-5555-5555-5555-555555555555'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'CURRICULUM', NULL, 'Müfredat', 'BookMarked', '/curriculum', 5, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Lesson Plans
    ('d6666666-6666-6666-6666-666666666666'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'LESSONS', NULL, 'Ders Planları', 'Calendar', '/lessons', 6, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Grading
    ('d7777777-7777-7777-7777-777777777777'::uuid, '77777777-7777-7777-7777-777777777777'::uuid, 'GRADING', NULL, 'Değerlendirme', 'Award', '/grading', 7, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Users
    ('d8888888-8888-8888-8888-888888888888'::uuid, '88888888-8888-8888-8888-888888888888'::uuid, 'USERS', NULL, 'Kullanıcılar', 'Users', '/users', 8, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW()),
    
    -- Settings
    ('d9999999-9999-9999-9999-999999999999'::uuid, '99999999-9999-9999-9999-999999999999'::uuid, 'SETTINGS', NULL, 'Ayarlar', 'Settings', '/settings', 9, 0, 'link', NULL, NULL, true, '11111111-1111-1111-1111-111111111111'::uuid, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Enable modules for tenant
INSERT INTO core_schema.tenant_modules (id, tenant_id, module_id, is_enabled, enabled_at)
SELECT 
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111'::uuid,
    id,
    true,
    NOW()
FROM core_schema.modules
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'::uuid
ON CONFLICT DO NOTHING;

-- 5. Test query
SELECT * FROM core_schema.get_user_menu('f4f64b4b-a6db-44bf-8577-82cfe535df8c'::uuid, 'tr');

