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
    public string? ExamName { get; set; } // Exam adı cache
    
    // Scoring
    public decimal Score { get; set; } // Ana skor
    public decimal TotalScore { get; set; }
    public decimal MaxScore { get; set; }
    public decimal Percentage { get; set; }
    public decimal SuccessRate { get; set; } // Başarı oranı %
    
    // Counts
    public int CorrectCount { get; set; }
    public int WrongCount { get; set; }
    public int EmptyCount { get; set; }
    public int TotalQuestions { get; set; }
    
    // Status & Timing  
    public new string Status { get; set; } = "in_progress"; // in_progress, completed, abandoned
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TimeSpent { get; set; } // seconds
    
    public string Breakdown { get; set; } = "{}"; // JSONB - Branş, konu bazlı detaylar
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
}

