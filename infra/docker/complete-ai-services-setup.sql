-- =====================================================
-- Zerquiz AI Services - Database Setup Script
-- =====================================================

-- Create additional schemas for new services
CREATE SCHEMA IF NOT EXISTS content_schema;
CREATE SCHEMA IF NOT EXISTS lessons_schema;

-- Create database users for new services
CREATE USER zerquiz_content WITH PASSWORD 'content_pass_2024';
CREATE USER zerquiz_lessons WITH PASSWORD 'lessons_pass_2024';

-- Grant privileges
GRANT USAGE ON SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA content_schema TO zerquiz_content;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA content_schema TO zerquiz_content;

GRANT USAGE ON SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA lessons_schema TO zerquiz_lessons;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA lessons_schema TO zerquiz_lessons;

-- =====================================================
-- CONTENT SCHEMA TABLES
-- =====================================================

-- Content Items
CREATE TABLE IF NOT EXISTS content_schema."ContentItems" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "Title" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    "ContentType" VARCHAR(100) NOT NULL,
    "FileKey" VARCHAR(500) NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "MimeType" VARCHAR(100),
    "FilePath" VARCHAR(1000),
    "Status" VARCHAR(50) DEFAULT 'processing',
    "Tags" TEXT[],
    "Metadata" JSONB,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_ContentItems_TenantId" ON content_schema."ContentItems"("TenantId");
CREATE INDEX "IX_ContentItems_UserId" ON content_schema."ContentItems"("UserId");
CREATE INDEX "IX_ContentItems_Status" ON content_schema."ContentItems"("Status");

-- Content Metadata
CREATE TABLE IF NOT EXISTS content_schema."ContentMetadata" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "ContentItemId" UUID NOT NULL REFERENCES content_schema."ContentItems"("Id") ON DELETE CASCADE,
    "ExtractedText" TEXT,
    "Summary" TEXT,
    "KeyConcepts" JSONB,
    "EstimatedReadingTime" INT,
    "LanguageDetected" VARCHAR(10),
    "PageCount" INT,
    "WordCount" INT,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_ContentMetadata_ContentItemId" ON content_schema."ContentMetadata"("ContentItemId");

-- Generated Content
CREATE TABLE IF NOT EXISTS content_schema."GeneratedContent" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "ContentItemId" UUID NOT NULL REFERENCES content_schema."ContentItems"("Id") ON DELETE CASCADE,
    "GenerationType" VARCHAR(100) NOT NULL,
    "QuestionTypeCode" VARCHAR(100),
    "GeneratedData" JSONB NOT NULL,
    "Prompt" TEXT,
    "AIProvider" VARCHAR(100),
    "AIModel" VARCHAR(100),
    "Status" VARCHAR(50) DEFAULT 'draft',
    "UsageCount" INT DEFAULT 0,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_GeneratedContent_ContentItemId" ON content_schema."GeneratedContent"("ContentItemId");
CREATE INDEX "IX_GeneratedContent_Status" ON content_schema."GeneratedContent"("Status");

-- =====================================================
-- LESSONS SCHEMA TABLES
-- =====================================================

-- Lesson Templates
CREATE TABLE IF NOT EXISTS lessons_schema."LessonTemplates" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "Code" VARCHAR(100) NOT NULL UNIQUE,
    "Name" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    "Icon" VARCHAR(100),
    "Color" VARCHAR(100),
    "StructureJson" JSONB NOT NULL,
    "BestFor" TEXT[],
    "EstimatedDuration" VARCHAR(100),
    "DisplayOrder" INT DEFAULT 0,
    "IsSystemReserved" BOOLEAN DEFAULT FALSE,
    "UsageCount" INT DEFAULT 0,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_LessonTemplates_Code" ON lessons_schema."LessonTemplates"("Code");

