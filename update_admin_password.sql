-- Update admin user password to "Admin123!"
-- This hash is generated using PBKDF2 with 100000 iterations and SHA256

-- First, let's generate a new hash
-- Since we can't generate hash directly in SQL, we'll use a pre-generated one
-- You need to run the HashGenerator program first to get the actual hash

-- For now, let's use a temporary simple approach
-- We'll update the password hash after running the C# generator

-- Step 1: Check current user
SELECT "Id", "Email", "PasswordHash" 
FROM identity_schema.users 
WHERE "Email" = 'admin@zerquiz.com';

-- Step 2: After getting the hash from HashGenerator, run:
-- UPDATE identity_schema.users 
-- SET "PasswordHash" = 'YOUR_GENERATED_HASH_HERE'
-- WHERE "Email" = 'admin@zerquiz.com';

