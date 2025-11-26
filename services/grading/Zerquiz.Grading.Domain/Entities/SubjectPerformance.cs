using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Branş bazlı performans analizi
/// </summary>
public class SubjectPerformance : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    
    // Exam Statistics
    public int TotalExams { get; set; }
    public int CompletedExams { get; set; }
    public decimal AverageScore { get; set; }
    public decimal HighestScore { get; set; }
    public decimal LowestScore { get; set; }
    
    // Question Statistics
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int EmptyAnswers { get; set; }
    public decimal SuccessRate { get; set; } // %
    
    // Time Statistics
    public int TotalTimeSpentSeconds { get; set; }
    public decimal AverageTimePerQuestion { get; set; } // seconds
    
    // Difficulty Analysis
    public int EasyQuestionsCorrect { get; set; }
    public int EasyQuestionsTotal { get; set; }
    public int MediumQuestionsCorrect { get; set; }
    public int MediumQuestionsTotal { get; set; }
    public int HardQuestionsCorrect { get; set; }
    public int HardQuestionsTotal { get; set; }
    
    // Learning Outcomes (Kazanımlar)
    public int MasteredOutcomes { get; set; } // Tam öğrenilen
    public int PartialOutcomes { get; set; } // Kısmen öğrenilen
    public int WeakOutcomes { get; set; } // Zayıf kazanımlar
    
    // Trend
    public string Trend { get; set; } = "stable"; // improving, declining, stable
    public decimal TrendPercentage { get; set; } // +5%, -3%, vb.
    
    // Last Update
    public DateTime LastExamDate { get; set; }
    public DateTime LastCalculatedAt { get; set; } = DateTime.UtcNow;
}

