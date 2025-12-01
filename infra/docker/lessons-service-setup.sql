-- Lessons Service Database Setup
-- Schema: lessons_schema

-- Create schema
CREATE SCHEMA IF NOT EXISTS lessons_schema;

-- Lesson Templates Table
CREATE TABLE lessons_schema.lesson_templates (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    structure JSONB NOT NULL,
    is_system_reserved BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lesson Plans Table
CREATE TABLE lessons_schema.lesson_plans (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    subject VARCHAR(100),
    grade VARCHAR(50),
    duration INT, -- minutes
    lesson_template_id UUID REFERENCES lessons_schema.lesson_templates(id),
    objectives JSONB,
    materials_needed JSONB,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    generation_source VARCHAR(20) DEFAULT 'manual', -- manual, template, ai
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lesson Activities Table
CREATE TABLE lessons_schema.lesson_activities (
    id UUID PRIMARY KEY,
    lesson_plan_id UUID NOT NULL REFERENCES lessons_schema.lesson_plans(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- warm_up, main, practice, closing
    title VARCHAR(300) NOT NULL,
    description TEXT,
    duration INT, -- minutes
    instructions TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Assignments Table
CREATE TABLE lessons_schema.assignments (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    lesson_plan_id UUID REFERENCES lessons_schema.lesson_plans(id) ON DELETE SET NULL,
    created_by VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP,
    points DECIMAL(10,2),
    assignment_type VARCHAR(50), -- homework, project, research, etc.
    rubric_id UUID, -- FK to grading service
    attached_resources JSONB,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, closed
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Assignment Submissions Table
CREATE TABLE lessons_schema.assignment_submissions (
    id UUID PRIMARY KEY,
    assignment_id UUID NOT NULL REFERENCES lessons_schema.assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending', -- pending, graded, late
    submission_text TEXT,
    submission_files JSONB,
    score DECIMAL(10,2),
    feedback TEXT,
    rubric_scores JSONB,
    graded_at TIMESTAMP,
    graded_by VARCHAR(50)
);

-- Worksheets Table
CREATE TABLE lessons_schema.worksheets (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    content_item_id UUID, -- FK to content service
    created_by VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    instructions TEXT,
    questions JSONB NOT NULL,
    answer_key JSONB,
    format VARCHAR(20) DEFAULT 'pdf', -- pdf, docx, html
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_lesson_plans_tenant ON lessons_schema.lesson_plans(tenant_id);
CREATE INDEX idx_lesson_plans_created_by ON lessons_schema.lesson_plans(created_by);
CREATE INDEX idx_lesson_plans_status ON lessons_schema.lesson_plans(status);
CREATE INDEX idx_lesson_activities_lesson_plan ON lessons_schema.lesson_activities(lesson_plan_id);
CREATE INDEX idx_assignments_tenant ON lessons_schema.assignments(tenant_id);
CREATE INDEX idx_assignments_created_by ON lessons_schema.assignments(created_by);
CREATE INDEX idx_assignments_status ON lessons_schema.assignments(status);
CREATE INDEX idx_assignment_submissions_assignment ON lessons_schema.assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON lessons_schema.assignment_submissions(student_id);
CREATE INDEX idx_worksheets_tenant ON lessons_schema.worksheets(tenant_id);

-- Seed Lesson Templates (8 Templates)
INSERT INTO lessons_schema.lesson_templates (id, code, name, description, structure, is_system_reserved, display_order) VALUES
(gen_random_uuid(), '5e_model', '5E Learning Model', 'Engage, Explore, Explain, Elaborate, Evaluate - A constructivist teaching approach', 
 '{"phases": [
   {"name": "Engage", "duration": 10, "description": "Hook students attention and assess prior knowledge"},
   {"name": "Explore", "duration": 20, "description": "Hands-on exploration and investigation"},
   {"name": "Explain", "duration": 15, "description": "Introduce formal concepts and vocabulary"},
   {"name": "Elaborate", "duration": 20, "description": "Apply concepts in new contexts"},
   {"name": "Evaluate", "duration": 10, "description": "Assess understanding and provide feedback"}
 ]}'::jsonb, 
 true, 1),

(gen_random_uuid(), 'project_based', 'Project-Based Learning', 'Student-driven inquiry and real-world problem solving', 
 '{"phases": [
   {"name": "Problem Introduction", "duration": 15, "description": "Present driving question or challenge"},
   {"name": "Research & Planning", "duration": 30, "description": "Gather information and plan approach"},
   {"name": "Design & Development", "duration": 45, "description": "Create solution or product"},
   {"name": "Presentation", "duration": 20, "description": "Share findings with audience"},
   {"name": "Reflection", "duration": 10, "description": "Evaluate process and learning"}
 ]}'::jsonb, 
 true, 2),

(gen_random_uuid(), 'flipped_classroom', 'Flipped Classroom', 'Pre-class learning followed by in-class active application', 
 '{"phases": [
   {"name": "Pre-Class", "duration": 0, "description": "Video or reading assignment at home"},
   {"name": "Check Understanding", "duration": 10, "description": "Quiz or discussion on pre-class material"},
   {"name": "Active Learning", "duration": 40, "description": "Problem-solving, projects, discussions"},
   {"name": "Practice", "duration": 20, "description": "Guided and independent practice"},
   {"name": "Assessment", "duration": 10, "description": "Exit ticket or formative assessment"}
 ]}'::jsonb, 
 true, 3),