-- Lesson Plans
CREATE TABLE IF NOT EXISTS lessons_schema."LessonPlans" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "CreatedBy" UUID NOT NULL,
    "Title" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    "SubjectId" UUID,
    "SubjectName" VARCHAR(200),
    "Grade" VARCHAR(50) NOT NULL,
    "DurationMinutes" INT NOT NULL DEFAULT 45,
    "LessonTemplateId" UUID REFERENCES lessons_schema."LessonTemplates"("Id"),
    "Objectives" TEXT[] NOT NULL DEFAULT '{}',
    "MaterialsNeeded" TEXT[] NOT NULL DEFAULT '{}',
    "Assessment" TEXT,
    "Notes" TEXT,
    "GenerationSource" VARCHAR(50) DEFAULT 'manual',
    "SourceContentId" UUID,
    "PublishStatus" VARCHAR(50) DEFAULT 'draft',
    "PublishedAt" TIMESTAMP,
    "UsageCount" INT DEFAULT 0,
    "LastUsedAt" TIMESTAMP,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_LessonPlans_TenantId" ON lessons_schema."LessonPlans"("TenantId");
CREATE INDEX "IX_LessonPlans_CreatedBy" ON lessons_schema."LessonPlans"("CreatedBy");
CREATE INDEX "IX_LessonPlans_PublishStatus" ON lessons_schema."LessonPlans"("PublishStatus");

-- Lesson Activities
CREATE TABLE IF NOT EXISTS lessons_schema."LessonActivities" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "LessonPlanId" UUID NOT NULL REFERENCES lessons_schema."LessonPlans"("Id") ON DELETE CASCADE,
    "ActivityType" VARCHAR(100) NOT NULL,
    "Title" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    "DurationMinutes" INT NOT NULL,
    "Instructions" TEXT,
    "DisplayOrder" INT NOT NULL,
    "ResourceIds" TEXT[],
    "MaterialsNeeded" TEXT,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_LessonActivities_LessonPlanId" ON lessons_schema."LessonActivities"("LessonPlanId");

-- Assignments
CREATE TABLE IF NOT EXISTS lessons_schema."Assignments" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "LessonPlanId" UUID REFERENCES lessons_schema."LessonPlans"("Id"),
    "CreatedBy" UUID NOT NULL,
    "Title" VARCHAR(500) NOT NULL,
    "Description" TEXT,
    "Instructions" TEXT NOT NULL,
    "AssignmentType" VARCHAR(100) NOT NULL DEFAULT 'homework',
    "SubjectId" UUID,
    "SubjectName" VARCHAR(200),
    "Grade" VARCHAR(50),
    "StartDate" TIMESTAMP,
    "DueDate" TIMESTAMP NOT NULL,
    "LateSubmissionDeadline" TIMESTAMP,
    "MaxPoints" INT NOT NULL DEFAULT 100,
    "RubricId" UUID,
    "AllowLateSubmission" BOOLEAN DEFAULT TRUE,
    "LateSubmissionPenalty" INT,
    "AttachedResourceIds" TEXT[],
    "PublishStatus" VARCHAR(50) DEFAULT 'draft',
    "PublishedAt" TIMESTAMP,
    "AssignedToUserIds" TEXT[],
    "AssignedToClassId" UUID,
    "GenerationSource" VARCHAR(50) DEFAULT 'manual',
    "SourceContentId" UUID,
    "TotalAssigned" INT DEFAULT 0,
    "SubmissionCount" INT DEFAULT 0,
    "GradedCount" INT DEFAULT 0,
    "AverageScore" DECIMAL(5,2),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_Assignments_TenantId" ON lessons_schema."Assignments"("TenantId");
CREATE INDEX "IX_Assignments_CreatedBy" ON lessons_schema."Assignments"("CreatedBy");
CREATE INDEX "IX_Assignments_PublishStatus" ON lessons_schema."Assignments"("PublishStatus");
CREATE INDEX "IX_Assignments_DueDate" ON lessons_schema."Assignments"("DueDate");

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS lessons_schema."AssignmentSubmissions" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "AssignmentId" UUID NOT NULL REFERENCES lessons_schema."Assignments"("Id") ON DELETE CASCADE,
    "StudentId" UUID NOT NULL,
    "StudentName" VARCHAR(200),
    "SubmittedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "SubmissionStatus" VARCHAR(50) DEFAULT 'submitted',
    "IsLate" BOOLEAN DEFAULT FALSE,
    "SubmissionText" TEXT,
    "SubmissionFileIds" TEXT[],
    "SubmissionUrl" TEXT,
    "Score" DECIMAL(5,2),
    "Grade" VARCHAR(10),
    "TeacherFeedback" TEXT,
    "RubricScoresJson" JSONB,
    "GradedBy" UUID,
    "GradedAt" TIMESTAMP,
    "AISuggestedScore" VARCHAR(50),
    "AIFeedback" TEXT,
    "SubmissionVersion" INT DEFAULT 1,
    "PreviousSubmissionId" UUID,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_AssignmentSubmissions_AssignmentId" ON lessons_schema."AssignmentSubmissions"("AssignmentId");
