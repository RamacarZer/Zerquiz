using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Vurgulanan metin (highlight)
/// </summary>
public class Highlight : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public Guid ChapterId { get; set; }
    public BookChapter Chapter { get; set; } = null!;
    
    // Selected Text
    public string SelectedText { get; set; } = string.Empty;
    public int StartOffset { get; set; }
    public int EndOffset { get; set; }
    
    // Position
    public int PageNumber { get; set; }
    public string? PositionSelector { get; set; }
    
    // Appearance
    public string Color { get; set; } = "#FFFF00"; // Yellow by default
    public string? Style { get; set; } // underline, background, etc.
    
    // User Note (optional)
    public string? Note { get; set; }
    
    // Context
    public string? ContextBefore { get; set; }
    public string? ContextAfter { get; set; }
}