(gen_random_uuid(), 'direct_instruction', 'Direct Instruction', 'Traditional teacher-led explicit instruction', 
 '{"phases": [
   {"name": "Warm-Up", "duration": 10, "description": "Review previous learning and activate prior knowledge"},
   {"name": "Present New Material", "duration": 20, "description": "Explicit teaching of new concepts"},
   {"name": "Guided Practice", "duration": 15, "description": "Teacher-led practice with immediate feedback"},
   {"name": "Independent Practice", "duration": 20, "description": "Students work independently"},
   {"name": "Closure", "duration": 10, "description": "Summarize learning and assess understanding"}
 ]}'::jsonb, 
 true, 4),

(gen_random_uuid(), 'inquiry_based', 'Inquiry-Based Learning', 'Student-led questioning and investigation', 
 '{"phases": [
   {"name": "Ask", "duration": 10, "description": "Generate questions and identify what to investigate"},
   {"name": "Investigate", "duration": 30, "description": "Conduct research and experiments"},
   {"name": "Create", "duration": 25, "description": "Organize findings and develop explanations"},
   {"name": "Discuss", "duration": 20, "description": "Share findings and compare with peers"},
   {"name": "Reflect", "duration": 10, "description": "Evaluate process and learning outcomes"}
 ]}'::jsonb, 
 true, 5),

(gen_random_uuid(), 'jigsaw', 'Jigsaw Cooperative Learning', 'Group collaboration with expert specialization', 
 '{"phases": [
   {"name": "Introduction", "duration": 10, "description": "Overview of topic and group assignments"},
   {"name": "Expert Groups", "duration": 20, "description": "Specialists learn their assigned topic"},
   {"name": "Jigsaw Groups", "duration": 25, "description": "Experts teach their topic to home group"},
   {"name": "Assessment", "duration": 15, "description": "Individual or group assessment"},
   {"name": "Reflection", "duration": 10, "description": "Discuss learning and collaboration"}
 ]}'::jsonb, 
 true, 6),

(gen_random_uuid(), 'socratic_seminar', 'Socratic Seminar', 'Student-led discussion based on text or question', 
 '{"phases": [
   {"name": "Preparation", "duration": 0, "description": "Pre-read text or prepare for discussion"},
   {"name": "Opening", "duration": 10, "description": "Review norms and introduce opening question"},
   {"name": "Inner Circle Discussion", "duration": 25, "description": "Students discuss while others observe"},
   {"name": "Outer Circle Feedback", "duration": 10, "description": "Observers provide feedback"},
   {"name": "Reflection", "duration": 10, "description": "Process discussion and key insights"}
 ]}'::jsonb, 
 true, 7),

(gen_random_uuid(), 'problem_solving', 'Problem-Solving Workshop', 'Collaborative problem-solving with real-world scenarios', 
 '{"phases": [
   {"name": "Problem Presentation", "duration": 10, "description": "Introduce problem and constraints"},
   {"name": "Understand & Analyze", "duration": 15, "description": "Break down problem and identify knowns/unknowns"},
   {"name": "Brainstorm Solutions", "duration": 20, "description": "Generate multiple possible approaches"},
   {"name": "Implement Solution", "duration": 25, "description": "Work through solution systematically"},
   {"name": "Verify & Reflect", "duration": 10, "description": "Check solution and reflect on process"}
 ]}'::jsonb, 
 true, 8);

COMMENT ON SCHEMA lessons_schema IS 'Lessons Service - Lesson plans, assignments, templates, worksheets';
COMMENT ON TABLE lessons_schema.lesson_templates IS 'Pre-defined lesson plan templates (5E, PBL, etc.)';
COMMENT ON TABLE lessons_schema.lesson_plans IS 'Teacher-created lesson plans';
COMMENT ON TABLE lessons_schema.lesson_activities IS 'Individual activities within a lesson plan';
COMMENT ON TABLE lessons_schema.assignments IS 'Homework, projects, and other student assignments';
COMMENT ON TABLE lessons_schema.assignment_submissions IS 'Student submissions for assignments';
COMMENT ON TABLE lessons_schema.worksheets IS 'AI-generated or manual worksheets';