CREATE INDEX "IX_AssignmentSubmissions_StudentId" ON lessons_schema."AssignmentSubmissions"("StudentId");
CREATE INDEX "IX_AssignmentSubmissions_SubmissionStatus" ON lessons_schema."AssignmentSubmissions"("SubmissionStatus");

-- Worksheets
CREATE TABLE IF NOT EXISTS lessons_schema."Worksheets" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL,
    "SourceContentId" UUID,
    "CreatedBy" UUID NOT NULL,
    "Title" VARCHAR(500) NOT NULL,
    "Instructions" TEXT,
    "QuestionsJson" JSONB NOT NULL DEFAULT '[]',
    "AnswerKeyJson" JSONB,
    "OutputFormat" VARCHAR(50) DEFAULT 'html',
    "GeneratedFilePath" TEXT,
    "SubjectId" UUID,
    "Grade" VARCHAR(50),
    "EstimatedDurationMinutes" INT,
    "UsageCount" INT DEFAULT 0,
    "LastUsedAt" TIMESTAMP,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "DeletedAt" TIMESTAMP
);

CREATE INDEX "IX_Worksheets_TenantId" ON lessons_schema."Worksheets"("TenantId");
CREATE INDEX "IX_Worksheets_CreatedBy" ON lessons_schema."Worksheets"("CreatedBy");

-- =====================================================
-- SEED DATA: Lesson Templates
-- =====================================================

