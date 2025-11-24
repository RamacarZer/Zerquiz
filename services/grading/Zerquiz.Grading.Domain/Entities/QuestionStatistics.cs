namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Soru istatistikleri (zorluk analizi için)
/// </summary>
public class QuestionStatistics
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid QuestionId { get; set; }
    
    public int TotalAttempts { get; set; }
    public int CorrectCount { get; set; }
    public int WrongCount { get; set; }
    public int EmptyCount { get; set; }
    public decimal AvgTimeSeconds { get; set; }
    public decimal DifficultyIndex { get; set; } // 0-1 arası, hesaplanmış zorluk
    
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

