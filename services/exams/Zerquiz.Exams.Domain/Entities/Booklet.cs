using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Kitapçık (A, B, C, D tipleri - soru/şık karıştırmalı)
/// </summary>
public class Booklet : BaseEntity
{
    public Guid ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    
    public string Type { get; set; } = "A"; // A, B, C, D
    public string Code { get; set; } = string.Empty; // Unique booklet code
    public string Settings { get; set; } = "{}"; // JSONB - Shuffle seeds
    
    public ICollection<BookletQuestion> Questions { get; set; } = new List<BookletQuestion>();
}

