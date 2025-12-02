-- =====================================================
-- DYNAMIC MENU SYSTEM - 100% Database Driven
-- Tarih: 2025-12-01
-- Tenant, Module, Role & Permission bazlı menü yönetimi
-- =====================================================

-- ============================================
-- 1. MODULES TABLE (System Modules)
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.modules (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" VARCHAR(100) UNIQUE NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "IconName" VARCHAR(50), -- Lucide icon name
    "DisplayOrder" INT DEFAULT 0,
    "ParentModuleId" UUID, -- For hierarchical modules
    "IsActive" BOOLEAN DEFAULT true,
    "IsSystemReserved" BOOLEAN DEFAULT false,
    "RequiresLicense" BOOLEAN DEFAULT false,
    "LicenseFeatureCode" VARCHAR(100),
    "Version" VARCHAR(20) DEFAULT '1.0',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID,
    
    CONSTRAINT fk_parent_module FOREIGN KEY ("ParentModuleId") 
        REFERENCES core_schema.modules("Id") ON DELETE CASCADE
);

CREATE INDEX idx_modules_code ON core_schema.modules("Code");
CREATE INDEX idx_modules_parent ON core_schema.modules("ParentModuleId");

-- ============================================
-- 2. MODULE TRANSLATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.module_translations (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ModuleId" UUID NOT NULL,
    "LanguageCode" VARCHAR(5) NOT NULL, -- tr, en, ar
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_module_translation FOREIGN KEY ("ModuleId") 
        REFERENCES core_schema.modules("Id") ON DELETE CASCADE,
    CONSTRAINT uq_module_translation UNIQUE("ModuleId", "LanguageCode")
);

CREATE INDEX idx_module_trans_lang ON core_schema.module_translations("LanguageCode");

-- ============================================
-- 3. MENU ITEMS (Dynamic Menu Structure)
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.menu_items (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" VARCHAR(100) UNIQUE NOT NULL,
    "ModuleId" UUID, -- Which module this menu belongs to
    "ParentMenuId" UUID, -- For nested menus
    "LabelKey" VARCHAR(200) NOT NULL, -- Translation key
    "IconName" VARCHAR(50), -- Lucide icon
    "Path" VARCHAR(500), -- Route path
    "DisplayOrder" INT DEFAULT 0,
    "Level" INT DEFAULT 0, -- Menu hierarchy level
    "MenuType" VARCHAR(50) DEFAULT 'link', -- link, dropdown, divider, group
    "BadgeText" VARCHAR(50),
    "BadgeColor" VARCHAR(50),
    "IsVisible" BOOLEAN DEFAULT true,
    "IsActive" BOOLEAN DEFAULT true,
    "IsSystemReserved" BOOLEAN DEFAULT false,
    "OpenInNewTab" BOOLEAN DEFAULT false,
    "CssClass" VARCHAR(200),
    "Metadata" JSONB, -- Additional config
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID,
    
    CONSTRAINT fk_menu_module FOREIGN KEY ("ModuleId") 
        REFERENCES core_schema.modules("Id") ON DELETE CASCADE,
    CONSTRAINT fk_parent_menu FOREIGN KEY ("ParentMenuId") 
        REFERENCES core_schema.menu_items("Id") ON DELETE CASCADE
);

CREATE INDEX idx_menu_code ON core_schema.menu_items("Code");
CREATE INDEX idx_menu_module ON core_schema.menu_items("ModuleId");
CREATE INDEX idx_menu_parent ON core_schema.menu_items("ParentMenuId");
CREATE INDEX idx_menu_order ON core_schema.menu_items("DisplayOrder");

-- ============================================
-- 4. MENU ITEM TRANSLATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.menu_item_translations (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "MenuItemId" UUID NOT NULL,
    "LanguageCode" VARCHAR(5) NOT NULL,
    "Label" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "Tooltip" VARCHAR(500),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_menu_item_translation FOREIGN KEY ("MenuItemId") 
        REFERENCES core_schema.menu_items("Id") ON DELETE CASCADE,
    CONSTRAINT uq_menu_item_translation UNIQUE("MenuItemId", "LanguageCode")
);

-- ============================================
-- 5. MENU PERMISSIONS (Role-based Access)
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.menu_permissions (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "MenuItemId" UUID NOT NULL,
    "RoleId" UUID NOT NULL,
    "CanView" BOOLEAN DEFAULT true,
    "CanAccess" BOOLEAN DEFAULT true,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID,
    
    CONSTRAINT fk_menu_permission_menu FOREIGN KEY ("MenuItemId") 
        REFERENCES core_schema.menu_items("Id") ON DELETE CASCADE,
    CONSTRAINT fk_menu_permission_role FOREIGN KEY ("RoleId") 
        REFERENCES identity_schema.roles("Id") ON DELETE CASCADE,
    CONSTRAINT uq_menu_permission UNIQUE("MenuItemId", "RoleId")
);

CREATE INDEX idx_menu_perm_role ON core_schema.menu_permissions("RoleId");
CREATE INDEX idx_menu_perm_menu ON core_schema.menu_permissions("MenuItemId");

-- ============================================
-- 6. TENANT MODULE ASSIGNMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.tenant_modules (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "TenantId" UUID NOT NULL,
    "ModuleId" UUID NOT NULL,
    "IsEnabled" BOOLEAN DEFAULT true,
    "EnabledAt" TIMESTAMP,
    "DisabledAt" TIMESTAMP,
    "LicenseId" UUID, -- Link to tenant license
    "ExpiresAt" TIMESTAMP, -- Module expiration
    "Settings" JSONB, -- Module-specific settings for tenant
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID,
    
    CONSTRAINT fk_tenant_module_tenant FOREIGN KEY ("TenantId") 
        REFERENCES core_schema.tenants("Id") ON DELETE CASCADE,
    CONSTRAINT fk_tenant_module_module FOREIGN KEY ("ModuleId") 
        REFERENCES core_schema.modules("Id") ON DELETE CASCADE,
    CONSTRAINT uq_tenant_module UNIQUE("TenantId", "ModuleId")
);

