-- Check definition_translations table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'core_schema' 
  AND table_name = 'definition_translations'
ORDER BY ordinal_position;




