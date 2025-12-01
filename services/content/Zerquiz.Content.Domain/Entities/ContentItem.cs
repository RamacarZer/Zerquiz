using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Content.Domain.Entities;

/// <summary>
/// Content item - PDF, DOCX, PPTX, etc.
/// </summary>
public class ContentItem : BaseEntity
{
    public Guid UserId { get; set; } // Creator
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // File Information
    public string ContentType { get; set; } = string.Empty; // pdf, docx, pptx, txt
    public string FileKey { get; set; } = string.Empty; // Storage key
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string? OriginalFileName { get; set; }
    
    // Processing
    public string ProcessingStatus { get; set; } = "pending"; // pending, processing, ready, failed
    public DateTime? ProcessedAt { get; set; }
    public string? ProcessingError { get; set; }
    
    // Metadata
    public string[]? Tags { get; set; }
    public new string? Metadata { get; set; } // JSONB - Additional metadata
    
    // Timestamps
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public ContentMetadata? ExtractedMetadata { get; set; }
    public ICollection<GeneratedContent> GeneratedContents { get; set; } = new List<GeneratedContent>();
}

/// <summary>
/// Extracted metadata from content
/// </summary>
public class ContentMetadata : BaseEntity
{
    public Guid ContentItemId { get; set; }
    public ContentItem ContentItem { get; set; } = null!;
    
    // Extracted Data
    public string? ExtractedText { get; set; } // Full text
    public string? Summary { get; set; } // AI-generated summary
    public string[]? KeyConcepts { get; set; } // Key concepts/keywords
    
    // Statistics
    public int? PageCount { get; set; }
    public int? WordCount { get; set; }
    public int? EstimatedReadingTimeMinutes { get; set; }
    public string? LanguageDetected { get; set; }
    
    // Timestamps
    public DateTime ExtractedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// AI-generated content from ContentItem
/// </summary>
public class GeneratedContent : BaseEntity
{
    public Guid ContentItemId { get; set; }
    public ContentItem ContentItem { get; set; } = null!;
    
    // Generation Info
    public string GenerationType { get; set; } = string.Empty; // quiz, flashcard, summary, worksheet
    public string? QuestionTypeCode { get; set; } // If quiz
    public string GeneratedData { get; set; } = string.Empty; // JSONB - Generated content
    
    // AI Details
    public string? Prompt { get; set; } // Used prompt
    public string AIProvider { get; set; } = string.Empty; // openai, azure, etc.
    public string AIModel { get; set; } = string.Empty;
    public int TokensUsed { get; set; }
    
    // Status
    public string GenerationStatus { get; set; } = "pending"; // pending, processing, completed, failed, approved, rejected
    public DateTime? CompletedAt { get; set; }
    public string? ErrorMessage { get; set; }
    
    // Usage
    public int UsageCount { get; set; }
    public DateTime? LastUsedAt { get; set; }
}

