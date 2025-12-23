using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Yer imi
/// </summary>
public class Bookmark : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public Guid ChapterId { get; set; }
    public BookChapter Chapter { get; set; } = null!;
    
    // Position
    public int PageNumber { get; set; }
    public string? PositionSelector { get; set; } // CSS selector or character offset
    
    // User Notes
    public string? Title { get; set; }
    public string? Note { get; set; }
    public string? Color { get; set; } // Optional color coding
    
    // Context (surrounding text for preview)
    public string? ContextBefore { get; set; }
    public string? ContextAfter { get; set; }
}

