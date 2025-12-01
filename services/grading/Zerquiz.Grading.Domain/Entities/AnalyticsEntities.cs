using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Student Progress Tracking - Öğrenci ilerleme takibi
/// </summary>
public class StudentProgress : BaseEntity
{
    public Guid StudentId { get; set; }
    public Guid? SubjectId { get; set; }
    public Guid? TopicId { get; set; }
    
    // Performance metrics
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public decimal AccuracyRate { get; set; } // Percentage
    public decimal MasteryLevel { get; set; } // 0-100 scale
    
    // Activity tracking
    public DateTime? LastActivityDate { get; set; }
    public int StreakDays { get; set; } // Consecutive active days
    public int TotalStudyMinutes { get; set; }
    
    // Strengths & Weaknesses (JSONB)
    public string? WeakAreasJson { get; set; } // Array of topic IDs
    public string? StrongAreasJson { get; set; } // Array of topic IDs
    
    // Trend data (JSONB)
    public string? PerformanceTrendJson { get; set; } // Time-series data
    
    // Quick indicators
    public string TrendDirection { get; set; } = "stable"; // improving, declining, stable
    public bool NeedsAttention { get; set; } // Flagged by AI/rules
}

/// <summary>
/// Learning Style Profile - AI-powered learning style analysis
/// </summary>
public class LearningStyleProfile : BaseEntity
{
    public Guid StudentId { get; set; }
    
    // VARK Model scores (0-100)
    public decimal VisualScore { get; set; }
    public decimal AuditoryScore { get; set; }
    public decimal KinestheticScore { get; set; }
    public decimal ReadingWritingScore { get; set; }
    
    // Dominant style
    public string DominantStyle { get; set; } = "visual"; // visual, auditory, kinesthetic, reading_writing
    
    // Question type preferences (JSONB)
    public string? PreferredQuestionTypesJson { get; set; } // Array of question type codes
    
    // Performance by question type (JSONB)
    public string? AccuracyByTypeJson { get; set; } // { "mcq": 85, "essay": 70, ... }
    
    // Timing analysis
    public decimal AverageResponseTimeSeconds { get; set; }
    public string PacePreference { get; set; } = "moderate"; // slow, moderate, fast
    
    // Analysis metadata
    public DateTime LastAnalyzedAt { get; set; } = DateTime.UtcNow;
    public int DataPointsCount { get; set; } // How many exams analyzed
    public decimal ConfidenceLevel { get; set; } = 0; // 0-100, AI confidence
}

/// <summary>
/// Study Recommendation - AI-generated personalized recommendations
/// </summary>
public class StudyRecommendation : BaseEntity
{
    public Guid StudentId { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    
    // Recommendation details
    public string RecommendationType { get; set; } = string.Empty; // topic_focus, practice_more, review, take_break
    public string Priority { get; set; } = "medium"; // high, medium, low
    
    // Target
    public Guid? TargetTopicId { get; set; }
    public Guid? TargetSubjectId { get; set; }
    public string? ResourceType { get; set; } // quiz, video, reading, practice
    
    // AI reasoning
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? AIReasoning { get; set; } // Why this recommendation
    
    // Suggested actions (JSONB)
    public string? SuggestedActionsJson { get; set; } // Array of action objects
    
    // Status tracking
    public string RecommendationStatus { get; set; } = "pending"; // pending, viewed, in_progress, completed, dismissed
    public DateTime? ViewedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Effectiveness tracking
    public int? EffectivenessRating { get; set; } // 1-5, student feedback
}

/// <summary>
/// Classroom Dashboard - Aggregated teacher view
/// </summary>
public class ClassroomDashboard : BaseEntity
{
    public Guid TeacherId { get; set; }
    public Guid? ClassId { get; set; } // Optional: specific class or all classes
    
    // Date range
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Aggregate metrics (calculated, stored for performance)
    public decimal AverageScore { get; set; }
    public decimal ParticipationRate { get; set; }
    public int TotalStudents { get; set; }
    public int ActiveStudents { get; set; }
    public int TotalExams { get; set; }
    public int TotalSubmissions { get; set; }
    
    // Student lists (JSONB)
    public string? TopPerformersJson { get; set; } // Top 5-10 students
    public string? NeedHelpJson { get; set; } // Students flagged for attention
    
    // Question analytics (JSONB)
    public string? QuestionDifficultyDistributionJson { get; set; } // { "easy": 30%, "medium": 50%, ... }
    public string? PopularTopicsJson { get; set; }
    public string? ChallengingTopicsJson { get; set; }
    
    // Trends (JSONB)
    public string? ScoreTrendsJson { get; set; } // Time-series
    public string? EngagementTrendsJson { get; set; }
    
    // Cache metadata
    public DateTime LastCalculatedAt { get; set; } = DateTime.UtcNow;
    public bool IsStale { get; set; } // Needs recalculation
}

