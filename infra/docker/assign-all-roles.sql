\c zerquiz_db;

-- Teacher ve Student user ID'lerini bul ve rollerini ata

-- Teacher rolü ata
INSERT INTO identity_schema.user_roles 
("Id", "UserId", "RoleId", "TenantId", "CreatedAt", "UpdatedAt", "CreatedBy", "IsActive", "Version")
SELECT 
    gen_random_uuid(),
    u."Id",
    '22222222-2222-2222-2222-222222222222', -- Teacher Role
    '11111111-1111-1111-1111-111111111111',
    NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true, 1
FROM identity_schema.users u
WHERE u."Email" = 'teacher@demo.com'
AND NOT EXISTS (
    SELECT 1 FROM identity_schema.user_roles ur 
    WHERE ur."UserId" = u."Id" AND ur."RoleId" = '22222222-2222-2222-2222-222222222222'
);

-- Student için default Student rolü zaten atanmış olmalı, kontrol et
\echo '✅ Roller atandı!'
\echo ''
\echo '=== TÜM KULLANICILAR VE ROLLERİ ==='
SELECT u."Email", r."Name" as "Role", r."Permissions"
FROM identity_schema.users u
JOIN identity_schema.user_roles ur ON u."Id" = ur."UserId"
JOIN identity_schema.roles r ON ur."RoleId" = r."Id"
ORDER BY u."Email";

