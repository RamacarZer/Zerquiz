using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Royalty.Domain.Entities;

/// <summary>
/// Zümre başkanı onay ücreti
/// </summary>
public class ReviewFee : BaseEntity
{
    public Guid QuestionReviewId { get; set; } // Questions service'den
    public Guid ReviewerId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "pending"; // pending, approved, paid
    public DateTime? PaidAt { get; set; }
}

