using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Sınav sonucu
/// </summary>
public class ExamResult : BaseEntity
{
    public Guid ExamSessionId { get; set; }
    public Guid UserId { get; set; }
    public Guid ExamId { get; set; }
    
    public decimal TotalScore { get; set; }
    public decimal MaxScore { get; set; }
    public decimal Percentage { get; set; }
    public int CorrectCount { get; set; }
    public int WrongCount { get; set; }
    public int EmptyCount { get; set; }
    
    public string Breakdown { get; set; } = "{}"; // JSONB - Branş, konu bazlı detaylar
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;
}

