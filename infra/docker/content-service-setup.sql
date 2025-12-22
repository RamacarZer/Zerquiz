-- Content Service Database Setup
-- Schema: content_schema

-- Create schema
CREATE SCHEMA IF NOT EXISTS content_schema;

-- Content Items Table
CREATE TABLE content_schema.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- pdf, docx, pptx, txt, image
    file_key VARCHAR(200) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    original_file_name VARCHAR(500),
    processing_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, ready, failed
    processing_error TEXT,
    tags JSONB,
    metadata JSONB,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Content Metadata Table (AI-extracted metadata)
CREATE TABLE content_schema.content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    content_item_id UUID NOT NULL REFERENCES content_schema.content_items(id) ON DELETE CASCADE,
    extracted_text TEXT,
    summary TEXT,
    key_concepts JSONB,
    page_count INT,
    word_count INT,
    estimated_reading_time_minutes INT,
    language_detected VARCHAR(10),
    extracted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Generated Content Table (AI-generated questions, flashcards, etc.)
CREATE TABLE content_schema.generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    content_item_id UUID NOT NULL REFERENCES content_schema.content_items(id) ON DELETE CASCADE,
    generation_type VARCHAR(50) NOT NULL, -- quiz, flashcard, summary, worksheet, lesson_plan
    question_type_code VARCHAR(50), -- For quiz generation
    generated_data JSONB NOT NULL,
    prompt TEXT,
    ai_provider VARCHAR(50),
    ai_model VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft', -- draft, reviewed, published, rejected
    usage_count INT DEFAULT 0,
    difficulty VARCHAR(20), -- easy, medium, hard
    language VARCHAR(10),
    item_count INT, -- Number of questions/flashcards generated
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    published_at TIMESTAMP
);

-- Content Templates Table (AI generation templates)
CREATE TABLE content_schema.content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_type_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    description TEXT,
    prompt_template TEXT NOT NULL,
    system_message TEXT,
    validation_rules JSONB,
    example_output JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_system_default BOOLEAN DEFAULT FALSE,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2000,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Generation Jobs Table (Track async AI generation)
CREATE TABLE content_schema.generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    content_item_id UUID NOT NULL REFERENCES content_schema.content_items(id) ON DELETE CASCADE,
    generation_type VARCHAR(50) NOT NULL,
    configuration JSONB NOT NULL, -- difficulty, count, question types, language
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    progress INT DEFAULT 0, -- 0-100
    total_items INT,
    completed_items INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_content_items_tenant ON content_schema.content_items(tenant_id);
CREATE INDEX idx_content_items_user ON content_schema.content_items(user_id);
CREATE INDEX idx_content_items_type ON content_schema.content_items(content_type);
CREATE INDEX idx_content_items_status ON content_schema.content_items(processing_status);
CREATE INDEX idx_content_items_uploaded ON content_schema.content_items(uploaded_at DESC);

CREATE INDEX idx_content_metadata_content ON content_schema.content_metadata(content_item_id);
CREATE INDEX idx_content_metadata_tenant ON content_schema.content_metadata(tenant_id);

CREATE INDEX idx_generated_content_content ON content_schema.generated_content(content_item_id);
CREATE INDEX idx_generated_content_tenant ON content_schema.generated_content(tenant_id);
CREATE INDEX idx_generated_content_type ON content_schema.generated_content(generation_type);
CREATE INDEX idx_generated_content_status ON content_schema.generated_content(status);

CREATE INDEX idx_content_templates_type ON content_schema.content_templates(question_type_code);
CREATE INDEX idx_content_templates_active ON content_schema.content_templates(is_active);

CREATE INDEX idx_generation_jobs_content ON content_schema.generation_jobs(content_item_id);
CREATE INDEX idx_generation_jobs_status ON content_schema.generation_jobs(status);
CREATE INDEX idx_generation_jobs_created ON content_schema.generation_jobs(created_at DESC);

