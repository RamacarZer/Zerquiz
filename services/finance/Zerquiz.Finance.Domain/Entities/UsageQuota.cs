using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Kullanım kotaları (organizasyon/abonelik bazında)
/// </summary>
public class UsageQuota : BaseEntity
{
    public Guid? SubscriptionId { get; set; }
    public string ResourceType { get; set; } = string.Empty; // users, questions, exams, storage_mb, api_calls
    public int Limit { get; set; }
    public string Period { get; set; } = "monthly"; // monthly, yearly, lifetime
    public DateTime? ResetAt { get; set; }
    public bool IsHardLimit { get; set; } = true; // Aşılırsa engelle mi?
    
    // Navigation
    public Subscription? Subscription { get; set; }
    public ICollection<QuotaUsage> Usages { get; set; } = new List<QuotaUsage>();
}

