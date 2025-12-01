-- =====================================================
-- YENİ HİYERARŞİK DİNAMİK TANIM SİSTEMİ
-- Tarih: 2025-12-01
-- Özellikler:
--   ✅ ParentId ile sonsuz hiyerarşi
--   ✅ ChildId ile çok-yönlü ilişkiler
--   ✅ Multi-tenant support
--   ✅ Çoklu dil desteği
--   ✅ Modül, IP, Cihaz, Uygulama bazlı kontrol
-- =====================================================

-- ============================================
-- 1. DEFINITION GROUPS - Tanım Grupları
-- ============================================

CREATE TABLE IF NOT EXISTS core_schema.definition_groups (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" VARCHAR(100) NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "ModuleCode" VARCHAR(50), -- 'questions', 'exams', 'curriculum', 'finance'
    
    -- Hiyerarşi
    "ParentId" UUID NULL, -- Üst grup (örn: education_system > curriculum_types)
    "Level" INT DEFAULT 0, -- Seviye (0=root, 1=child, 2=grandchild...)
    "Path" TEXT, -- Hiyerarşik yol: '/education_system/curriculum_types/'
    
    -- Görünüm
    "IconName" VARCHAR(50),
    "ColorCode" VARCHAR(20),
    "DisplayOrder" INT DEFAULT 0,
    
    -- Sistem
    "IsSystemReserved" BOOLEAN DEFAULT false, -- Silinemez
    "IsActive" BOOLEAN DEFAULT true,
    
    -- Multi-tenant
    "Scope" VARCHAR(20) DEFAULT 'global', -- 'global', 'tenant'
    "TenantId" UUID NULL,
    
    -- Access Control
    "AllowedRoles" TEXT[], -- ['SuperAdmin', 'TenantAdmin']
    "AllowedModules" TEXT[], -- ['curriculum', 'questions']
    "AllowedDeviceTypes" TEXT[], -- ['web', 'mobile', 'tablet']
    "AllowedIpRanges" TEXT[], -- ['192.168.1.0/24']
    
    -- Metadata
    "Metadata" JSONB, -- Extra özellikler
    
    -- BaseEntity
    "CreatedBy" UUID NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP NULL,
    "Version" INT NOT NULL DEFAULT 1,
    "Status" VARCHAR(20) DEFAULT 'active',
    
    CONSTRAINT uq_defgroup_code_tenant UNIQUE("Code", "TenantId"),
    CONSTRAINT fk_defgroup_parent FOREIGN KEY ("ParentId") REFERENCES core_schema.definition_groups("Id"),
    CONSTRAINT fk_defgroup_tenant FOREIGN KEY ("TenantId") REFERENCES core_schema.tenants("Id")
);

CREATE INDEX idx_defgroup_parent ON core_schema.definition_groups("ParentId");
CREATE INDEX idx_defgroup_module ON core_schema.definition_groups("ModuleCode");
CREATE INDEX idx_defgroup_tenant ON core_schema.definition_groups("TenantId");
CREATE INDEX idx_defgroup_path ON core_schema.definition_groups("Path");
CREATE INDEX idx_defgroup_active ON core_schema.definition_groups("IsActive", "Status");

COMMENT ON TABLE core_schema.definition_groups IS 'Hierarchical definition groups with multi-tenant and access control';

-- ============================================
-- 2. DEFINITION GROUP TRANSLATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS core_schema.definition_group_translations (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "GroupId" UUID NOT NULL,
    "LanguageCode" VARCHAR(5) NOT NULL, -- 'tr', 'en', 'ar', 'de', 'fr'
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_defgroup_trans UNIQUE("GroupId", "LanguageCode"),
    CONSTRAINT fk_defgroup_trans FOREIGN KEY ("GroupId") REFERENCES core_schema.definition_groups("Id") ON DELETE CASCADE
);

CREATE INDEX idx_defgroup_trans_lang ON core_schema.definition_group_translations("LanguageCode");

-- ============================================
-- 3. DEFINITIONS - Tanımlar (Ana Tablo)
-- ============================================

