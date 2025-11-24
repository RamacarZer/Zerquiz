using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Tenant'a atanmış lisans
/// </summary>
public class TenantLicense : BaseEntity
{
    // Relations (TenantId already in BaseEntity)
    public Tenant? Tenant { get; set; }
    
    public Guid LicensePackageId { get; set; }
    public LicensePackage? LicensePackage { get; set; }
    
    // License Period
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? TrialEndDate { get; set; }
    
    // License Status (different from BaseEntity.Status)
    public new string Status { get; set; } = "active"; // trial, active, suspended, expired, cancelled, grace_period
    public bool AutoRenew { get; set; } = true;
    
    // Pricing (snapshot at assignment time)
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public string BillingPeriod { get; set; } = "monthly"; // monthly, quarterly, yearly
    
    // Custom Limits Override (JSONB - nullable, overrides package limits)
    public string? CustomLimitsJson { get; set; }
    // {
    //   "max_users": 150,  // override package limit
    //   "max_questions": 10000
    // }
    
    // Custom Features Override (JSONB - nullable, additional features)
    public string? CustomFeaturesJson { get; set; }
    // ["custom_feature_1", "custom_feature_2"]
    
    // Current Usage Cache (JSONB - updated periodically)
    public string? CurrentUsageJson { get; set; }
    // {
    //   "users": 45,
    //   "questions": 2341,
    //   "storage_gb": 23.4,
    //   "last_updated": "2025-11-24T10:30:00Z"
    // }
    
    // Billing
    public DateTime? NextBillingDate { get; set; }
    public DateTime? SuspendedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    
    // Notes
    public string? Notes { get; set; }
}

