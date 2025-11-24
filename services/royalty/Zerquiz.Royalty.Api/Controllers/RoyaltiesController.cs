using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Application.DTOs;
using Zerquiz.Royalty.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoyaltiesController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public RoyaltiesController(RoyaltyDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary/{authorId}")]
    public async Task<ActionResult<ApiResponse<List<RoyaltySummaryDto>>>> GetSummary(Guid authorId)
    {
        var summary = await _context.RoyaltyTransactions
            .Where(t => t.AuthorId == authorId)
            .GroupBy(t => new { t.AccruedAt.Year, t.AccruedAt.Month, t.Currency })
            .Select(g => new RoyaltySummaryDto
            {
                AuthorId = authorId,
                Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                TotalAmount = g.Sum(t => t.Amount),
                Currency = g.Key.Currency,
                TransactionCount = g.Count()
            })
            .ToListAsync();

        return Ok(ApiResponse<List<RoyaltySummaryDto>>.SuccessResult(summary));
    }
}

