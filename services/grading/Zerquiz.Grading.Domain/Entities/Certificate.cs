using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Başarı sertifikası - QR code ve public verification destekli
/// </summary>
public class Certificate : BaseEntity
{
    public Guid ExamResultId { get; set; }
    public ExamResult ExamResult { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string VerifyToken { get; set; } = string.Empty; // QR kod için
    public string TemplateId { get; set; } = "default";
    public string? PdfUrl { get; set; }
    
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    
    // QR Code & Verification Enhancement
    public string QrCodeData { get; set; } = string.Empty; // QR code içeriği
    public string VerifyUrl { get; set; } = string.Empty; // Tam doğrulama URL'i
    
    // PDF & Storage
    public string? PdfStorageKey { get; set; } // S3/Blob storage key
    public DateTime? GeneratedAt { get; set; } // PDF oluşturulma zamanı
    public DateTime? DownloadedAt { get; set; } // İlk indirme
    public int DownloadCount { get; set; } = 0;
    
    // Verification Tracking
    public DateTime? LastVerifiedAt { get; set; }
    public int VerificationCount { get; set; } = 0;
    public bool IsRevoked { get; set; } = false;
    public DateTime? RevokedAt { get; set; }
    public string? RevocationReason { get; set; }
    
    // Grade Info
    public string? Grade { get; set; } // A+, A, B+
    public decimal? Score { get; set; }
    public string? Remarks { get; set; }
}

