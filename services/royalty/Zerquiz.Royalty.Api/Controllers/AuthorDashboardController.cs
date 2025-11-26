using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Infrastructure.Persistence;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorDashboardController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public AuthorDashboardController(RoyaltyDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Author dashboard overview
    /// </summary>
    [HttpGet("{authorId}/overview")]
    public async Task<ActionResult> GetOverview(Guid authorId)
    {
        // Total earnings
        var totalEarnings = await _context.RoyaltyTransactions
            .Where(t => t.AuthorId == authorId)
            .GroupBy(t => t.Currency)
            .Select(g => new { Currency = g.Key, Total = g.Sum(t => t.Amount) })
            .ToListAsync();

        // Pending payouts
        var pendingPayouts = await _context.Payouts
            .Where(p => p.AuthorId == authorId && p.Status == "pending")
            .SumAsync(p => p.Amount);

        // Total works
        var totalWorks = await _context.Works
            .Where(w => w.PrimaryAuthorId == authorId || w.Authors.Any(a => a.AuthorId == authorId))
            .CountAsync();

        // Recent transactions
        var recentTransactions = await _context.RoyaltyTransactions
            .Where(t => t.AuthorId == authorId)
            .OrderByDescending(t => t.AccruedAt)
            .Take(10)
            .Select(t => new
            {
                t.Id,
                t.Amount,
                t.Currency,
                t.TransactionType,
                t.AccruedAt,
                WorkId = t.WorkId
            })
            .ToListAsync();

        return Ok(new
        {
            totalEarnings,
            pendingPayouts,
            totalWorks,
            recentTransactions,
            lastUpdated = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Author's works with earnings
    /// </summary>
    [HttpGet("{authorId}/works")]
    public async Task<ActionResult> GetWorks(Guid authorId)
    {
        var works = await _context.Works
            .Where(w => w.PrimaryAuthorId == authorId || w.Authors.Any(a => a.AuthorId == authorId))
            .Select(w => new
            {
                w.Id,
                w.Title,
                w.Type,
                w.CreatedDate,
                TotalEarnings = w.Transactions.Where(t => t.AuthorId == authorId).Sum(t => t.Amount),
                UsageCount = w.Transactions.Count,
                LastUsed = w.Transactions.OrderByDescending(t => t.AccruedAt).FirstOrDefault()!.AccruedAt
            })
            .ToListAsync();

        return Ok(works);
    }

    /// <summary>
    /// Author's transaction history
    /// </summary>
    [HttpGet("{authorId}/transactions")]
    public async Task<ActionResult> GetTransactions(
        Guid authorId,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.RoyaltyTransactions
            .Where(t => t.AuthorId == authorId);

        if (from.HasValue)
            query = query.Where(t => t.AccruedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(t => t.AccruedAt <= to.Value);

        var total = await query.CountAsync();

        var transactions = await query
            .OrderByDescending(t => t.AccruedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(t => t.Work)
            .Select(t => new
            {
                t.Id,
                t.Amount,
                t.Currency,
                t.TransactionType,
                t.AccruedAt,
                WorkTitle = t.Work.Title,
                WorkType = t.Work.Type
            })
            .ToListAsync();

        return Ok(new
        {
            transactions,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    /// <summary>
    /// Author's payout history
    /// </summary>
    [HttpGet("{authorId}/payouts")]
    public async Task<ActionResult> GetPayouts(Guid authorId)
    {
        var payouts = await _context.Payouts
            .Where(p => p.AuthorId == authorId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
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
    /// Request payout
    /// </summary>
    [HttpPost("{authorId}/request-payout")]
    public async Task<ActionResult> RequestPayout(Guid authorId, [FromBody] PayoutRequest request)
    {
        // Check pending balance
        var pendingBalance = await _context.RoyaltyTransactions
            .Where(t => t.AuthorId == authorId && t.Currency == request.Currency)
            .SumAsync(t => t.Amount);

        var alreadyPaid = await _context.Payouts
            .Where(p => p.AuthorId == authorId && p.Currency == request.Currency && p.Status == "paid")
            .SumAsync(p => p.Amount);

        var availableBalance = pendingBalance - alreadyPaid;

        if (availableBalance < request.Amount)
            return BadRequest($"Insufficient balance. Available: {availableBalance} {request.Currency}");

        var payout = new Zerquiz.Royalty.Domain.Entities.Payout
        {
            AuthorId = authorId,
            Amount = request.Amount,
            Currency = request.Currency,
            Period = $"{DateTime.UtcNow:yyyy-MM}",
            Status = "pending"
        };

        _context.Payouts.Add(payout);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Payout request created", payoutId = payout.Id, amount = request.Amount });
    }
}

public record PayoutRequest(decimal Amount, string Currency);

