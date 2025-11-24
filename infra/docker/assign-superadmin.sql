\c zerquiz_db;

-- Admin kullanıcısının mevcut rollerini temizle
DELETE FROM identity_schema.user_roles 
WHERE "UserId" = 'e2e48bed-0420-4bbe-b67c-73595fd13e15';

-- SuperAdmin rolünü ata
INSERT INTO identity_schema.user_roles 
("Id", "UserId", "RoleId", "TenantId", "CreatedAt", "UpdatedAt", "CreatedBy", "IsActive", "Version")
VALUES 
(gen_random_uuid(), 
 'e2e48bed-0420-4bbe-b67c-73595fd13e15', 
 '22222222-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111',
 NOW(), NOW(), '00000000-0000-0000-0000-000000000001', true, 1);

\echo '✅ SuperAdmin rolü atandı!'
SELECT u."Email", r."Name" as "Role" 
FROM identity_schema.users u
JOIN identity_schema.user_roles ur ON u."Id" = ur."UserId"
JOIN identity_schema.roles r ON ur."RoleId" = r."Id"
WHERE u."Email" = 'admin@demo.com';