CREATE TABLE IF NOT EXISTS core_schema.definitions (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "GroupId" UUID NOT NULL,
    "Code" VARCHAR(100) NOT NULL,
    "Value" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    
    -- Hiyerarşi
    "ParentId" UUID NULL, -- Üst tanım (örn: Matematik > Cebir > Denklemler)
    "ChildIds" UUID[], -- Alt tanımlar dizisi (çok-yönlü ilişki)
    "Level" INT DEFAULT 0,
    "Path" TEXT, -- '/mathematics/algebra/equations/'
    
    -- Sıralama & Görünüm
    "DisplayOrder" INT DEFAULT 0,
    "IconName" VARCHAR(50),
    "ColorCode" VARCHAR(20),
    "ImageUrl" TEXT,
    
    -- Özellikler
    "IsSystemReserved" BOOLEAN DEFAULT false,
    "IsActive" BOOLEAN DEFAULT true,
    "IsSelectable" BOOLEAN DEFAULT true, -- Dropdown'da seçilebilir mi?
    
    -- Multi-tenant
    "Scope" VARCHAR(20) DEFAULT 'global', -- 'global', 'tenant', 'custom'
    "TenantId" UUID NULL,
    
    -- Access Control (IP, Cihaz, Uygulama bazlı)
    "AccessControl" JSONB DEFAULT '{
        "roles": [],
        "modules": [],
        "deviceTypes": ["web", "mobile", "tablet"],
        "ipWhitelist": [],
        "ipBlacklist": [],
        "allowedApps": [],
        "startDate": null,
        "endDate": null,
        "timeSlots": []
    }'::JSONB,
    
    -- Metadata & Custom Fields
    "Metadata" JSONB, -- {difficulty: "hard", category: "algebra", tags: ["linear", "first-order"]}
    "CustomFields" JSONB, -- Tenant'ın özel alanları
    
    -- BaseEntity
    "CreatedBy" UUID NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP NULL,
    "Version" INT NOT NULL DEFAULT 1,
    "Status" VARCHAR(20) DEFAULT 'active',
    
    CONSTRAINT uq_def_code_group_tenant UNIQUE("Code", "GroupId", "TenantId"),
    CONSTRAINT fk_def_group FOREIGN KEY ("GroupId") REFERENCES core_schema.definition_groups("Id"),
    CONSTRAINT fk_def_parent FOREIGN KEY ("ParentId") REFERENCES core_schema.definitions("Id"),
    CONSTRAINT fk_def_tenant FOREIGN KEY ("TenantId") REFERENCES core_schema.tenants("Id")
);

CREATE INDEX idx_def_group ON core_schema.definitions("GroupId", "IsActive");
CREATE INDEX idx_def_parent ON core_schema.definitions("ParentId");
CREATE INDEX idx_def_tenant ON core_schema.definitions("TenantId");
CREATE INDEX idx_def_path ON core_schema.definitions("Path");
CREATE INDEX idx_def_code ON core_schema.definitions("Code");
CREATE INDEX idx_def_childids ON core_schema.definitions USING GIN("ChildIds");
CREATE INDEX idx_def_metadata ON core_schema.definitions USING GIN("Metadata");
CREATE INDEX idx_def_access ON core_schema.definitions USING GIN("AccessControl");

COMMENT ON TABLE core_schema.definitions IS 'Hierarchical definitions with multi-tenant, IP, device, and app-based access control';

-- ============================================
-- 4. DEFINITION TRANSLATIONS - Çoklu Dil
-- ============================================

CREATE TABLE IF NOT EXISTS core_schema.definition_translations (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "DefinitionId" UUID NOT NULL,
    "LanguageCode" VARCHAR(5) NOT NULL, -- 'tr', 'en', 'ar', 'de', 'fr', 'ru', 'zh'
    "Value" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    
    -- Extra fields for rich content
    "ShortName" VARCHAR(100), -- Kısaltma
    "LongDescription" TEXT, -- Detaylı açıklama
    "Keywords" TEXT[], -- Arama için anahtar kelimeler
    
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_def_trans UNIQUE("DefinitionId", "LanguageCode"),
    CONSTRAINT fk_def_trans FOREIGN KEY ("DefinitionId") REFERENCES core_schema.definitions("Id") ON DELETE CASCADE
);

