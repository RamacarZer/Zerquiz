-- =====================================================
-- MENU SYSTEM: ROLE-BASED USER-FRIENDLY STRUCTURE
-- =====================================================
-- This script creates a well-organized menu structure
-- with proper role-based permissions
-- =====================================================

-- First, clear existing menu data
TRUNCATE TABLE core_schema.menu_permissions CASCADE;
TRUNCATE TABLE core_schema.menu_item_translations CASCADE;
TRUNCATE TABLE core_schema.menu_items CASCADE;

-- =====================================================
-- COMMON MENUS (All Users)
-- =====================================================

-- Dashboard
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_DASHBOARD', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'DASHBOARD'), 
 NULL, 'Dashboard', 'LayoutDashboard', '/dashboard', 1, 0, 'link', true, true);

-- =====================================================
-- STUDENT ROLE MENUS
-- =====================================================

-- My Courses
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_MY_COURSES', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CONTENT'), 
 NULL, 'My Courses', 'BookOpen', '/my-courses', 2, 0, 'link', true, true);

-- My Exams
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_MY_EXAMS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'EXAMS'), 
 NULL, 'My Exams', 'FileText', '/my-exams', 3, 0, 'link', true, true);

-- My Assignments
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_MY_ASSIGNMENTS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CONTENT'), 
 NULL, 'My Assignments', 'ClipboardList', '/assignments', 4, 0, 'link', true, true);

-- My Progress
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive", "BadgeColor")
VALUES 
(gen_random_uuid(), 'MENU_MY_PROGRESS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'ANALYTICS'), 
 NULL, 'My Progress', 'TrendingUp', '/analytics/student-progress', 5, 0, 'link', true, true, 'blue');

-- =====================================================
-- TEACHER ROLE MENUS
-- =====================================================

-- Group: Content Management
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GROUP_CONTENT', NULL, NULL, 'Content Management', 'FolderOpen', NULL, 10, 0, 'group', true, true);

-- Content Library (Parent)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_CONTENT_LIBRARY', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CONTENT'), 
 NULL, 'Content Library', 'BookOpen', '/content-library', 11, 0, 'dropdown', true, true);

-- Content Library > Browse
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_CONTENT_BROWSE', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CONTENT'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_CONTENT_LIBRARY'), 
 'Browse Content', 'Search', '/content-library', 1, 1, 'link', true, true);

-- Content Library > Create New
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive", "BadgeText", "BadgeColor")
VALUES 
(gen_random_uuid(), 'MENU_CONTENT_CREATE', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CONTENT'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_CONTENT_LIBRARY'), 
 'Create Content', 'Plus', '/content-library/create', 2, 1, 'link', true, true, 'NEW', 'green');

-- Curriculum
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_CURRICULUM', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CURRICULUM'), 
 NULL, 'Curriculum', 'BookMarked', '/curriculum', 12, 0, 'link', true, true);

-- Lesson Plans
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_LESSON_PLANS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'LESSONS'), 
 NULL, 'Lesson Plans', 'Calendar', '/lessons', 13, 0, 'link', true, true);

-- Divider
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_DIVIDER_1', NULL, NULL, 'Divider', NULL, NULL, 19, 0, 'divider', true, true);

-- Group: Assessment
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GROUP_ASSESSMENT', NULL, NULL, 'Assessment', 'ClipboardList', NULL, 20, 0, 'group', true, true);

-- Questions (Parent)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive", "BadgeText", "BadgeColor")
VALUES 
(gen_random_uuid(), 'MENU_QUESTIONS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'QUESTIONS'), 
 NULL, 'Questions', 'HelpCircle', '/questions', 21, 0, 'dropdown', true, true, 'AI', 'purple');

-- Questions > Question Bank
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_QUESTION_BANK', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'QUESTIONS'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_QUESTIONS'), 
 'Question Bank', 'Database', '/questions', 1, 1, 'link', true, true);

-- Questions > AI Generator
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive", "BadgeText", "BadgeColor")
VALUES 
(gen_random_uuid(), 'MENU_QUESTION_GENERATOR', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'AI_TOOLS'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_QUESTIONS'), 
 'AI Generator', 'Sparkles', '/questions/generator', 2, 1, 'link', true, true, 'AI', 'purple');

