using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Domain.Entities;
using Zerquiz.Royalty.Infrastructure.Persistence;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PayoutsController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public PayoutsController(RoyaltyDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all payouts (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string? status = null)
    {
        var query = _context.Payouts.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        var payouts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.AuthorId,
                p.Amount,
                p.Currency,
                p.Period,
                p.Status,
                p.PaidAt,
                p.PaymentReference,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(payouts);
    }

    /// <summary>
    /// Get payout by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var payout = await _context.Payouts.FindAsync(id);
        if (payout == null)
            return NotFound();

        return Ok(payout);
    }

    /// <summary>
    /// Approve payout (admin)
    /// </summary>
    [HttpPost("{id}/approve")]
    public async Task<ActionResult> Approve(Guid id)
    {
        var payout = await _context.Payouts.FindAsync(id);
        if (payout == null)
            return NotFound();

        if (payout.Status != "pending")
            return BadRequest($"Payout is already {payout.Status}");

        payout.Status = "approved";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Payout approved", payoutId = id });
    }

    /// <summary>
    /// Mark payout as paid (admin)
    /// </summary>
    [HttpPost("{id}/mark-paid")]
    public async Task<ActionResult> MarkPaid(Guid id, [FromBody] MarkPaidRequest request)
    {
        var payout = await _context.Payouts.FindAsync(id);
        if (payout == null)
            return NotFound();

        if (payout.Status == "paid")
            return BadRequest("Payout is already marked as paid");

        payout.Status = "paid";
        payout.PaidAt = DateTime.UtcNow;
        payout.PaymentReference = request.PaymentReference;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Payout marked as paid", payoutId = id, paidAt = payout.PaidAt });
    }

    /// <summary>
    /// Reject payout (admin)
    /// </summary>
    [HttpPost("{id}/reject")]
    public async Task<ActionResult> Reject(Guid id, [FromBody] RejectRequest request)
    {
        var payout = await _context.Payouts.FindAsync(id);
        if (payout == null)
            return NotFound();

        if (payout.Status == "paid")
            return BadRequest("Cannot reject a paid payout");

        payout.Status = "rejected";
        // In real implementation, store rejection reason

        await _context.SaveChangesAsync();

        return Ok(new { message = "Payout rejected", payoutId = id, reason = request.Reason });
    }

    /// <summary>
    /// Bulk process payouts
    /// </summary>
    [HttpPost("bulk-process")]
    public async Task<ActionResult> BulkProcess([FromBody] BulkProcessRequest request)
    {
        var payouts = await _context.Payouts
            .Where(p => request.PayoutIds.Contains(p.Id) && p.Status == "approved")
            .ToListAsync();

        if (!payouts.Any())
            return BadRequest("No approved payouts found with provided IDs");

        foreach (var payout in payouts)
        {
            payout.Status = "processed";
            payout.PaidAt = DateTime.UtcNow;
            payout.PaymentReference = $"BULK-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8]}";
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payouts processed",
            processedCount = payouts.Count,
            totalAmount = payouts.Sum(p => p.Amount)
        });
    }

    /// <summary>
    /// Calculate pending payouts for period
    /// </summary>
    [HttpPost("calculate")]
    public async Task<ActionResult> CalculatePendingPayouts([FromBody] CalculateRequest request)
    {
        // Group transactions by author for the period
        var authorEarnings = await _context.RoyaltyTransactions
            .Where(t => t.AccruedAt >= request.FromDate && t.AccruedAt <= request.ToDate)
            .GroupBy(t => new { t.AuthorId, t.Currency })
            .Select(g => new
            {
                g.Key.AuthorId,
                g.Key.Currency,
                Total = g.Sum(t => t.Amount),
                TransactionCount = g.Count()
            })
            .ToListAsync();

        // Check existing payouts to avoid duplicates
        var existingPayouts = await _context.Payouts
            .Where(p => p.Period == request.Period)
            .Select(p => new { p.AuthorId, p.Currency })
            .ToListAsync();

        var result = new List<object>();
        int created = 0;

        foreach (var earning in authorEarnings)
        {
            // Skip if already has payout for this period
            if (existingPayouts.Any(p => p.AuthorId == earning.AuthorId && p.Currency == earning.Currency))
                continue;

            // Only create payout if meets minimum threshold
            if (earning.Total >= request.MinimumAmount)
            {
                var payout = new Payout
                {
                    AuthorId = earning.AuthorId,
                    Amount = earning.Total,
                    Currency = earning.Currency,
                    Period = request.Period,
                    Status = "pending"
                };

                _context.Payouts.Add(payout);
                created++;

                result.Add(new
                {
                    authorId = earning.AuthorId,
                    amount = earning.Total,
                    currency = earning.Currency,
                    transactionCount = earning.TransactionCount
                });
            }
        }

        if (created > 0)
            await _context.SaveChangesAsync();

        return Ok(new
        {
            period = request.Period,
            created,
            totalAuthors = authorEarnings.Count,
            payouts = result
        });
    }
}

public record MarkPaidRequest(string PaymentReference);
public record RejectRequest(string Reason);
public record BulkProcessRequest(List<Guid> PayoutIds);
public record CalculateRequest(DateTime FromDate, DateTime ToDate, string Period, decimal MinimumAmount);

