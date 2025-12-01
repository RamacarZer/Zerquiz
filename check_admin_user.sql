-- Temporary: Set a simpler password until we can generate proper hash
-- For now, let's check what's in the database

SELECT "Id", "Email", "FirstName", "LastName", "IsActive", "PasswordHash", LENGTH("PasswordHash") as hash_length
FROM identity_schema.users 
WHERE "Email" = 'admin@zerquiz.com';

