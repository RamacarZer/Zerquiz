using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Başarı sertifikası
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
}