CREATE INDEX idx_def_trans_lang ON core_schema.definition_translations("LanguageCode");
CREATE INDEX idx_def_trans_keywords ON core_schema.definition_translations USING GIN("Keywords");

-- ============================================
-- 5. DEFINITION RELATIONS - İlişkiler (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS core_schema.definition_relations (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "SourceDefinitionId" UUID NOT NULL,
    "TargetDefinitionId" UUID NOT NULL,
    "RelationType" VARCHAR(50) NOT NULL, -- 'parent', 'child', 'related', 'prerequisite', 'alternative'
    "Strength" INT DEFAULT 1, -- İlişki gücü (1-10)
    "Metadata" JSONB,
    
    "CreatedBy" UUID NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "Version" INT NOT NULL DEFAULT 1,
    
    CONSTRAINT uq_def_relation UNIQUE("SourceDefinitionId", "TargetDefinitionId", "RelationType"),
    CONSTRAINT fk_def_rel_source FOREIGN KEY ("SourceDefinitionId") REFERENCES core_schema.definitions("Id") ON DELETE CASCADE,
    CONSTRAINT fk_def_rel_target FOREIGN KEY ("TargetDefinitionId") REFERENCES core_schema.definitions("Id") ON DELETE CASCADE
);

CREATE INDEX idx_def_rel_source ON core_schema.definition_relations("SourceDefinitionId");
CREATE INDEX idx_def_rel_target ON core_schema.definition_relations("TargetDefinitionId");
CREATE INDEX idx_def_rel_type ON core_schema.definition_relations("RelationType");

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function: Get full hierarchy path
CREATE OR REPLACE FUNCTION core_schema.get_definition_path(def_id UUID)
RETURNS TEXT AS $$
DECLARE
    path_result TEXT := '';
    current_id UUID := def_id;
    parent_id UUID;
    parent_code VARCHAR(100);
BEGIN
    LOOP
        SELECT "ParentId", "Code" INTO parent_id, parent_code
        FROM core_schema.definitions
        WHERE "Id" = current_id;
        
        EXIT WHEN parent_id IS NULL;
        
        path_result := '/' || parent_code || path_result;
        current_id := parent_id;
    END LOOP;
    
    RETURN path_result || '/';
END;
$$ LANGUAGE plpgsql;

-- Function: Get all children (recursive)
CREATE OR REPLACE FUNCTION core_schema.get_definition_children(def_id UUID)
RETURNS TABLE(id UUID, code VARCHAR, level INT) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE children AS (
        SELECT "Id", "Code", "ParentId", 0 as level
        FROM core_schema.definitions
        WHERE "Id" = def_id
        
        UNION ALL
        
        SELECT d."Id", d."Code", d."ParentId", c.level + 1
        FROM core_schema.definitions d
        INNER JOIN children c ON d."ParentId" = c."Id"
    )
    SELECT "Id", "Code", level
    FROM children
    WHERE "Id" != def_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Check access control
CREATE OR REPLACE FUNCTION core_schema.check_definition_access(
    def_id UUID,
    user_role VARCHAR,
    module_code VARCHAR,
    device_type VARCHAR,
    client_ip INET
)
RETURNS BOOLEAN AS $$
DECLARE
    access_control JSONB;
    allowed BOOLEAN := false;
BEGIN
    SELECT "AccessControl" INTO access_control
    FROM core_schema.definitions
    WHERE "Id" = def_id;
    
    -- Check role
    IF NOT (access_control->'roles' @> to_jsonb(ARRAY[user_role]::TEXT[])) THEN
        RETURN false;
    END IF;
    
    -- Check module
    IF NOT (access_control->'modules' @> to_jsonb(ARRAY[module_code]::TEXT[])) THEN
        RETURN false;
    END IF;
    
    -- Check device type
    IF NOT (access_control->'deviceTypes' @> to_jsonb(ARRAY[device_type]::TEXT[])) THEN
        RETURN false;
    END IF;
    
    -- TODO: Check IP whitelist/blacklist
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BAŞARILI! ✅
-- Şimdi seed data ekleyebiliriz.
-- ============================================

