using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Domain.Entities;
using Zerquiz.Royalty.Infrastructure.Persistence;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorksController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public WorksController(RoyaltyDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all works
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string? type = null)
    {
        var query = _context.Works.AsQueryable();

        if (!string.IsNullOrEmpty(type))
            query = query.Where(w => w.Type == type);

        var works = await query
            .Include(w => w.Authors)
            .OrderByDescending(w => w.CreatedDate)
            .Select(w => new
            {
                w.Id,
                w.Title,
                w.Type,
                w.PrimaryAuthorId,
                w.CreatedDate,
                AuthorCount = w.Authors.Count,
                TransactionCount = w.Transactions.Count,
                TotalEarnings = w.Transactions.Sum(t => t.Amount)
            })
            .ToListAsync();

        return Ok(works);
    }

    /// <summary>
    /// Get work by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var work = await _context.Works
            .Include(w => w.Authors)
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (work == null)
            return NotFound();

        return Ok(work);
    }

    /// <summary>
    /// Create new work
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateWorkRequest request)
    {
        var work = new Work
        {
            Title = request.Title,
            Type = request.Type,
            PrimaryAuthorId = request.PrimaryAuthorId,
            CreatedDate = DateTime.UtcNow
        };

        _context.Works.Add(work);

        // Add co-authors
        if (request.CoAuthors != null && request.CoAuthors.Any())
        {
            foreach (var coAuthor in request.CoAuthors)
            {
                _context.WorkAuthors.Add(new WorkAuthor
                {
                    WorkId = work.Id,
                    AuthorId = coAuthor.AuthorId,
                    SharePercentage = coAuthor.SharePercentage,
                    Role = "co-author"
                });
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = work.Id }, work);
    }

    /// <summary>
    /// Update work
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateWorkRequest request)
    {
        var work = await _context.Works.FindAsync(id);
        if (work == null)
            return NotFound();

        work.Title = request.Title;
        work.Type = request.Type;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Delete work
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var work = await _context.Works.FindAsync(id);
        if (work == null)
            return NotFound();

        _context.Works.Remove(work);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Get work statistics
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<ActionResult> GetStatistics(Guid id)
    {
        var work = await _context.Works
            .Include(w => w.Transactions)
            .Include(w => w.Authors)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (work == null)
            return NotFound();

        var stats = new
        {
            totalTransactions = work.Transactions.Count,
            totalEarnings = work.Transactions.Sum(t => t.Amount),
            earningsByType = work.Transactions
                .GroupBy(t => t.TransactionType)
                .Select(g => new { Type = g.Key, Total = g.Sum(t => t.Amount) })
                .ToList(),
            authorShares = work.Authors
                .Select(a => new { a.AuthorId, a.SharePercentage, a.Role })
                .ToList(),
            lastUsed = work.Transactions.OrderByDescending(t => t.AccruedAt).FirstOrDefault()?.AccruedAt,
            monthlyEarnings = work.Transactions
                .GroupBy(t => new { t.AccruedAt.Year, t.AccruedAt.Month })
                .Select(g => new
                {
                    Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Total = g.Sum(t => t.Amount),
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Period)
                .Take(12)
                .ToList()
        };

        return Ok(stats);
    }
}

public record CreateWorkRequest(string Title, string Type, Guid PrimaryAuthorId, List<CoAuthorDto>? CoAuthors);
public record UpdateWorkRequest(string Title, string Type);
public record CoAuthorDto(Guid AuthorId, decimal SharePercentage);

