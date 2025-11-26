using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Gelir paylaşım kuralları (Platform, Tenant, Author, Reviewer)
/// </summary>
public class RevenueSplitRule : BaseEntity
{
    public string TransactionType { get; set; } = string.Empty; // exam_fee, question_usage, subscription_fee
    public decimal PlatformPercent { get; set; } = 30.0m;
    public decimal TenantPercent { get; set; } = 40.0m;
    public decimal AuthorPercent { get; set; } = 20.0m;
    public decimal ReviewerPercent { get; set; } = 10.0m;
    public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;
    public DateTime? EffectiveTo { get; set; }
    public string? RuleDescription { get; set; }
}

