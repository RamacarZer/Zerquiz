-- ======================================
-- ADMIN PASSWORD UPDATE
-- ======================================
-- Password: Admin123!
-- Generated with PBKDF2 (100000 iterations, SHA256)
--
-- IMPORTANT: Run the HashGenerator first to get a new hash!
-- Command: cd HashGenerator && dotnet run
--
-- Then replace 'YOUR_HASH_HERE' below with the generated hash
-- ======================================

-- Step 1: Check current password hash (should be invalid)
SELECT 
    "Id", 
    "Email", 
    "PasswordHash",
    LENGTH("PasswordHash") as hash_length,
    CASE 
        WHEN "PasswordHash" LIKE '%.%.%' THEN 'OLD_FORMAT (needs replacement)'
        ELSE 'BASE64_FORMAT'
    END as format_type
FROM identity_schema.users 
WHERE "Email" = 'admin@zerquiz.com';

-- Step 2: Update with NEW hash (replace YOUR_HASH_HERE)
-- Example hash format: "Xy7Z9aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5="
-- Your hash should be ~64 characters Base64 string

UPDATE identity_schema.users 
SET "PasswordHash" = 'YOUR_HASH_HERE'
WHERE "Email" = 'admin@zerquiz.com';

-- Step 3: Verify update
SELECT 
    "Id", 
    "Email", 
    "PasswordHash",
    LENGTH("PasswordHash") as hash_length
FROM identity_schema.users 
WHERE "Email" = 'admin@zerquiz.com';

-- Expected hash_length: ~64 characters
-- Expected format: Pure Base64 string (no dots or special characters)




