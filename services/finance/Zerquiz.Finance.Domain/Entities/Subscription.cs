using System.Text.Json;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Abonelik kaydı
/// </summary>
public class Subscription : BaseEntity
{
    public Guid PlanId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string SubscriptionStatus { get; set; } = "trial"; // trial, active, suspended, expired, cancelled
    public string BillingCycle { get; set; } = "monthly"; // monthly, yearly, lifetime
    public decimal MonthlyFee { get; set; }
    public string Currency { get; set; } = "TRY";
    public bool AutoRenew { get; set; } = true;
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public JsonDocument? BillingInfo { get; set; } // JSONB - İletişim, fatura adresi
    
    // Navigation
    public SubscriptionPlan Plan { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

