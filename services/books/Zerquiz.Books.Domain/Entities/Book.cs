using System;
using System.Collections.Generic;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Kitap - Ders kitabı veya kültürel kitap (roman/hikaye)
/// </summary>
public class Book : BaseEntity
{
    // Basic Information
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    
    // Type & Classification
    public string BookType { get; set; } = "textbook"; // textbook, novel, story, reference, workbook
    public string? Category { get; set; } // Kategori (Matematik, Edebiyat, vs.)
    public string? Grade { get; set; } // Sınıf seviyesi
    public string? Language { get; set; } = "tr"; // Dil kodu
    
    // Publishing Information
    public string? ISBN { get; set; }
    public string? Publisher { get; set; }
    public string? Author { get; set; }
    public string[]? Authors { get; set; } // Çoklu yazar desteği
    public DateTime? PublishedDate { get; set; }
    public string? Edition { get; set; }
    
    // Visual & Media
    public string? CoverImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    // Content Statistics
    public int ChapterCount { get; set; } = 0;
    public int PageCount { get; set; } = 0;
    public int WordCount { get; set; } = 0;
    public int EstimatedReadingMinutes { get; set; } = 0;
    
    // Curriculum Mapping (for textbooks)
    public Guid? CurriculumId { get; set; }
    public Guid? SubjectId { get; set; }
    
    // Settings (JSONB)
    public new string? Metadata { get; set; } // Override BaseEntity.Metadata (JsonDocument -> string)
    // {
    //   "ageRange": "14-16",
    //   "keywords": ["matematik", "geometri"],
    //   "difficulty": "intermediate"
    // }
    
    // Workflow
    public string WorkflowStatus { get; set; } = "draft"; // draft, review, approved, published, archived
    public DateTime? PublishedAt { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    
    // Navigation Properties
    public ICollection<BookChapter> Chapters { get; set; } = new List<BookChapter>();
    public ICollection<BookAsset> Assets { get; set; } = new List<BookAsset>();
    public ICollection<BookExport> Exports { get; set; } = new List<BookExport>();
    public ICollection<ReaderProgress> ReaderProgress { get; set; } = new List<ReaderProgress>();
}

