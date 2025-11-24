using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Sınav bölümü (örn: Matematik, Fen, vb.)
/// </summary>
public class ExamSection : BaseEntity
{
    public Guid ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public int? TimeLimit { get; set; } // Dakika cinsinden
    public string ScoringPolicy { get; set; } = "{}"; // JSONB - Negatif puan, katsayılar
    
    public ICollection<ExamQuestion> Questions { get; set; } = new List<ExamQuestion>();
}

