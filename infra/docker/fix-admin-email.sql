-- Fix admin user email confirmation
UPDATE identity_schema.users 
SET "EmailConfirmed" = true, 
    "UpdatedAt" = NOW()
WHERE "Email" = 'admin@demo.com';

-- Verify
SELECT "Email", "FirstName", "EmailConfirmed", "IsActive" 
FROM identity_schema.users 
WHERE "Email" = 'admin@demo.com';

