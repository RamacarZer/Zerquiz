using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Books.Domain.Entities;

/// <summary>
/// Kitap export kayıtları (ePub, PDF, HTML)
/// </summary>
public class BookExport : BaseEntity
{
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    // Export Format
    public string Format { get; set; } = string.Empty; // epub, pdf, html, mobi
    public string FormatVersion { get; set; } = "1.0"; // ePub 3.0, PDF 1.7, etc.
    
    // Export Status
    public string ExportStatus { get; set; } = "pending"; // pending, processing, completed, failed
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? ErrorMessage { get; set; }
    
    // File Information
    public string? FileKey { get; set; } // Storage key
    public string? DownloadUrl { get; set; }
    public long? FileSize { get; set; }
    public string? Checksum { get; set; } // MD5 or SHA256
    
    // Export Settings (JSONB)
    public string? ExportSettings { get; set; }
    // {
    //   "pageSize": "A4",
    //   "fontSize": 12,
    //   "includeImages": true,
    //   "includeTOC": true,
    //   "compression": "standard"
    // }
    
    // Validation (for ePub)
    public bool? IsValid { get; set; }
    public string[]? ValidationErrors { get; set; }
    
    // Usage Tracking
    public int DownloadCount { get; set; } = 0;
    public DateTime? LastDownloadedAt { get; set; }
    
    // Expiration (optional)
    public DateTime? ExpiresAt { get; set; }
}

