\c zerquiz_db

-- Super Admin rolü oluştur
INSERT INTO identity_schema.roles ("Id", "TenantId", "Name", "Description", "Permissions", "CreatedAt", "CreatedBy")
VALUES ('22222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
        'SuperAdmin', 'Super Yonetici - Tum Yetkiler', 
        ARRAY['all', 'tenants.manage', 'users.manage', 'roles.manage', 'questions.manage', 
              'exams.manage', 'curriculum.manage', 'grading.manage', 'royalty.manage', 'reports.view'], 
        NOW(), 'system')
ON CONFLICT ("Id") DO UPDATE 
SET "Permissions" = EXCLUDED."Permissions",
    "Description" = EXCLUDED."Description";

-- Admin kullanıcısına SuperAdmin rolü ver
UPDATE identity_schema.user_roles 
SET "RoleId" = '22222222-1111-1111-1111-111111111111'
WHERE "UserId" = (SELECT "Id" FROM identity_schema.users WHERE "Email" = 'admin@demo.com' LIMIT 1);

-- Kontrol
SELECT u."Email", r."Name" as "Role", r."Permissions"
FROM identity_schema.users u
JOIN identity_schema.user_roles ur ON u."Id" = ur."UserId"
JOIN identity_schema.roles r ON ur."RoleId" = r."Id"
WHERE u."Email" = 'admin@demo.com';

\echo ''
\echo '✅ SuperAdmin rolu olusturuldu ve admin kullanicisina atandi!'
\echo ''

