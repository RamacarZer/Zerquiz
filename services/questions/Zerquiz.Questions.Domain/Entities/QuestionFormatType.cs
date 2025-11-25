using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru yazım formatı (çoktan seçmeli, doğru-yanlış, eşleştirme, vb.)
/// </summary>
public class QuestionFormatType : BaseEntity
{
    public string Code { get; set; } = string.Empty; // multiple_choice, true_false, matching, gap_fill
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ConfigSchema { get; set; } // JSONB - Format'a özel ayarlar
    public bool IsSystem { get; set; } = true; // Sistem tarafından tanımlı mı?
    public int DisplayOrder { get; set; } = 0;
}