-- Exams (Parent)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_EXAMS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'EXAMS'), 
 NULL, 'Exams', 'FileText', '/exams', 22, 0, 'dropdown', true, true);

-- Exams > All Exams
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_EXAMS_LIST', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'EXAMS'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_EXAMS'), 
 'All Exams', 'List', '/exams', 1, 1, 'link', true, true);

-- Exams > Create Exam
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_EXAMS_CREATE', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'EXAMS'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_EXAMS'), 
 'Create Exam', 'FileEdit', '/exams/create', 2, 1, 'link', true, true);

-- Grading
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GRADING', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'GRADING'), 
 NULL, 'Grading', 'Award', '/grading', 23, 0, 'link', true, true);

-- Divider
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_DIVIDER_2', NULL, NULL, 'Divider', NULL, NULL, 29, 0, 'divider', true, true);

-- Group: AI Tools
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GROUP_AI_TOOLS', NULL, NULL, 'AI Tools', 'Sparkles', NULL, 30, 0, 'group', true, true);

-- AI Content Generator
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive", "BadgeText", "BadgeColor")
VALUES 
(gen_random_uuid(), 'MENU_AI_GENERATOR', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'AI_TOOLS'), 
 NULL, 'AI Generator', 'Wand2', '/ai-generate', 31, 0, 'link', true, true, 'NEW', 'purple');

-- AI Assistants (Parent)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_AI_ASSISTANTS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'AI_TOOLS'), 
 NULL, 'AI Assistants', 'Brain', '/ai-assistants', 32, 0, 'dropdown', true, true);

-- AI Assistants > Writing Assistant
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_AI_WRITING', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'AI_TOOLS'), 
 (SELECT "Id" FROM core_schema.menu_items WHERE "Code" = 'MENU_AI_ASSISTANTS'), 
 'Writing Assistant', 'PenTool', '/ai-assistants/writing', 1, 1, 'link', true, true);

-- Divider
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_DIVIDER_3', NULL, NULL, 'Divider', NULL, NULL, 39, 0, 'divider', true, true);

-- Group: Analytics & Reports
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GROUP_ANALYTICS', NULL, NULL, 'Analytics', 'BarChart3', NULL, 40, 0, 'group', true, true);

-- Class Analytics
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_CLASS_ANALYTICS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'ANALYTICS'), 
 NULL, 'Class Analytics', 'Users', '/analytics/classroom-dashboard', 41, 0, 'link', true, true);

-- Reports
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_REPORTS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'ANALYTICS'), 
 NULL, 'Reports', 'FileBarChart', '/reports', 42, 0, 'link', true, true);

-- =====================================================
-- ADMIN ROLE MENUS
-- =====================================================

-- Divider
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_DIVIDER_4', NULL, NULL, 'Divider', NULL, NULL, 49, 0, 'divider', true, true);

-- Group: Administration
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_GROUP_ADMIN', NULL, NULL, 'Administration', 'Shield', NULL, 50, 0, 'group', true, true);

-- User Management
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_USER_MANAGEMENT', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'IDENTITY'), 
 NULL, 'Users', 'Users', '/users', 51, 0, 'link', true, true);

-- Tenant Settings (TenantAdmin only)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_TENANT_SETTINGS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'TENANTS'), 
 NULL, 'Tenant Settings', 'Building', '/tenant/settings', 52, 0, 'link', true, true);

-- System Settings (SuperAdmin only)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_SYSTEM_SETTINGS', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'CORE'), 
 NULL, 'System Settings', 'Settings', '/settings', 53, 0, 'link', true, true);

-- Licensing (SuperAdmin only)
INSERT INTO core_schema.menu_items 
("Id", "Code", "ModuleId", "ParentMenuId", "LabelKey", "IconName", "Path", "DisplayOrder", "Level", "MenuType", "IsVisible", "IsActive")
VALUES 
(gen_random_uuid(), 'MENU_LICENSING', 
 (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'LICENSING'), 
 NULL, 'Licensing', 'Key', '/licensing', 54, 0, 'link', true, true);

-- =====================================================
-- ROLE-BASED PERMISSIONS
-- =====================================================

-- Get role IDs
DO $$
DECLARE
    v_student_role_id UUID;
    v_teacher_role_id UUID;
    v_tenant_admin_role_id UUID;
    v_super_admin_role_id UUID;
