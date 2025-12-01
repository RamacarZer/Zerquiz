using System;

namespace Zerquiz.Content.Domain.Entities;

public class GeneratedContent
{
    public Guid Id { get; set; }
    public string TenantId { get; set; } = "";
    public Guid ContentItemId { get; set; }
    public string GenerationType { get; set; } = ""; // quiz, flashcard, summary, worksheet
    public string? QuestionTypeCode { get; set; }
    public string GeneratedData { get; set; } = ""; // JSONB
    public string? Prompt { get; set; }
    public string? AIProvider { get; set; }
    public string? AIModel { get; set; }
    public string Status { get; set; } = "draft"; // draft, reviewed, published, rejected
    public int UsageCount { get; set; } = 0;
    public string? Difficulty { get; set; }
    public string? Language { get; set; }
    public int ItemCount { get; set; }
    public string CreatedBy { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }

    // Navigation
    public ContentItem? ContentItem { get; set; }
}

public class ContentTemplate
{
    public Guid Id { get; set; }
    public string QuestionTypeCode { get; set; } = "";
    public string TemplateName { get; set; } = "";
    public string? Description { get; set; }
    public string PromptTemplate { get; set; } = "";
    public string? SystemMessage { get; set; }
    public string? ValidationRules { get; set; } // JSONB
    public string? ExampleOutput { get; set; } // JSONB
    public bool IsActive { get; set; } = true;
    public bool IsSystemDefault { get; set; } = false;
    public decimal Temperature { get; set; } = 0.7m;
    public int MaxTokens { get; set; } = 2000;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class GenerationJob
{
    public Guid Id { get; set; }
    public string TenantId { get; set; } = "";
    public Guid ContentItemId { get; set; }
    public string GenerationType { get; set; } = "";
    public string Configuration { get; set; } = ""; // JSONB
    public string Status { get; set; } = "pending"; // pending, processing, completed, failed
    public int Progress { get; set; } = 0; // 0-100
    public int TotalItems { get; set; }
    public int CompletedItems { get; set; } = 0;
    public string? ErrorMessage { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string CreatedBy { get; set; } = "";
    public DateTime CreatedAt { get; set; }

    // Navigation
    public ContentItem? ContentItem { get; set; }
}

