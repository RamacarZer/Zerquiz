using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru çözümü (metin, ses, video)
/// </summary>
public class QuestionSolution : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    
    public string Type { get; set; } = "text"; // text, audio, video
    public string Content { get; set; } = string.Empty; // JSONB - Çözüm içeriği
    public string? Language { get; set; } = "tr"; // tr, en
    public Guid AuthorId { get; set; } // Çözümü yapan kişi
}

/// <summary>
/// Çözüm içerik yapısı
/// </summary>
public class SolutionContent
{
    public string? Text { get; set; }
    public string? Latex { get; set; }
    public string? Html { get; set; }
    public string? AudioUrl { get; set; }
    public string? VideoUrl { get; set; }
}