BEGIN
    SELECT "Id" INTO v_student_role_id FROM identity_schema.roles WHERE "Name" = 'Student';
    SELECT "Id" INTO v_teacher_role_id FROM identity_schema.roles WHERE "Name" = 'Teacher';
    SELECT "Id" INTO v_tenant_admin_role_id FROM identity_schema.roles WHERE "Name" = 'TenantAdmin';
    SELECT "Id" INTO v_super_admin_role_id FROM identity_schema.roles WHERE "Name" = 'SuperAdmin';

    -- Dashboard - All roles
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), "Id", v_student_role_id, true, true
    FROM core_schema.menu_items WHERE "Code" = 'MENU_DASHBOARD';
    
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), "Id", v_teacher_role_id, true, true
    FROM core_schema.menu_items WHERE "Code" = 'MENU_DASHBOARD';
    
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), "Id", v_tenant_admin_role_id, true, true
    FROM core_schema.menu_items WHERE "Code" = 'MENU_DASHBOARD';
    
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), "Id", v_super_admin_role_id, true, true
    FROM core_schema.menu_items WHERE "Code" = 'MENU_DASHBOARD';

    -- Student-only menus
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), m."Id", v_student_role_id, true, true
    FROM core_schema.menu_items m
    WHERE m."Code" IN ('MENU_MY_COURSES', 'MENU_MY_EXAMS', 'MENU_MY_ASSIGNMENTS', 'MENU_MY_PROGRESS');

    -- Teacher menus (includes most features)
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), m."Id", v_teacher_role_id, true, true
    FROM core_schema.menu_items m
    WHERE m."Code" LIKE 'MENU_GROUP_%' 
       OR m."Code" LIKE 'MENU_CONTENT_%'
       OR m."Code" LIKE 'MENU_CURRICULUM%'
       OR m."Code" LIKE 'MENU_LESSON_%'
       OR m."Code" LIKE 'MENU_QUESTION_%'
       OR m."Code" = 'MENU_QUESTIONS'
       OR m."Code" LIKE 'MENU_EXAMS%'
       OR m."Code" = 'MENU_GRADING'
       OR m."Code" LIKE 'MENU_AI_%'
       OR m."Code" = 'MENU_CLASS_ANALYTICS'
       OR m."Code" = 'MENU_REPORTS'
       OR m."Code" = 'MENU_USER_MANAGEMENT';

    -- TenantAdmin menus (same as teacher + tenant settings)
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), m."Id", v_tenant_admin_role_id, true, true
    FROM core_schema.menu_items m
    WHERE m."Code" LIKE 'MENU_GROUP_%' 
       OR m."Code" LIKE 'MENU_CONTENT_%'
       OR m."Code" LIKE 'MENU_CURRICULUM%'
       OR m."Code" LIKE 'MENU_LESSON_%'
       OR m."Code" LIKE 'MENU_QUESTION_%'
       OR m."Code" = 'MENU_QUESTIONS'
       OR m."Code" LIKE 'MENU_EXAMS%'
       OR m."Code" = 'MENU_GRADING'
       OR m."Code" LIKE 'MENU_AI_%'
       OR m."Code" = 'MENU_CLASS_ANALYTICS'
       OR m."Code" = 'MENU_REPORTS'
       OR m."Code" = 'MENU_USER_MANAGEMENT'
       OR m."Code" = 'MENU_TENANT_SETTINGS';

    -- SuperAdmin sees everything (no restrictions, but let's add explicitly)
    INSERT INTO core_schema.menu_permissions ("Id", "MenuItemId", "RoleId", "CanView", "CanAccess")
    SELECT gen_random_uuid(), m."Id", v_super_admin_role_id, true, true
    FROM core_schema.menu_items m
    WHERE m."MenuType" IN ('link', 'dropdown');

END $$;

-- =====================================================
-- TRANSLATIONS (Turkish)
-- =====================================================

-- Dashboard
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Ana Sayfa'
FROM core_schema.menu_items WHERE "Code" = 'MENU_DASHBOARD';

-- Student menus
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Derslerim'
FROM core_schema.menu_items WHERE "Code" = 'MENU_MY_COURSES';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sınavlarım'
FROM core_schema.menu_items WHERE "Code" = 'MENU_MY_EXAMS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Ödevlerim'
FROM core_schema.menu_items WHERE "Code" = 'MENU_MY_ASSIGNMENTS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'İlerlememiz'
FROM core_schema.menu_items WHERE "Code" = 'MENU_MY_PROGRESS';

-- Groups
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'İçerik Yönetimi'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GROUP_CONTENT';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Değerlendirme'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GROUP_ASSESSMENT';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Yapay Zeka Araçları'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GROUP_AI_TOOLS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Analitik'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GROUP_ANALYTICS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Yönetim'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GROUP_ADMIN';

-- Content Library
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'İçerik Kütüphanesi'
FROM core_schema.menu_items WHERE "Code" = 'MENU_CONTENT_LIBRARY';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'İçeriklere Gözat'
FROM core_schema.menu_items WHERE "Code" = 'MENU_CONTENT_BROWSE';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Yeni İçerik Oluştur'
FROM core_schema.menu_items WHERE "Code" = 'MENU_CONTENT_CREATE';

-- Curriculum & Lessons
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Müfredat'
FROM core_schema.menu_items WHERE "Code" = 'MENU_CURRICULUM';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Ders Planları'
FROM core_schema.menu_items WHERE "Code" = 'MENU_LESSON_PLANS';

-- Questions
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sorular'
FROM core_schema.menu_items WHERE "Code" = 'MENU_QUESTIONS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Soru Bankası'
FROM core_schema.menu_items WHERE "Code" = 'MENU_QUESTION_BANK';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'AI Soru Üreteci'
FROM core_schema.menu_items WHERE "Code" = 'MENU_QUESTION_GENERATOR';

-- Exams
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sınavlar'
FROM core_schema.menu_items WHERE "Code" = 'MENU_EXAMS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Tüm Sınavlar'
FROM core_schema.menu_items WHERE "Code" = 'MENU_EXAMS_LIST';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sınav Oluştur'
FROM core_schema.menu_items WHERE "Code" = 'MENU_EXAMS_CREATE';

-- Grading
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Değerlendirme'
FROM core_schema.menu_items WHERE "Code" = 'MENU_GRADING';

-- AI Tools
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'AI İçerik Üreteci'
FROM core_schema.menu_items WHERE "Code" = 'MENU_AI_GENERATOR';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'AI Asistanları'
FROM core_schema.menu_items WHERE "Code" = 'MENU_AI_ASSISTANTS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Yazma Asistanı'
FROM core_schema.menu_items WHERE "Code" = 'MENU_AI_WRITING';

-- Analytics
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sınıf Analitiği'
FROM core_schema.menu_items WHERE "Code" = 'MENU_CLASS_ANALYTICS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Raporlar'
FROM core_schema.menu_items WHERE "Code" = 'MENU_REPORTS';

-- Admin
INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Kullanıcılar'
FROM core_schema.menu_items WHERE "Code" = 'MENU_USER_MANAGEMENT';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Kurum Ayarları'
FROM core_schema.menu_items WHERE "Code" = 'MENU_TENANT_SETTINGS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Sistem Ayarları'
FROM core_schema.menu_items WHERE "Code" = 'MENU_SYSTEM_SETTINGS';

INSERT INTO core_schema.menu_item_translations ("Id", "MenuItemId", "LanguageCode", "Label")
SELECT gen_random_uuid(), "Id", 'tr', 'Lisanslama'
FROM core_schema.menu_items WHERE "Code" = 'MENU_LICENSING';

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 
    'VERIFICATION: Menu Items Created' as status,
    COUNT(*) as total_items,
    COUNT(CASE WHEN "MenuType" = 'link' THEN 1 END) as links,
    COUNT(CASE WHEN "MenuType" = 'dropdown' THEN 1 END) as dropdowns,
    COUNT(CASE WHEN "MenuType" = 'group' THEN 1 END) as groups,
    COUNT(CASE WHEN "MenuType" = 'divider' THEN 1 END) as dividers
FROM core_schema.menu_items;

SELECT 
    'VERIFICATION: Menu Permissions' as status,
    r."Name" as role,
    COUNT(mp.*) as permission_count
FROM core_schema.menu_permissions mp
JOIN identity_schema.roles r ON r."Id" = mp."RoleId"
GROUP BY r."Name"
ORDER BY r."Name";

SELECT 
    'VERIFICATION: Translations' as status,
    "LanguageCode" as language,
    COUNT(*) as translation_count
FROM core_schema.menu_item_translations
GROUP BY "LanguageCode";