INSERT INTO lessons_schema."LessonTemplates" ("Id", "TenantId", "Code", "Name", "Description", "StructureJson", "BestFor", "EstimatedDuration", "DisplayOrder", "IsSystemReserved", "CreatedAt", "UpdatedAt")
VALUES 
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', '5e_model', '5E Modeli', 
'Engage, Explore, Explain, Elaborate, Evaluate - Araştırma odaklı öğrenme modeli',
'{"phases": [
    {"name": "Engage", "description": "Dikkat çekme ve merak uyandırma", "duration": "5-10 dk"},
    {"name": "Explore", "description": "Keşfetme ve deneme", "duration": "15-20 dk"},
    {"name": "Explain", "description": "Kavramları açıklama", "duration": "10-15 dk"},
    {"name": "Elaborate", "description": "Derinleştirme ve uygulama", "duration": "15-20 dk"},
    {"name": "Evaluate", "description": "Değerlendirme", "duration": "5-10 dk"}
]}'::jsonb,
ARRAY['Fen Bilimleri', 'Keşif Odaklı Öğrenme', 'Laboratuvar'], '45-60 dakika', 1, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'project_based', 'Proje Tabanlı Öğrenme',
'Gerçek dünya problemlerini çözerek öğrenme',
'{"phases": [
    {"name": "Problem Tanıtımı", "description": "Proje konusu ve hedefler", "duration": "1 ders"},
    {"name": "Araştırma ve Planlama", "description": "Bilgi toplama ve plan yapma", "duration": "1 hafta"},
    {"name": "Tasarım ve Geliştirme", "description": "Proje oluşturma", "duration": "2 hafta"},
    {"name": "Sunum", "description": "Proje sunumu", "duration": "1 ders"},
    {"name": "Yansıtma", "description": "Değerlendirme ve öğrenme çıkarımları", "duration": "1 ders"}
]}'::jsonb,
ARRAY['Grup Çalışması', 'Problem Çözme', 'Yaratıcılık'], '3-4 hafta', 2, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'flipped_classroom', 'Ters Yüz Sınıf',
'Evde video izle, sınıfta uygula',
'{"phases": [
    {"name": "Ön Hazırlık", "description": "Video/okuma ödevleri (evde)", "duration": "20-30 dk"},
    {"name": "Sınıf İçi Aktivite", "description": "Problem çözme, tartışma", "duration": "30 dk"},
    {"name": "Ders Sonrası", "description": "Pratik ve değerlendirme", "duration": "15 dk"}
]}'::jsonb,
ARRAY['Çevrimiçi İçerik', 'Aktif Öğrenme', 'Sınıf İçi Uygulama'], '45 dakika', 3, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'traditional', 'Doğrudan Öğretim',
'Geleneksel yapılandırılmış ders modeli',
'{"phases": [
    {"name": "Isınma/Tekrar", "description": "Önceki dersin tekrarı", "duration": "5 dk"},
    {"name": "Yeni Konu", "description": "Kavram açıklama ve örnekler", "duration": "15 dk"},
    {"name": "Rehberli Uygulama", "description": "Öğretmen eşliğinde pratik", "duration": "10 dk"},
    {"name": "Bağımsız Uygulama", "description": "Öğrenci uygulaması", "duration": "10 dk"},
    {"name": "Kapanış", "description": "Özet ve değerlendirme", "duration": "5 dk"}
]}'::jsonb,
ARRAY['Yeni Kavramlar', 'Temel Beceriler', 'Hızlı İçerik Aktarımı'], '40-45 dakika', 4, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'inquiry_based', 'Sorgulama Tabanlı',
'Soru sorarak ve araştırarak öğrenme',
'{"phases": [
    {"name": "Soru Sorma", "description": "Merak uyandırıcı sorular", "duration": "10 dk"},
    {"name": "Araştırma", "description": "Bilgi toplama ve inceleme", "duration": "20 dk"},
    {"name": "Analiz", "description": "Verileri değerlendirme", "duration": "15 dk"},
    {"name": "Sonuç", "description": "Bulguları paylaşma", "duration": "10 dk"}
]}'::jsonb,
ARRAY['Eleştirel Düşünme', 'Araştırma Becerileri', 'Bilimsel Yöntem'], '45-60 dakika', 5, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'jigsaw', 'Jigsaw İşbirliği',
'Her öğrenci bir uzman, birlikte öğrenin',
'{"phases": [
    {"name": "Uzman Grupları", "description": "Konu başına grup oluşturma", "duration": "15 dk"},
    {"name": "Öğrenme", "description": "Uzman grubunda derinleşme", "duration": "15 dk"},
    {"name": "Karma Gruplar", "description": "Ana gruplara dönüş", "duration": "15 dk"},
    {"name": "Paylaşım", "description": "Bilgi aktarımı", "duration": "15 dk"}
]}'::jsonb,
ARRAY['Grup Çalışması', 'Karmaşık Konular', 'Sosyal Öğrenme'], '45-60 dakika', 6, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'socratic_seminar', 'Sokratik Tartışma',
'Soru-cevap yoluyla derin öğrenme',
'{"phases": [
    {"name": "Hazırlık", "description": "Metin okuma ve soru hazırlama", "duration": "10 dk"},
    {"name": "Açılış", "description": "Ana soru ve ilk düşünceler", "duration": "10 dk"},
    {"name": "Tartışma", "description": "Serbest tartışma", "duration": "20 dk"},
    {"name": "Kapanış", "description": "Öğrenme çıkarımları", "duration": "5 dk"}
]}'::jsonb,
ARRAY['Tartışma', 'Eleştirel Düşünme', 'Edebiyat/Felsefe'], '45 dakika', 7, TRUE, NOW(), NOW()),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'problem_solving', 'Problem Çözme Atölyesi',
'Gerçek problemleri adım adım çözme',
'{"phases": [
    {"name": "Problem Analizi", "description": "Problemin anlaşılması", "duration": "10 dk"},
    {"name": "Strateji Belirleme", "description": "Çözüm yolları", "duration": "10 dk"},
    {"name": "Uygulama", "description": "Çözüm geliştirme", "duration": "30 dk"},
    {"name": "Kontrol ve Değerlendirme", "description": "Sonuçların incelenmesi", "duration": "10 dk"}
]}'::jsonb,
ARRAY['Matematik', 'Mühendislik', 'Mantık'], '60 dakika', 8, TRUE, NOW(), NOW());

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA content_schema TO zerquiz_content;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA lessons_schema TO zerquiz_lessons;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Zerquiz AI Services database setup completed successfully!';
    RAISE NOTICE '✅ Created schemas: content_schema, lessons_schema';
    RAISE NOTICE '✅ Created users: zerquiz_content, zerquiz_lessons';
    RAISE NOTICE '✅ Created tables: ContentItems, LessonPlans, Assignments, and more';
    RAISE NOTICE '✅ Seeded 8 lesson templates';
END $$;

