namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru versiyonu (içerik değişikliklerini takip eder)
/// </summary>
public class QuestionVersion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public Guid TenantId { get; set; }
    
    public int VersionNumber { get; set; }
    public string Content { get; set; } = string.Empty; // JSONB - Soru içeriği
    
    public Guid? CreatedBy { get; set; } // Made nullable to match BaseEntity convention
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<QuestionAsset> Assets { get; set; } = new List<QuestionAsset>();
}

/// <summary>
/// Soru içerik yapısı (JSONB olarak saklanacak)
/// </summary>
public class QuestionContent
{
    public ContentBlock? Header { get; set; }
    public List<ContentBlock>? Premises { get; set; }
    public ContentBlock Stem { get; set; } = new();
    public List<OptionBlock>? Options { get; set; }
    public List<string> CorrectAnswers { get; set; } = new();
    public List<AssetReference>? Assets { get; set; }
}

public class ContentBlock
{
    public string? Text { get; set; }
    public string? Latex { get; set; }
    public string? Html { get; set; }
}

public class OptionBlock
{
    public string Key { get; set; } = string.Empty; // A, B, C, D
    public string? Text { get; set; }
    public string? Latex { get; set; }
    public string? Html { get; set; }
}

public class AssetReference
{
    public string Type { get; set; } = string.Empty; // image, audio, video
    public string Url { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty; // header, stem, option_a
}

