using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Infrastructure.Persistence;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewFeesController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public ReviewFeesController(RoyaltyDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all review fees
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string? status = null, [FromQuery] Guid? reviewerId = null)
    {
        var query = _context.ReviewFees.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status == status);

        if (reviewerId.HasValue)
            query = query.Where(f => f.ReviewerId == reviewerId.Value);

        var fees = await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                f.Id,
                f.QuestionReviewId,
                f.ReviewerId,
                f.Amount,
                f.Status,
                f.PaidAt,
                f.CreatedAt
            })
            .ToListAsync();

        return Ok(fees);
    }

    /// <summary>
    /// Get review fee by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var fee = await _context.ReviewFees.FindAsync(id);
        if (fee == null)
            return NotFound();

        return Ok(fee);
    }

    /// <summary>
    /// Approve review fee (admin)
    /// </summary>
    [HttpPost("{id}/approve")]
    public async Task<ActionResult> Approve(Guid id)
    {
        var fee = await _context.ReviewFees.FindAsync(id);
        if (fee == null)
            return NotFound();

        if (fee.Status != "pending")
            return BadRequest($"Review fee is already {fee.Status}");

        fee.Status = "approved";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review fee approved", feeId = id });
    }

    /// <summary>
    /// Mark review fee as paid (admin)
    /// </summary>
    [HttpPost("{id}/mark-paid")]
    public async Task<ActionResult> MarkPaid(Guid id)
    {
        var fee = await _context.ReviewFees.FindAsync(id);
        if (fee == null)
            return NotFound();

        if (fee.Status == "paid")
            return BadRequest("Review fee is already marked as paid");

        fee.Status = "paid";
        fee.PaidAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Review fee marked as paid", feeId = id, paidAt = fee.PaidAt });
    }

    /// <summary>
    /// Get reviewer's fee summary
    /// </summary>
    [HttpGet("reviewer/{reviewerId}/summary")]
    public async Task<ActionResult> GetReviewerSummary(Guid reviewerId)
    {
        var fees = await _context.ReviewFees
            .Where(f => f.ReviewerId == reviewerId)
            .ToListAsync();

        var summary = new
        {
            reviewerId,
            totalFees = fees.Sum(f => f.Amount),
            pendingFees = fees.Where(f => f.Status == "pending").Sum(f => f.Amount),
            approvedFees = fees.Where(f => f.Status == "approved").Sum(f => f.Amount),
            paidFees = fees.Where(f => f.Status == "paid").Sum(f => f.Amount),
            totalReviews = fees.Count,
            lastReviewDate = fees.OrderByDescending(f => f.CreatedAt).FirstOrDefault()?.CreatedAt
        };

        return Ok(summary);
    }

    /// <summary>
    /// Bulk approve review fees
    /// </summary>
    [HttpPost("bulk-approve")]
    public async Task<ActionResult> BulkApprove([FromBody] BulkApproveRequest request)
    {
        var fees = await _context.ReviewFees
            .Where(f => request.FeeIds.Contains(f.Id) && f.Status == "pending")
            .ToListAsync();

        if (!fees.Any())
            return BadRequest("No pending review fees found with provided IDs");

        foreach (var fee in fees)
        {
            fee.Status = "approved";
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review fees approved",
            approvedCount = fees.Count,
            totalAmount = fees.Sum(f => f.Amount)
        });
    }

    /// <summary>
    /// Bulk pay review fees
    /// </summary>
    [HttpPost("bulk-pay")]
    public async Task<ActionResult> BulkPay([FromBody] BulkPayRequest request)
    {
        var fees = await _context.ReviewFees
            .Where(f => request.FeeIds.Contains(f.Id) && f.Status == "approved")
            .ToListAsync();

        if (!fees.Any())
            return BadRequest("No approved review fees found with provided IDs");

        foreach (var fee in fees)
        {
            fee.Status = "paid";
            fee.PaidAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review fees paid",
            paidCount = fees.Count,
            totalAmount = fees.Sum(f => f.Amount),
            paidAt = DateTime.UtcNow
        });
    }
}

public record BulkApproveRequest(List<Guid> FeeIds);
public record BulkPayRequest(List<Guid> FeeIds);

