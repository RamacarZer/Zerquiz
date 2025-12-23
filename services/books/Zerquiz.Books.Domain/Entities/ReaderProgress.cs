using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Kullanıcı okuma ilerleme kaydı
/// </summary>
public class ReaderProgress : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    // Current Position
    public Guid? CurrentChapterId { get; set; }
    public int CurrentPage { get; set; } = 1;
    public string? CurrentPosition { get; set; } // CSS selector or character offset
    
    // Progress Statistics
    public decimal CompletionPercentage { get; set; } = 0;
    public int ChaptersRead { get; set; } = 0;
    public int PagesRead { get; set; } = 0;
    public int TotalReadingTimeMinutes { get; set; } = 0;
    
    // Session Tracking
    public DateTime? LastReadAt { get; set; }
    public DateTime? StartedReadingAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    
    // Reading Settings (user preferences for this book)
    public string? ReadingSettings { get; set; }
    // {
    //   "fontSize": 16,
    //   "fontFamily": "Georgia",
    //   "theme": "light",
    //   "lineHeight": 1.6
    // }
    
    // Statistics per session
    public int SessionCount { get; set; } = 0;
    public int AverageSessionMinutes { get; set; } = 0;
}

