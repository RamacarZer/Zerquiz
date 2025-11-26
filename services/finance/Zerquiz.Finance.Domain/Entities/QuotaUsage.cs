using System.Text.Json;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Kota kullanım kayıtları
/// </summary>
public class QuotaUsage : BaseEntity
{
    public Guid QuotaId { get; set; }
    public int Used { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public string? Action { get; set; } // user_created, question_created, exam_created
    public Guid? RelatedEntityId { get; set; } // Oluşturulan entity ID
    public JsonDocument? UsageDetails { get; set; } // JSONB - Ek bilgiler
    
    // Navigation
    public UsageQuota Quota { get; set; } = null!;
}

