using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Sınav oturumu - öğrencinin sınav çözüm kaydı
/// </summary>
public class ExamSession : BaseEntity
{
    public Guid ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public Guid? BookletId { get; set; }
    public Booklet? Booklet { get; set; }
    
    // Session state
    public string SessionStatus { get; set; } = "not_started"; // not_started, in_progress, paused, completed, submitted, timed_out
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    
    // Timing
    public int TimeSpentSeconds { get; set; } = 0;
    public int RemainingSeconds { get; set; }
    public DateTime? LastActivityAt { get; set; }
    
    // Progress tracking
    public int CurrentQuestionIndex { get; set; } = 0;
    public int TotalQuestions { get; set; }
    public int AnsweredCount { get; set; } = 0;
    public int MarkedForReviewCount { get; set; } = 0;
    
    // Session metadata
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? DeviceInfo { get; set; }
    
    // Integrity checks
    public int TabSwitchCount { get; set; } = 0;
    public int FullscreenExitCount { get; set; } = 0;
    public DateTime? LastIntegrityCheckAt { get; set; }
    public bool IsIntegrityViolated { get; set; } = false;
    
    // Answers (stored in Grading service, but tracking here)
    public int? TotalScore { get; set; }
    public decimal? SuccessRate { get; set; }
}
