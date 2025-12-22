-- Analytics Enhancement for Grading Service
-- Schema: grading_schema

-- Student Progress Table
CREATE TABLE IF NOT EXISTS grading_schema.student_progress (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    subject_id UUID,
    topic_id UUID,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    mastery_level DECIMAL(5,2) DEFAULT 0, -- 0-100
    last_activity_date TIMESTAMP,
    streak_days INT DEFAULT 0,
    weak_areas JSONB,
    strong_areas JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Learning Style Profile Table
CREATE TABLE IF NOT EXISTS grading_schema.learning_style_profiles (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    visual_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    auditory_score DECIMAL(5,2) DEFAULT 0,
    kinesthetic_score DECIMAL(5,2) DEFAULT 0,
    preferred_question_types JSONB,
    response_time_average DECIMAL(10,2), -- seconds
    accuracy_by_type JSONB,
    last_analyzed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Study Recommendations Table
CREATE TABLE IF NOT EXISTS grading_schema.study_recommendations (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL, -- topic_focus, practice_more, review
    priority VARCHAR(20) NOT NULL, -- high, medium, low
    title VARCHAR(300) NOT NULL,
    description TEXT,
    topic_id UUID,
    resource_type VARCHAR(50), -- quiz, video, reading
    reasoning TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, viewed, completed, dismissed
    generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    viewed_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Classroom Dashboard Table (Aggregate View)
CREATE TABLE IF NOT EXISTS grading_schema.classroom_dashboards (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    teacher_id VARCHAR(50) NOT NULL,
    class_id VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    average_score DECIMAL(5,2),
    participation_rate DECIMAL(5,2),
    top_performers JSONB,
    need_help JSONB,
    question_difficulty_distribution JSONB,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_progress_tenant_student ON grading_schema.student_progress(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_subject ON grading_schema.student_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_topic ON grading_schema.student_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_learning_style_tenant_student ON grading_schema.learning_style_profiles(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_study_recommendations_tenant_student ON grading_schema.study_recommendations(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_study_recommendations_status ON grading_schema.study_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_classroom_dashboards_teacher ON grading_schema.classroom_dashboards(teacher_id);

COMMENT ON TABLE grading_schema.student_progress IS 'Tracks student progress by subject and topic';
COMMENT ON TABLE grading_schema.learning_style_profiles IS 'AI-analyzed learning style profiles for students';
COMMENT ON TABLE grading_schema.study_recommendations IS 'AI-generated study recommendations for students';
COMMENT ON TABLE grading_schema.classroom_dashboards IS 'Aggregate classroom analytics for teachers';




