using System.Text.Json;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Fiyatlandırma kalemleri (abonelik ücreti, sınav ücreti, soru oluşturma ücreti)
/// </summary>
public class PriceItem : BaseEntity
{
    public string Code { get; set; } = string.Empty; // membership_fee, exam_fee, question_creation_fee
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "recurring"; // recurring, one_time, usage_based
    public decimal BasePrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public string? BillingUnit { get; set; } // per_user, per_question, per_exam, per_month
    public JsonDocument? PricingTiers { get; set; } // JSONB - Hacim bazlı fiyatlandırma
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
}

