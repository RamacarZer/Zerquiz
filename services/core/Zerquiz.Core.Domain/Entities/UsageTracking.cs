using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Kullanım takibi - Günlük veya saatlik
/// </summary>
public class UsageTracking
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }
    
    // Tracking Time
    public DateTime TrackingDate { get; set; }
    public int? TrackingHour { get; set; } // 0-23 (null = günlük toplam)
    
    // Metrics (JSONB)
    public string MetricsJson { get; set; } = "{}";
    // {
    //   "active_users": 45,
    //   "total_users": 67,
    //   "total_students": 567,
    //   "total_questions": 2341,
    //   "total_exams": 87,
    //   "storage_gb": 23.4,
    //   "api_calls": 1234,
    //   "active_sessions": 12
    // }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

