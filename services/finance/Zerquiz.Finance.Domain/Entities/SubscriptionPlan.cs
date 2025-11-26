using System.Text.Json;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Abonelik planları (Starter, Professional, Enterprise)
/// </summary>
public class SubscriptionPlan : BaseEntity
{
    public string Code { get; set; } = string.Empty; // starter, professional, enterprise
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public int MaxUsers { get; set; }
    public int MaxQuestions { get; set; }
    public int MaxExams { get; set; }
    public long MaxStorageMB { get; set; } = 1000; // 1GB default
    public JsonDocument? Features { get; set; } // JSONB - Özellik listesi
    public bool IsPublic { get; set; } = true;
    public int DisplayOrder { get; set; }
    
    // Navigation
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}