-- Comments
COMMENT ON SCHEMA content_schema IS 'Content Service - File management and AI content generation';
COMMENT ON TABLE content_schema.content_items IS 'Uploaded content files (PDF, DOCX, etc.)';
COMMENT ON TABLE content_schema.content_metadata IS 'AI-extracted metadata from content';
COMMENT ON TABLE content_schema.generated_content IS 'AI-generated questions, flashcards, summaries';
COMMENT ON TABLE content_schema.content_templates IS 'AI generation prompt templates';
COMMENT ON TABLE content_schema.generation_jobs IS 'Async AI generation job tracking';

-- Sample template seeds (first 5 templates)
INSERT INTO content_schema.content_templates (
    question_type_code, 
    template_name, 
    description, 
    prompt_template, 
    system_message,
    is_system_default,
    display_order
) VALUES
('multiple_choice_single', 
 'PDF to Multiple Choice (Single Answer)', 
 'Generate multiple choice questions with one correct answer',
 'Based on the following text, generate {{count}} multiple-choice questions at {{difficulty}} difficulty level in {{language}} language.

Text:
{{content}}

Requirements:
- Each question should have 4 options (A, B, C, D)
- Only ONE correct answer
- Include explanation for the correct answer
- Difficulty: {{difficulty}}
- Language: {{language}}

Output as JSON array with this structure:
[{
  "stem": "Question text",
  "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correct_answer": "A",
  "explanation": "Why this is correct",
  "difficulty": "{{difficulty}}",
  "points": 5
}]',
 'You are an expert educator creating high-quality assessment questions. Focus on testing understanding, not memorization.',
 true,
 1),

('true_false', 
 'PDF to True/False Questions', 
 'Generate true or false questions',
 'Based on the following text, generate {{count}} true/false questions at {{difficulty}} difficulty level in {{language}} language.

Text:
{{content}}

Requirements:
- Clear, unambiguous statements
- Include explanation
- Mix of true and false answers
- Difficulty: {{difficulty}}

Output as JSON:
[{
  "stem": "Statement to evaluate",
  "correct_answer": true,
  "explanation": "Why this is true/false",
  "difficulty": "{{difficulty}}",
  "points": 3
}]',
 'You are an expert educator creating true/false questions that test comprehension.',
 true,
 2),

('short_answer', 
 'PDF to Short Answer Questions', 
 'Generate short answer questions',
 'Based on the following text, generate {{count}} short answer questions at {{difficulty}} difficulty level in {{language}} language.

Text:
{{content}}

Requirements:
- Questions require 1-3 sentence answers
- Include sample correct answer
- Focus on key concepts
- Difficulty: {{difficulty}}

Output as JSON:
[{
  "stem": "Question text",
  "sample_answer": "Expected answer",
  "keywords": ["key", "terms"],
  "difficulty": "{{difficulty}}",
  "points": 10
}]',
 'You are an expert educator creating short answer questions that assess understanding.',
 true,
 3),

('essay', 
 'PDF to Essay Questions', 
 'Generate essay/long answer questions',
 'Based on the following text, generate {{count}} essay questions at {{difficulty}} difficulty level in {{language}} language.

Text:
{{content}}

Requirements:
- Questions require detailed analysis
- Include grading rubric
- Focus on critical thinking
- Difficulty: {{difficulty}}

Output as JSON:
[{
  "stem": "Essay prompt",
  "rubric": {
    "content": "Understanding of concepts (40%)",
    "analysis": "Critical thinking (30%)",
    "structure": "Organization and clarity (20%)",
    "writing": "Grammar and style (10%)"
  },
  "sample_points": ["Point 1", "Point 2"],
  "difficulty": "{{difficulty}}",
  "points": 25
}]',
 'You are an expert educator creating essay questions that promote critical thinking.',
 true,
 4),

('fill_blank', 
 'PDF to Fill in the Blank', 
 'Generate fill-in-the-blank questions',
 'Based on the following text, generate {{count}} fill-in-the-blank questions at {{difficulty}} difficulty level in {{language}} language.

Text:
{{content}}

Requirements:
- Use _____ for blanks
- Include correct answer
- May have multiple blanks
- Difficulty: {{difficulty}}

Output as JSON:
[{
  "stem": "The _____ is the main component of _____.",
  "correct_answers": ["answer1", "answer2"],
  "case_sensitive": false,
  "difficulty": "{{difficulty}}",
  "points": 5
}]',
 'You are an expert educator creating fill-in-the-blank questions.',
 true,
 5);




