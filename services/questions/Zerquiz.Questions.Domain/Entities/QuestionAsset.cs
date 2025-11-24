using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru varlıkları (resim, ses, video, LaTeX dosyaları)
/// </summary>
public class QuestionAsset : BaseEntity
{
    public Guid QuestionVersionId { get; set; }
    public QuestionVersion QuestionVersion { get; set; } = null!;
    
    public string Type { get; set; } = string.Empty; // image, audio, video, latex, svg, json
    public string FileName { get; set; } = string.Empty;
    public string StorageKey { get; set; } = string.Empty; // Object storage key
    public string Url { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? MimeType { get; set; }
    public string? Position { get; set; } // header, stem, option_a, etc.
}

