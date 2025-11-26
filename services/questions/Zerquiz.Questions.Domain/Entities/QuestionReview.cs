using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru incelemesi (zümre başkanı onayı)
/// </summary>
public class QuestionReview : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    
    public Guid ReviewerId { get; set; } // Zümre başkanı/Reviewer
    public string ReviewStatus { get; set; } = "pending"; // pending, approved, rejected, revision_requested (renamed to avoid conflict with BaseEntity.Status)
    public string? Comments { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    // Review workflow stages
    public string Stage { get; set; } = "internal"; // internal, committee_lead, final_approval
    public int ReviewRound { get; set; } = 1; // For tracking revision rounds
    
    // Review fee tracking için
    public decimal? ReviewFee { get; set; }
    public bool IsFeePaid { get; set; } = false;
    public Guid? RoyaltyReviewFeeId { get; set; } // FK to Royalty.ReviewFee
    public DateTime? FeeApprovedAt { get; set; }
    public DateTime? FeePaidAt { get; set; }
    
    // Quality metrics
    public int? QualityScore { get; set; } // 1-10
    public string? QualityNotes { get; set; }
}

