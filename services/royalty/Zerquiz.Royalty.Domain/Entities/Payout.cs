using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Royalty.Domain.Entities;

/// <summary>
/// Telif ödemeleri
/// </summary>
public class Payout : BaseEntity
{
    public Guid AuthorId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public string Period { get; set; } = string.Empty; // 2024-Q1
    public new string Status { get; set; } = "pending"; // pending, processed, paid
    public DateTime? PaidAt { get; set; }
    public string? PaymentReference { get; set; }
}

