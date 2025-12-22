-- ================================================
-- SETUP SUPERADMIN USER (GLOBAL - ALL TENANTS)
-- ================================================
-- Database: zerquiz_db
-- Schema: identity_schema
-- User: admin@zerquiz.com
-- Password: Admin123! (already hashed)
-- ================================================

-- STEP 1: Check existing SuperAdmin role
SELECT "Id", "Name", "TenantId", "Description", "IsActive"
FROM identity_schema.roles
WHERE "Name" = 'SuperAdmin'
AND "DeletedAt" IS NULL;

-- STEP 2: Soft delete any tenant-specific SuperAdmin roles
UPDATE identity_schema.roles
SET "DeletedAt" = NOW(),
    "UpdatedAt" = NOW(),
    "UpdatedBy" = (SELECT "Id" FROM identity_schema.users WHERE "Email" = 'admin@zerquiz.com' LIMIT 1)
WHERE "Name" = 'SuperAdmin'
AND "TenantId" IS NOT NULL
AND "DeletedAt" IS NULL;

-- STEP 3: Create global SuperAdmin role (TenantId = NULL for all tenants)
INSERT INTO identity_schema.roles (
    "Id",
    "TenantId",
    "Name",
    "Description",
    "Permissions",
    "IsActive",
    "Status",
    "Version",
    "CreatedAt",
    "UpdatedAt",
    "CreatedBy",
    "Source"
)
SELECT 
    gen_random_uuid(),
    NULL,                                                   -- Global role (all tenants)
    'SuperAdmin',
    'Global Super Administrator - Full system access across all tenants',
    ARRAY['*']::text[],                                     -- All permissions
    true,
    'active',
    1,                                                      -- Initial version
    NOW(),
    NOW(),
    NULL,                                                   -- System created
    'system_setup'
WHERE NOT EXISTS (
    SELECT 1 FROM identity_schema.roles
    WHERE "Name" = 'SuperAdmin'
    AND "TenantId" IS NULL
    AND "DeletedAt" IS NULL
);

-- STEP 4: Make admin user global (TenantId = NULL)
UPDATE identity_schema.users
SET "TenantId" = NULL,
    "UpdatedAt" = NOW(),
    "Status" = 'active'
WHERE "Email" = 'admin@zerquiz.com'
AND "DeletedAt" IS NULL;

-- STEP 5: Assign SuperAdmin role to admin user
INSERT INTO identity_schema.user_roles (
    "Id",
    "UserId",
    "RoleId",
    "TenantId",
    "IsActive",
    "Status",
    "Version",
    "CreatedAt",
    "UpdatedAt",
    "Source"
)
SELECT 
    gen_random_uuid(),
    u."Id",
    r."Id",
    NULL,                                                   -- Global assignment
    true,
    'active',
    1,
    NOW(),
    NOW(),
    'system_setup'
FROM identity_schema.users u
CROSS JOIN identity_schema.roles r
WHERE u."Email" = 'admin@zerquiz.com'
AND r."Name" = 'SuperAdmin'
AND r."TenantId" IS NULL
AND u."DeletedAt" IS NULL
AND r."DeletedAt" IS NULL
AND NOT EXISTS (
    SELECT 1 FROM identity_schema.user_roles ur
    WHERE ur."UserId" = u."Id"
    AND ur."RoleId" = r."Id"
    AND ur."DeletedAt" IS NULL
);

-- STEP 6: Verify the setup
SELECT 
    u."Email",
    u."FirstName",
    u."LastName",
    u."TenantId" as user_tenant_id,
    r."Name" as role_name,
    r."TenantId" as role_tenant_id,
    r."Description" as role_description,
    r."Permissions",
    ur."TenantId" as assignment_tenant_id,
    ur."IsActive" as assignment_active,
    CASE 
        WHEN u."TenantId" IS NULL AND r."TenantId" IS NULL THEN '✅ GLOBAL SUPERADMIN'
        ELSE '❌ NOT GLOBAL'
    END as status
FROM identity_schema.users u
JOIN identity_schema.user_roles ur ON u."Id" = ur."UserId" AND ur."DeletedAt" IS NULL
JOIN identity_schema.roles r ON ur."RoleId" = r."Id" AND r."DeletedAt" IS NULL
WHERE u."Email" = 'admin@zerquiz.com'
AND u."DeletedAt" IS NULL;

-- STEP 7: Show all roles for admin user
SELECT 
    r."Name" as role_name,
    r."TenantId" as role_tenant,
    r."Permissions",
    r."IsActive"
FROM identity_schema.users u
JOIN identity_schema.user_roles ur ON u."Id" = ur."UserId" AND ur."DeletedAt" IS NULL
JOIN identity_schema.roles r ON ur."RoleId" = r."Id" AND r."DeletedAt" IS NULL
WHERE u."Email" = 'admin@zerquiz.com'
AND u."DeletedAt" IS NULL;




