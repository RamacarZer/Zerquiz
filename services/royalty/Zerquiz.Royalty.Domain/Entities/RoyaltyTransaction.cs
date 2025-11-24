using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Royalty.Domain.Entities;

/// <summary>
/// Telif işlemi (kullanım başına)
/// </summary>
public class RoyaltyTransaction : BaseEntity
{
    public Guid WorkId { get; set; }
    public Work Work { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public string TransactionType { get; set; } = string.Empty; // exam_usage, view, print
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public Guid? ReferenceId { get; set; } // Exam, Session, etc.
    public DateTime AccruedAt { get; set; } = DateTime.UtcNow;
}

