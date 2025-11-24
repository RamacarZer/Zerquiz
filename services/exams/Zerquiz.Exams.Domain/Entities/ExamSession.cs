using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Kullanıcının sınav oturumu
/// </summary>
public class ExamSession : BaseEntity
{
    public Guid ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public Guid? BookletId { get; set; }
    public Booklet? Booklet { get; set; }
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }
    public string Status { get; set; } = "in_progress"; // in_progress, submitted, evaluated
    public string Data { get; set; } = "{}"; // JSONB - Time tracking, pause/resume
}

