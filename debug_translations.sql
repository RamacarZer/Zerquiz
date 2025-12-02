-- Debug: Check if question types exist
SELECT 
    'Total question types' as info,
    COUNT(*) as count
FROM core_schema.definitions d
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'question_types';

-- Check specific codes
SELECT 
    d."Id",
    d."Code",
    d."Value",
    d."GroupId"
FROM core_schema.definitions d
JOIN core_schema.definition_groups dg ON d."GroupId" = dg."Id"
WHERE dg."Code" = 'question_types'
  AND d."Code" IN ('multiple_choice_single', 'true_false', 'essay')
ORDER BY d."Code";

-- Check if any translations exist
SELECT 
    dt."Id",
    dt."DefinitionId",
    dt."LanguageCode",
    dt."Value",
    d."Code" as definition_code
FROM core_schema.definition_translations dt
JOIN core_schema.definitions d ON dt."DefinitionId" = d."Id"
LIMIT 10;

