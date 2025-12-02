-- =====================================================
-- SEED: Dynamic Menu System Initial Data
-- Tarih: 2025-12-01
-- Mevcut menüleri database'e taşıma
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    
    -- Module IDs
    mod_dashboard UUID;
    mod_content UUID;
    mod_questions UUID;
    mod_teaching UUID;
    mod_analytics UUID;
    mod_ai UUID;
    mod_admin UUID;
    mod_finance UUID;
    mod_system UUID;
    
    -- Menu IDs
    menu_dashboard UUID;
    menu_content_parent UUID;
    menu_questions_parent UUID;
    menu_teaching_parent UUID;
    menu_analytics_parent UUID;
    menu_ai_parent UUID;
    menu_admin_parent UUID;
    
    -- Role IDs
    role_superadmin UUID;
    role_tenantadmin UUID;
    role_teacher UUID;
    role_student UUID;
BEGIN
    -- Get admin user
    SELECT "Id" INTO admin_user_id FROM identity_schema.users WHERE "Email" = 'admin@zerquiz.com' LIMIT 1;
    
    -- Get role IDs
    SELECT "Id" INTO role_superadmin FROM identity_schema.roles WHERE "Name" = 'SuperAdmin';
    SELECT "Id" INTO role_tenantadmin FROM identity_schema.roles WHERE "Name" = 'TenantAdmin';
    SELECT "Id" INTO role_teacher FROM identity_schema.roles WHERE "Name" = 'Teacher';
    SELECT "Id" INTO role_student FROM identity_schema.roles WHERE "Name" = 'Student';

    RAISE NOTICE 'Starting menu system seed...';

    -- ============================================
    -- STEP 1: Create Modules
    -- ============================================
    
    -- Dashboard Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('dashboard', 'Dashboard', 'Main dashboard and overview', 'LayoutDashboard', 1, true, admin_user_id)
    RETURNING "Id" INTO mod_dashboard;

    -- Content Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('content', 'Content Management', 'Content library, upload, and media management', 'FolderOpen', 2, true, admin_user_id)
    RETURNING "Id" INTO mod_content;

    -- Questions Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('questions', 'Questions & Exams', 'Question bank, exams, and grading', 'HelpCircle', 3, true, admin_user_id)
    RETURNING "Id" INTO mod_questions;

    -- Teaching Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('teaching', 'Teaching & Learning', 'Lesson plans, courses, assignments', 'BookOpen', 4, true, admin_user_id)
    RETURNING "Id" INTO mod_teaching;

    -- Analytics Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('analytics', 'Analytics & Reports', 'Student progress, reports, dashboards', 'BarChart3', 5, true, admin_user_id)
    RETURNING "Id" INTO mod_analytics;

    -- AI Tools Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "RequiresLicense", "IsSystemReserved", "CreatedBy")
    VALUES ('ai_tools', 'AI Tools', 'AI-powered content generation and assistants', 'Sparkles', 6, true, true, admin_user_id)
    RETURNING "Id" INTO mod_ai;

    -- Administration Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('administration', 'Administration', 'User, tenant, and role management', 'Shield', 7, true, admin_user_id)
    RETURNING "Id" INTO mod_admin;

    -- Finance Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "RequiresLicense", "IsSystemReserved", "CreatedBy")
    VALUES ('finance', 'Finance & Licenses', 'Invoices, subscriptions, royalties', 'DollarSign', 8, true, true, admin_user_id)
    RETURNING "Id" INTO mod_finance;

    -- System Module
    INSERT INTO core_schema.modules ("Code", "Name", "Description", "IconName", "DisplayOrder", "IsSystemReserved", "CreatedBy")
    VALUES ('system', 'System Settings', 'System configuration, integrations, monitoring', 'Settings', 9, true, admin_user_id)
    RETURNING "Id" INTO mod_system;

    RAISE NOTICE '✅ Modules created';

    -- ============================================
    -- STEP 2: Create Menu Items
    -- ============================================

    -- 1. DASHBOARD (Top Level)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_dashboard', mod_dashboard, 'dashboard', 'LayoutDashboard', '/dashboard', 1, 0, 'link', true, admin_user_id)
    RETURNING "Id" INTO menu_dashboard;

    -- 2. CONTENT MANAGEMENT (Parent)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_content', mod_content, 'contentManagement', 'FolderOpen', NULL, 2, 0, 'dropdown', true, admin_user_id)
    RETURNING "Id" INTO menu_content_parent;

    -- Content children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_content_library', mod_content, menu_content_parent, 'content_library', 'FileText', '/content-library', 1, 1, 'link', admin_user_id),
        ('menu_content_upload', mod_content, menu_content_parent, 'uploadContent', 'Upload', '/content/upload', 2, 1, 'link', admin_user_id),
        ('menu_media_library', mod_content, menu_content_parent, 'mediaLibrary', 'Image', '/content/media', 3, 1, 'link', admin_user_id);

    -- 3. QUESTIONS & EXAMS (Parent)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "BadgeText", "BadgeColor", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_questions', mod_questions, 'questionsAndExams', 'HelpCircle', NULL, 3, 0, 'dropdown', 'NEW', 'blue', true, admin_user_id)
    RETURNING "Id" INTO menu_questions_parent;

    -- Questions children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_question_create', mod_questions, menu_questions_parent, 'createQuestion', 'Plus', '/questions/mode-select', 1, 1, 'link', admin_user_id),
        ('menu_question_bank', mod_questions, menu_questions_parent, 'questionBank', 'Database', '/questions', 2, 1, 'link', admin_user_id),
        ('menu_exams', mod_questions, menu_questions_parent, 'exams', 'FileCheck', '/exams', 3, 1, 'link', admin_user_id),
        ('menu_grading', mod_questions, menu_questions_parent, 'grading', 'GraduationCap', '/grading', 4, 1, 'link', admin_user_id);

    -- 4. TEACHING & LEARNING (Parent)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_teaching', mod_teaching, 'teachingAndLearning', 'BookOpen', NULL, 4, 0, 'dropdown', true, admin_user_id)
    RETURNING "Id" INTO menu_teaching_parent;

    -- Teaching children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_lesson_plans', mod_teaching, menu_teaching_parent, 'lesson_plans', 'Calendar', '/lesson-plans', 1, 1, 'link', admin_user_id),
        ('menu_lesson_templates', mod_teaching, menu_teaching_parent, 'lesson_templates', 'Library', '/lesson-templates', 2, 1, 'link', admin_user_id),
        ('menu_assignments', mod_teaching, menu_teaching_parent, 'assignments', 'ClipboardList', '/assignments', 3, 1, 'link', admin_user_id),
        ('menu_courses', mod_teaching, menu_teaching_parent, 'courses', 'BookMarked', '/courses', 4, 1, 'link', admin_user_id);

    -- 5. ANALYTICS (Parent)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_analytics', mod_analytics, 'analyticsAndReports', 'BarChart3', NULL, 5, 0, 'dropdown', true, admin_user_id)
    RETURNING "Id" INTO menu_analytics_parent;

    -- Analytics children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_student_progress', mod_analytics, menu_analytics_parent, 'student_progress', 'TrendingUp', '/analytics/student-progress', 1, 1, 'link', admin_user_id),
        ('menu_learning_style', mod_analytics, menu_analytics_parent, 'learning_style', 'Brain', '/analytics/learning-style', 2, 1, 'link', admin_user_id),
        ('menu_classroom_dashboard', mod_analytics, menu_analytics_parent, 'classroom_dashboard', 'Users', '/analytics/classroom-dashboard', 3, 1, 'link', admin_user_id);

    -- 6. AI TOOLS (Parent)
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "BadgeText", "BadgeColor", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_ai_tools', mod_ai, 'aiTools', 'Sparkles', NULL, 6, 0, 'dropdown', 'AI', 'purple', true, admin_user_id)
    RETURNING "Id" INTO menu_ai_parent;

    -- AI Tools children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_ai_question_gen', mod_ai, menu_ai_parent, 'aiQuestionGenerator', 'Wand2', '/questions/generator', 1, 1, 'link', admin_user_id),
        ('menu_ai_content_gen', mod_ai, menu_ai_parent, 'aiContentGenerator', 'FileEdit', '/ai/content-generator', 2, 1, 'link', admin_user_id),
        ('menu_writing_assistant', mod_ai, menu_ai_parent, 'writing_assistant', 'PenTool', '/ai/writing-assistant', 3, 1, 'link', admin_user_id);

    -- 7. ADMINISTRATION (Parent) - SuperAdmin & TenantAdmin only
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsSystemReserved", "CreatedBy")
    VALUES ('menu_admin', mod_admin, 'administration', 'Shield', NULL, 7, 0, 'dropdown', true, admin_user_id)
    RETURNING "Id" INTO menu_admin_parent;

    -- Admin children
    INSERT INTO core_schema.menu_items ("Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "CreatedBy")
    VALUES 
        ('menu_tenants', mod_admin, menu_admin_parent, 'tenant_management', 'Building', '/admin/tenants', 1, 1, 'link', admin_user_id),
        ('menu_users', mod_admin, menu_admin_parent, 'user_management', 'Users', '/admin/users', 2, 1, 'link', admin_user_id),
        ('menu_roles', mod_admin, menu_admin_parent, 'roles_permissions', 'Key', '/admin/roles', 3, 1, 'link', admin_user_id);

    RAISE NOTICE '✅ Menu items created';

    -- ============================================
    -- STEP 3: Assign Menu Permissions to Roles
    -- ============================================

    -- Dashboard - All roles
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT menu_dashboard, r."Id", true, true, admin_user_id
    FROM identity_schema.roles r
    WHERE r."Name" IN ('SuperAdmin', 'TenantAdmin', 'Teacher', 'Student');

    -- Content - SuperAdmin, TenantAdmin, Teacher
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_content
      AND r."Name" IN ('SuperAdmin', 'TenantAdmin', 'Teacher');

    -- Questions - SuperAdmin, TenantAdmin, Teacher (Student can view exams only)
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_questions
      AND r."Name" IN ('SuperAdmin', 'TenantAdmin', 'Teacher');

    -- Teaching - SuperAdmin, TenantAdmin, Teacher
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_teaching
      AND r."Name" IN ('SuperAdmin', 'TenantAdmin', 'Teacher');

    -- Analytics - All roles
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_analytics;

    -- AI Tools - SuperAdmin, TenantAdmin, Teacher
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_ai
      AND r."Name" IN ('SuperAdmin', 'TenantAdmin', 'Teacher');

    -- Administration - SuperAdmin, TenantAdmin only
    INSERT INTO core_schema.menu_permissions ("MenuItemId", "RoleId", "CanView", "CanAccess", "CreatedBy")
    SELECT m."Id", r."Id", true, true, admin_user_id
    FROM core_schema.menu_items m
    CROSS JOIN identity_schema.roles r
    WHERE m."ModuleId" = mod_admin
      AND r."Name" IN ('SuperAdmin', 'TenantAdmin');

    RAISE NOTICE '✅ Menu permissions assigned';

    -- ============================================
    -- STEP 4: Enable All Modules for Admin's Tenant
    -- ============================================

    -- Enable all modules for admin user's tenant
    INSERT INTO core_schema.tenant_modules ("TenantId", "ModuleId", "IsEnabled", "EnabledAt", "CreatedBy")
    SELECT 
        u."TenantId",
        m."Id",
        true,
        NOW(),
        admin_user_id
    FROM identity_schema.users u
    CROSS JOIN core_schema.modules m
    WHERE u."Email" = 'admin@zerquiz.com'
      AND u."TenantId" IS NOT NULL
    ON CONFLICT ("TenantId", "ModuleId") DO NOTHING;

    RAISE NOTICE '✅ Modules enabled for admin tenant';
    RAISE NOTICE '🎉 DYNAMIC MENU SYSTEM SEEDED SUCCESSFULLY!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Menu seed failed: %', SQLERRM;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Count modules
SELECT 'Modules' as type, COUNT(*) as count FROM core_schema.modules;

-- Count menu items
SELECT 'Menu Items' as type, COUNT(*) as count FROM core_schema.menu_items;

-- Count permissions
SELECT 'Menu Permissions' as type, COUNT(*) as count FROM core_schema.menu_permissions;

-- Show menu structure
SELECT 
    m."Code",
    m."LabelKey",
    m."Level",
    m."MenuType",
    COALESCE(p."Code", 'ROOT') as parent,
    mod."Code" as module
FROM core_schema.menu_items m
LEFT JOIN core_schema.menu_items p ON p."Id" = m."ParentMenuId"
LEFT JOIN core_schema.modules mod ON mod."Id" = m."ModuleId"
ORDER BY m."DisplayOrder", m."Level";

