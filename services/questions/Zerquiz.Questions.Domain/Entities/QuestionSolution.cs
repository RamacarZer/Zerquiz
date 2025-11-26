using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru çözümleri (text, audio, video)
/// </summary>
public class QuestionSolution : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    
    public string SolutionType { get; set; } = "text"; // text, audio, video, image
    public int DisplayOrder { get; set; } = 1;
    
    // Text solution
    public string? TextContent { get; set; }
    
    // Media solution (audio/video/image)
    public string? MediaUrl { get; set; }
    public string? MediaStorageKey { get; set; } // S3/Blob key
    public string? MediaMimeType { get; set; }
    public long? MediaFileSize { get; set; }
    public int? MediaDurationSeconds { get; set; } // For audio/video
    
    // Metadata
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? AuthorName { get; set; }
    public bool IsOfficial { get; set; } = true; // Official vs community solution
    public bool IsVisible { get; set; } = true;
    
    // Engagement
    public int ViewCount { get; set; } = 0;
    public int LikeCount { get; set; } = 0;
    public int DislikeCount { get; set; } = 0;
    
    // Transcript for audio/video
    public string? Transcript { get; set; }
}
