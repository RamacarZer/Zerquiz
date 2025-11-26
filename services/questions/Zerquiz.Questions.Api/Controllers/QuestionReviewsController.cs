using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionReviewsController : ControllerBase
{
    private readonly QuestionsDbContext _context;
    private readonly ILogger<QuestionReviewsController> _logger;

    public QuestionReviewsController(QuestionsDbContext context, ILogger<QuestionReviewsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all reviews (with filters)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] string? reviewStatus = null,
        [FromQuery] string? stage = null,
        [FromQuery] Guid? reviewerId = null)
    {
        var query = _context.QuestionReviews
            .Include(r => r.Question)
            .AsQueryable();

        if (!string.IsNullOrEmpty(reviewStatus))
            query = query.Where(r => r.ReviewStatus == reviewStatus);

        if (!string.IsNullOrEmpty(stage))
            query = query.Where(r => r.Stage == stage);

        if (reviewerId.HasValue)
            query = query.Where(r => r.ReviewerId == reviewerId.Value);

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.QuestionId,
                QuestionCode = r.Question.Code,
                r.ReviewerId,
                r.ReviewStatus,
                r.Stage,
                r.ReviewRound,
                r.Comments,
                r.ReviewedAt,
                r.ReviewFee,
                r.IsFeePaid,
                r.QualityScore,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>
    /// Get review by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var review = await _context.QuestionReviews
            .Include(r => r.Question)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound();

        return Ok(review);
    }

    /// <summary>
    /// Get pending reviews for reviewer
    /// </summary>
    [HttpGet("reviewer/{reviewerId}/pending")]
    public async Task<ActionResult> GetPendingForReviewer(Guid reviewerId)
    {
        var reviews = await _context.QuestionReviews
            .Include(r => r.Question)
            .Where(r => r.ReviewerId == reviewerId && r.ReviewStatus == "pending")
            .OrderBy(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.QuestionId,
                QuestionCode = r.Question.Code,
                r.Stage,
                r.ReviewRound,
                r.CreatedAt,
                WaitingDays = (int)(DateTime.UtcNow - r.CreatedAt).TotalDays
            })
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>
    /// Create new review
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateReviewRequest request)
    {
        // Check if question already has pending review
        var existing = await _context.QuestionReviews
            .FirstOrDefaultAsync(r => r.QuestionId == request.QuestionId && r.ReviewStatus == "pending");

        if (existing != null)
            return BadRequest("Question already has a pending review");

        var review = new QuestionReview
        {
            QuestionId = request.QuestionId,
            ReviewerId = request.ReviewerId,
            Stage = request.Stage ?? "internal",
            ReviewFee = request.ReviewFee
        };

        _context.QuestionReviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
    }

    /// <summary>
    /// Submit review (approve/reject/request revision)
    /// </summary>
    [HttpPost("{id}/submit")]
    public async Task<ActionResult> Submit(Guid id, [FromBody] SubmitReviewRequest request)
    {
        var review = await _context.QuestionReviews
            .Include(r => r.Question)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound();

        if (review.ReviewStatus != "pending")
            return BadRequest($"Review is already {review.ReviewStatus}");

        review.ReviewStatus = request.ReviewStatus;
        review.Comments = request.Comments;
        review.ReviewedAt = DateTime.UtcNow;
        review.QualityScore = request.QualityScore;
        review.QualityNotes = request.QualityNotes;

        // Update question status based on review
        if (request.ReviewStatus == "approved")
        {
            // If final approval stage, mark question as published
            if (review.Stage == "final_approval")
            {
                review.Question.Status = "published";
            }
        }
        else if (request.ReviewStatus == "revision_requested")
        {
            review.Question.Status = "needs_revision";
        }
        else if (request.ReviewStatus == "rejected")
        {
            review.Question.Status = "rejected";
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review submitted successfully",
            reviewId = id,
            reviewStatus = review.ReviewStatus,
            questionStatus = review.Question.Status
        });
    }

    /// <summary>
    /// Approve review fee
    /// </summary>
    [HttpPost("{id}/approve-fee")]
    public async Task<ActionResult> ApproveFee(Guid id)
    {
        var review = await _context.QuestionReviews.FindAsync(id);
        if (review == null)
            return NotFound();

        if (review.ReviewStatus != "approved")
            return BadRequest("Can only approve fee for approved reviews");

        if (!review.ReviewFee.HasValue || review.ReviewFee.Value == 0)
            return BadRequest("No review fee set");

        review.FeeApprovedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // TODO: Create ReviewFee in Royalty Service via HTTP call or message queue

        return Ok(new
        {
            message = "Review fee approved",
            amount = review.ReviewFee,
            approvedAt = review.FeeApprovedAt
        });
    }

    /// <summary>
    /// Mark fee as paid (called by Royalty Service or manually)
    /// </summary>
    [HttpPost("{id}/mark-fee-paid")]
    public async Task<ActionResult> MarkFeePaid(Guid id, [FromBody] MarkFeePaidRequest request)
    {
        var review = await _context.QuestionReviews.FindAsync(id);
        if (review == null)
            return NotFound();

        review.IsFeePaid = true;
        review.FeePaidAt = DateTime.UtcNow;
        review.RoyaltyReviewFeeId = request.RoyaltyReviewFeeId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review fee marked as paid",
            paidAt = review.FeePaidAt
        });
    }

    /// <summary>
    /// Move review to next stage
    /// </summary>
    [HttpPost("{id}/advance-stage")]
    public async Task<ActionResult> AdvanceStage(Guid id)
    {
        var review = await _context.QuestionReviews.FindAsync(id);
        if (review == null)
            return NotFound();

        if (review.ReviewStatus != "approved")
            return BadRequest("Only approved reviews can be advanced");

        var nextStage = review.Stage switch
        {
            "internal" => "committee_lead",
            "committee_lead" => "final_approval",
            "final_approval" => null,
            _ => null
        };

        if (nextStage == null)
            return BadRequest("Review is already at final stage");

        review.Stage = nextStage;
        review.ReviewStatus = "pending";
        review.ReviewedAt = null;
        review.Comments = null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review advanced to next stage",
            newStage = nextStage
        });
    }

    /// <summary>
    /// Get review statistics
    /// </summary>
    [HttpGet("statistics")]
    public async Task<ActionResult> GetStatistics([FromQuery] Guid? reviewerId = null)
    {
        var query = _context.QuestionReviews.AsQueryable();

        if (reviewerId.HasValue)
            query = query.Where(r => r.ReviewerId == reviewerId.Value);

        var stats = new
        {
            total = await query.CountAsync(),
            byStatus = await query.GroupBy(r => r.ReviewStatus)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync(),
            byStage = await query.GroupBy(r => r.Stage)
                .Select(g => new { stage = g.Key, count = g.Count() })
                .ToListAsync(),
            averageQualityScore = await query
                .Where(r => r.QualityScore.HasValue)
                .AverageAsync(r => (double?)r.QualityScore) ?? 0,
            totalFeesEarned = await query
                .Where(r => r.IsFeePaid)
                .SumAsync(r => r.ReviewFee ?? 0),
            pendingFees = await query
                .Where(r => r.FeeApprovedAt.HasValue && !r.IsFeePaid)
                .SumAsync(r => r.ReviewFee ?? 0),
            averageReviewTime = await query
                .Where(r => r.ReviewedAt.HasValue)
                .Select(r => (r.ReviewedAt!.Value - r.CreatedAt).TotalHours)
                .AverageAsync()
        };

        return Ok(stats);
    }
}

public record CreateReviewRequest(Guid QuestionId, Guid ReviewerId, string? Stage, decimal? ReviewFee);
public record SubmitReviewRequest(string ReviewStatus, string? Comments, int? QualityScore, string? QualityNotes);
public record MarkFeePaidRequest(Guid RoyaltyReviewFeeId);

