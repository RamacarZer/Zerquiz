using System;
using System.Collections.Generic;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Kitap bölümü/chapter
/// </summary>
public class BookChapter : BaseEntity
{
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    // Chapter Information
    public int ChapterNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    
    // Content (HTML format)
    public string Content { get; set; } = string.Empty;
    public string? Summary { get; set; }
    
    // Hierarchy (for sub-chapters)
    public Guid? ParentChapterId { get; set; }
    public BookChapter? ParentChapter { get; set; }
    public int Level { get; set; } = 1; // 1=chapter, 2=section, 3=subsection
    
    // Ordering & Display
    public int DisplayOrder { get; set; }
    
    // Statistics
    public int WordCount { get; set; } = 0;
    public int EstimatedReadingMinutes { get; set; } = 0;
    public int PageCount { get; set; } = 0;
    
    // Curriculum Mapping (optional, for textbook chapters)
    public Guid? TopicId { get; set; } // Link to curriculum topic
    public string[]? LearningOutcomeIds { get; set; } // Array of learning outcome IDs
    
    // Audio (for TTS or pre-recorded)
    public string? AudioUrl { get; set; }
    public int? AudioDurationSeconds { get; set; }
    
    // Metadata
    public new string? Metadata { get; set; }
    // {
    //   "objectives": ["Understand X", "Apply Y"],
    //   "difficulty": "medium",
    //   "hasExercises": true
    // }
    
    // Navigation
    public ICollection<BookChapter> SubChapters { get; set; } = new List<BookChapter>();
    public ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
    public ICollection<Highlight> Highlights { get; set; } = new List<Highlight>();
}

