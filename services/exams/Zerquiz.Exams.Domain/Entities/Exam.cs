using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Sınav (matbu, online, offline)
/// </summary>
public class Exam : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Mode { get; set; } = "online"; // printed, online, offline
    public Guid? CurriculumId { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    public string Settings { get; set; } = "{}"; // JSONB - Shuffle, review settings
    public string Status { get; set; } = "draft"; // draft, scheduled, active, completed
    
    public ICollection<ExamSection> Sections { get; set; } = new List<ExamSection>();
    public ICollection<Booklet> Booklets { get; set; } = new List<Booklet>();
    public ICollection<ExamSession> Sessions { get; set; } = new List<ExamSession>();
}

