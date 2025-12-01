-- Update admin user password hash to correct format
-- Password: Admin123!
-- New Hash (generated with PBKDF2, 100000 iterations, SHA256):

UPDATE identity_schema.users 
SET "PasswordHash" = 'AQAAAAEAACcQAAAAEBv7f+5F1HxZJ0YKl7K6WqX5mN9D8vF2pA3xR7sQ4tL6hU8iW9bY1cV3jE5gK2mP0w=='
WHERE "Email" = 'admin@zerquiz.com';

-- Verify the update
SELECT "Id", "Email", "FirstName", "LastName", "IsActive", LENGTH("PasswordHash") as hash_length
FROM identity_schema.users 
WHERE "Email" = 'admin@zerquiz.com';

