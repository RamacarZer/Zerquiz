using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Lessons.Domain.Entities;

/// <summary>
/// Lesson Plan - Ders Planı
/// </summary>
public class LessonPlan : BaseEntity
{
    public Guid CreatedBy { get; set; } // Teacher ID
    
    // Basic Info
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? SubjectId { get; set; } // From Curriculum service
    public string? SubjectName { get; set; } // Cached for quick access
    public string Grade { get; set; } = string.Empty; // "10", "11", "12", etc.
    public int DurationMinutes { get; set; } = 45;
    
    // Template
    public Guid? LessonTemplateId { get; set; }
    public LessonTemplate? LessonTemplate { get; set; }
    
    // Content
    public string[] Objectives { get; set; } = Array.Empty<string>(); // Learning objectives
    public string[] MaterialsNeeded { get; set; } = Array.Empty<string>(); // Required materials
    public string? Assessment { get; set; } // How to assess learning
    public string? Notes { get; set; } // Teacher notes
    
    // Generation Source
    public string GenerationSource { get; set; } = "manual"; // manual, template, ai
    public Guid? SourceContentId { get; set; } // If generated from ContentItem
    
    // Publishing
    public string PublishStatus { get; set; } = "draft"; // draft, published, archived
    public DateTime? PublishedAt { get; set; }
    
    // Usage tracking
    public int UsageCount { get; set; } // How many times used/duplicated
    public DateTime? LastUsedAt { get; set; }
    
    // Navigation
    public ICollection<LessonActivity> Activities { get; set; } = new List<LessonActivity>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}

/// <summary>
/// Lesson Activity - Ders aktivitesi/etkinliği
/// </summary>
public class LessonActivity : BaseEntity
{
    public Guid LessonPlanId { get; set; }
    public LessonPlan LessonPlan { get; set; } = null!;
    
    public string ActivityType { get; set; } = string.Empty; // warm_up, main, practice, closing, evaluation
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public string? Instructions { get; set; } // Rich text - Step by step
    public int DisplayOrder { get; set; }
    
    // Resources
    public string[]? ResourceIds { get; set; } // ContentItem IDs
    public string? MaterialsNeeded { get; set; }
}

/// <summary>
/// Lesson Template - Ders planı şablonu (5E, Project-based, etc.)
/// </summary>
public class LessonTemplate : BaseEntity
{
    public string Code { get; set; } = string.Empty; // 5e_model, project_based, etc.
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    
    // Template Structure (JSONB)
    public string StructureJson { get; set; } = "{}"; // Activity phases definition
    
    // Metadata
    public string[]? BestFor { get; set; } // "Active learning", "Group work", etc.
    public string? EstimatedDuration { get; set; } // "45-60 minutes"
    public int DisplayOrder { get; set; }
    public bool IsSystemReserved { get; set; } // Can't be deleted
    
    // Usage
    public int UsageCount { get; set; }
}

/// <summary>
/// Assignment - Ödev/Görev
/// </summary>
public class Assignment : BaseEntity
{
    public Guid? LessonPlanId { get; set; } // Optional - can be standalone
    public LessonPlan? LessonPlan { get; set; }
    
    public Guid CreatedBy { get; set; } // Teacher ID
    
    // Basic Info
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Instructions { get; set; } = string.Empty; // Rich text
    
    // Classification
    public string AssignmentType { get; set; } = "homework"; // From definitions
    public Guid? SubjectId { get; set; }
    public string? SubjectName { get; set; }
    public string? Grade { get; set; }
    
    // Timing
    public DateTime? StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? LateSubmissionDeadline { get; set; }
    
    // Grading
    public int MaxPoints { get; set; } = 100;
    public Guid? RubricId { get; set; } // From Grading service
    public bool AllowLateSubmission { get; set; }
    public int? LateSubmissionPenalty { get; set; } // Percentage
    
    // Resources
    public string[]? AttachedResourceIds { get; set; } // ContentItem IDs
    
    // Publishing & Assignment
    public string PublishStatus { get; set; } = "draft"; // draft, published, closed
    public DateTime? PublishedAt { get; set; }
    public string[]? AssignedToUserIds { get; set; } // Student IDs (can be empty = all class)
    public Guid? AssignedToClassId { get; set; } // Class/Group ID
    
    // Generation
    public string GenerationSource { get; set; } = "manual"; // manual, ai, template
    public Guid? SourceContentId { get; set; }
    
    // Statistics
    public int TotalAssigned { get; set; }
    public int SubmissionCount { get; set; }
    public int GradedCount { get; set; }
    public decimal? AverageScore { get; set; }
    
    // Navigation
    public ICollection<AssignmentSubmission> Submissions { get; set; } = new List<AssignmentSubmission>();
}

/// <summary>
/// Assignment Submission - Ödev teslimi
/// </summary>
public class AssignmentSubmission : BaseEntity
{
    public Guid AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;
    
    public Guid StudentId { get; set; }
    public string? StudentName { get; set; } // Cached for quick access
    
    // Submission
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public string SubmissionStatus { get; set; } = "submitted"; // draft, submitted, graded, late
    public bool IsLate { get; set; }
    
    // Content
    public string? SubmissionText { get; set; } // Rich text response
    public string[]? SubmissionFileIds { get; set; } // Uploaded files (ContentItem IDs)
    public string? SubmissionUrl { get; set; } // External link (Google Drive, etc.)
    
    // Grading
    public decimal? Score { get; set; }
    public string? Grade { get; set; } // Letter grade (A+, B, etc.)
    public string? TeacherFeedback { get; set; } // Rich text
    public string? RubricScoresJson { get; set; } // JSONB - Criterion-wise scores
    public Guid? GradedBy { get; set; }
    public DateTime? GradedAt { get; set; }
    
    // AI Assistance
    public string? AISuggestedScore { get; set; }
    public string? AIFeedback { get; set; }
    
    // Version tracking (for resubmissions)
    public int SubmissionVersion { get; set; } = 1;
    public Guid? PreviousSubmissionId { get; set; }
}

/// <summary>
/// Worksheet - AI-generated çalışma yaprağı
/// </summary>
public class Worksheet : BaseEntity
{
    public Guid? SourceContentId { get; set; } // From ContentItem
    public Guid CreatedBy { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    
    // Content
    public string QuestionsJson { get; set; } = "[]"; // JSONB - Generated questions
    public string? AnswerKeyJson { get; set; } // JSONB - Answer key
    
    // Format
    public string OutputFormat { get; set; } = "html"; // html, pdf, docx
    public string? GeneratedFilePath { get; set; }
    
    // Metadata
    public Guid? SubjectId { get; set; }
    public string? Grade { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    
    // Usage
    public int UsageCount { get; set; }
    public DateTime? LastUsedAt { get; set; }
}
