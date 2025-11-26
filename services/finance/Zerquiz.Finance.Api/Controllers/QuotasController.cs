using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Finance.Application.DTOs;
using Zerquiz.Finance.Domain.Entities;
using Zerquiz.Finance.Infrastructure.Persistence;

namespace Zerquiz.Finance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuotasController : ControllerBase
{
    private readonly FinanceDbContext _context;
    private readonly ILogger<QuotasController> _logger;

    public QuotasController(FinanceDbContext context, ILogger<QuotasController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get quotas for current organization
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsageQuotaDto>>> GetQuotas()
    {
        var quotas = await _context.UsageQuotas
            .Include(q => q.Usages)
            .Select(q => new UsageQuotaDto(
                q.Id,
                q.ResourceType,
                q.Limit,
                q.Usages.Sum(u => u.Used),
                q.Period,
                q.ResetAt,
                q.IsHardLimit
            ))
            .ToListAsync();

        return Ok(quotas);
    }

    /// <summary>
    /// Check if action is within quota
    /// </summary>
    [HttpPost("check")]
    public async Task<ActionResult<QuotaCheckResponse>> CheckQuota([FromBody] QuotaCheckRequest request)
    {
        var quota = await _context.UsageQuotas
            .Include(q => q.Usages)
            .FirstOrDefaultAsync(q => q.ResourceType == request.ResourceType);

        if (quota == null)
        {
            return Ok(new QuotaCheckResponse(true, int.MaxValue, "No quota defined"));
        }

        var currentUsage = quota.Usages.Sum(u => u.Used);
        var remaining = quota.Limit - currentUsage;
        var isAllowed = remaining >= request.RequestedAmount;

        if (!isAllowed && quota.IsHardLimit)
        {
            return Ok(new QuotaCheckResponse(
                false,
                remaining,
                $"Quota exceeded. Limit: {quota.Limit}, Used: {currentUsage}, Requested: {request.RequestedAmount}"
            ));
        }

        return Ok(new QuotaCheckResponse(isAllowed, remaining, null));
    }

    /// <summary>
    /// Increment quota usage
    /// </summary>
    [HttpPost("increment")]
    public async Task<IActionResult> IncrementUsage([FromBody] QuotaCheckRequest request)
    {
        var quota = await _context.UsageQuotas
            .FirstOrDefaultAsync(q => q.ResourceType == request.ResourceType);

        if (quota == null)
        {
            return BadRequest("Quota not found");
        }

        var usage = new QuotaUsage
        {
            QuotaId = quota.Id,
            Used = request.RequestedAmount,
            RecordedAt = DateTime.UtcNow,
            Action = $"{request.ResourceType}_created"
        };

        _context.QuotaUsages.Add(usage);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Get usage report
    /// </summary>
    [HttpGet("usage-report")]
    public async Task<ActionResult> GetUsageReport()
    {
        var report = await _context.UsageQuotas
            .Include(q => q.Usages)
            .Select(q => new
            {
                ResourceType = q.ResourceType,
                Limit = q.Limit,
                Used = q.Usages.Sum(u => u.Used),
                Remaining = q.Limit - q.Usages.Sum(u => u.Used),
                UsagePercent = (decimal)q.Usages.Sum(u => u.Used) / q.Limit * 100,
                Period = q.Period,
                ResetAt = q.ResetAt
            })
            .ToListAsync();

        return Ok(report);
    }
}