CREATE INDEX idx_tenant_module_tenant ON core_schema.tenant_modules("TenantId");
CREATE INDEX idx_tenant_module_module ON core_schema.tenant_modules("ModuleId");

-- ============================================
-- 7. USER MODULE PERMISSIONS (Override)
-- ============================================
CREATE TABLE IF NOT EXISTS core_schema.user_module_permissions (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" UUID NOT NULL,
    "ModuleId" UUID NOT NULL,
    "CanAccess" BOOLEAN DEFAULT true,
    "GrantedAt" TIMESTAMP DEFAULT NOW(),
    "GrantedBy" UUID,
    "ExpiresAt" TIMESTAMP,
    "Reason" TEXT,
    
    CONSTRAINT fk_user_module_user FOREIGN KEY ("UserId") 
        REFERENCES identity_schema.users("Id") ON DELETE CASCADE,
    CONSTRAINT fk_user_module_module FOREIGN KEY ("ModuleId") 
        REFERENCES core_schema.modules("Id") ON DELETE CASCADE,
    CONSTRAINT uq_user_module UNIQUE("UserId", "ModuleId")
);

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function: Get user's accessible menu items
CREATE OR REPLACE FUNCTION core_schema.get_user_menu(
    p_user_id UUID,
    p_language_code VARCHAR(5) DEFAULT 'en'
)
RETURNS TABLE (
    menu_id UUID,
    menu_code VARCHAR(100),
    parent_menu_id UUID,
    label VARCHAR(200),
    icon_name VARCHAR(50),
    path VARCHAR(500),
    display_order INT,
    level INT,
    menu_type VARCHAR(50),
    badge_text VARCHAR(50),
    badge_color VARCHAR(50),
    has_children BOOLEAN,
    module_code VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        m."Id" as menu_id,
        m."Code" as menu_code,
        m."ParentMenuId" as parent_menu_id,
        COALESCE(mt."Label", m."LabelKey") as label,
        m."IconName" as icon_name,
        m."Path" as path,
        m."DisplayOrder" as display_order,
        m."Level" as level,
        m."MenuType" as menu_type,
        m."BadgeText" as badge_text,
        m."BadgeColor" as badge_color,
        EXISTS(SELECT 1 FROM core_schema.menu_items WHERE "ParentMenuId" = m."Id") as has_children,
        mod."Code" as module_code
    FROM core_schema.menu_items m
    LEFT JOIN core_schema.menu_item_translations mt 
        ON mt."MenuItemId" = m."Id" AND mt."LanguageCode" = p_language_code
    LEFT JOIN core_schema.modules mod ON mod."Id" = m."ModuleId"
    INNER JOIN core_schema.menu_permissions mp ON mp."MenuItemId" = m."Id"
    INNER JOIN identity_schema.user_roles ur ON ur."RoleId" = mp."RoleId"
    LEFT JOIN core_schema.tenant_modules tm 
        ON tm."ModuleId" = m."ModuleId" 
        AND tm."TenantId" = (SELECT "TenantId" FROM identity_schema.users WHERE "Id" = p_user_id)
    WHERE ur."UserId" = p_user_id
      AND m."IsActive" = true
      AND m."IsVisible" = true
      AND mp."CanView" = true
      AND (m."ModuleId" IS NULL OR (tm."IsEnabled" = true AND (tm."ExpiresAt" IS NULL OR tm."ExpiresAt" > NOW())))
    ORDER BY m."DisplayOrder", m."Level";
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user can access a module
CREATE OR REPLACE FUNCTION core_schema.can_user_access_module(
    p_user_id UUID,
    p_module_code VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_can_access BOOLEAN := false;
    v_tenant_id UUID;
BEGIN
    -- Get user's tenant
    SELECT "TenantId" INTO v_tenant_id
    FROM identity_schema.users
    WHERE "Id" = p_user_id;

    -- Check module access
    SELECT EXISTS(
        SELECT 1
        FROM core_schema.modules m
        INNER JOIN core_schema.tenant_modules tm ON tm."ModuleId" = m."Id"
        WHERE m."Code" = p_module_code
          AND m."IsActive" = true
          AND tm."TenantId" = v_tenant_id
          AND tm."IsEnabled" = true
          AND (tm."ExpiresAt" IS NULL OR tm."ExpiresAt" > NOW())
    ) INTO v_can_access;

    RETURN v_can_access;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE core_schema.modules IS 'System modules that can be enabled/disabled per tenant';
COMMENT ON TABLE core_schema.menu_items IS 'Dynamic menu structure - completely database driven';
COMMENT ON TABLE core_schema.menu_permissions IS 'Role-based menu access control';
COMMENT ON TABLE core_schema.tenant_modules IS 'Which modules are enabled for each tenant';
COMMENT ON FUNCTION core_schema.get_user_menu IS 'Returns menu items accessible to a specific user based on roles, tenant modules, and permissions';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Dynamic Menu System Created Successfully!';
    RAISE NOTICE '📋 Tables: modules, menu_items, menu_permissions, tenant_modules';
    RAISE NOTICE '🔧 Functions: get_user_menu(), can_user_access_module()';
END $$;

