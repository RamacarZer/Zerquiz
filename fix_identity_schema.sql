-- Add missing BaseEntity columns to Identity schema tables

-- Users table
ALTER TABLE identity_schema.users 
ADD COLUMN IF NOT EXISTS "ModuleId" uuid,
ADD COLUMN IF NOT EXISTS "AppId" uuid,
ADD COLUMN IF NOT EXISTS "CorrelationId" varchar(100),
ADD COLUMN IF NOT EXISTS "RequestId" varchar(100),
ADD COLUMN IF NOT EXISTS "IpAddress" varchar(50),
ADD COLUMN IF NOT EXISTS "UserAgent" varchar(500),
ADD COLUMN IF NOT EXISTS "Source" varchar(50),
ADD COLUMN IF NOT EXISTS "OrganizationId" uuid,
ADD COLUMN IF NOT EXISTS "Version" integer DEFAULT 1;

-- Roles table
ALTER TABLE identity_schema.roles 
ADD COLUMN IF NOT EXISTS "ModuleId" uuid,
ADD COLUMN IF NOT EXISTS "AppId" uuid,
ADD COLUMN IF NOT EXISTS "CorrelationId" varchar(100),
ADD COLUMN IF NOT EXISTS "RequestId" varchar(100),
ADD COLUMN IF NOT EXISTS "IpAddress" varchar(50),
ADD COLUMN IF NOT EXISTS "UserAgent" varchar(500),
ADD COLUMN IF NOT EXISTS "Source" varchar(50),
ADD COLUMN IF NOT EXISTS "OrganizationId" uuid,
ADD COLUMN IF NOT EXISTS "Version" integer DEFAULT 1;

-- UserRoles table
ALTER TABLE identity_schema.user_roles 
ADD COLUMN IF NOT EXISTS "ModuleId" uuid,
ADD COLUMN IF NOT EXISTS "AppId" uuid,
ADD COLUMN IF NOT EXISTS "CorrelationId" varchar(100),
ADD COLUMN IF NOT EXISTS "RequestId" varchar(100),
ADD COLUMN IF NOT EXISTS "IpAddress" varchar(50),
ADD COLUMN IF NOT EXISTS "UserAgent" varchar(500),
ADD COLUMN IF NOT EXISTS "Source" varchar(50),
ADD COLUMN IF NOT EXISTS "OrganizationId" uuid,
ADD COLUMN IF NOT EXISTS "Version" integer DEFAULT 1;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'identity_schema' 
  AND table_name = 'users'
  AND column_name IN ('ModuleId', 'AppId', 'CorrelationId', 'RequestId', 'IpAddress', 'UserAgent', 'Source', 'OrganizationId', 'Version')
ORDER BY column_name;

