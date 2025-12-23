using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Kitap medya varlıkları (görseller, audio, video)
/// </summary>
public class BookAsset : BaseEntity
{
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    public Guid? ChapterId { get; set; } // Optional link to specific chapter
    
    // Asset Type
    public string AssetType { get; set; } = string.Empty; // image, audio, video, document
    public string MimeType { get; set; } = string.Empty;
    
    // File Information
    public string FileKey { get; set; } = string.Empty; // Storage key
    public string OriginalFileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? PublicUrl { get; set; }
    
    // Display
    public string? Title { get; set; }
    public string? Caption { get; set; }
    public string? AltText { get; set; } // For accessibility
    
    // Dimensions (for images/videos)
    public int? Width { get; set; }
    public int? Height { get; set; }
    public int? DurationSeconds { get; set; } // For audio/video
    
    // Usage
    public int DisplayOrder { get; set; } = 0;
    public bool IsCoverImage { get; set; } = false;
    
    // Metadata
    public new string? Metadata { get; set; }
}

