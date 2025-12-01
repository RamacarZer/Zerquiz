// TEMPORARY: Disabled due to entity schema mismatch
/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly CoreDbContext _context;

    public AuditLogsController(CoreDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get audit logs with filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] Guid? userId = null,
        [FromQuery] string? entityType = null,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(a => a.EntityType == entityType);

        if (!string.IsNullOrEmpty(action))
            query = query.Where(a => a.Action == action);

        if (from.HasValue)
            query = query.Where(a => a.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.CreatedAt <= to.Value);

        var total = await query.CountAsync();

        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                a.UserId,
                a.EntityType,
                a.EntityId,
                a.Action,
                a.IpAddress,
                a.UserAgent,
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            logs,
            pagination = new
            {
                page,
                pageSize,
                total,
                totalPages = (int)Math.Ceiling(total / (double)pageSize)
            }
        });
    }

    /// <summary>
    /// Get audit log by ID (with full details)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var log = await _context.AuditLogs.FindAsync(id);
        if (log == null)
            return NotFound();

        return Ok(log);
    }

    /// <summary>
    /// Get audit trail for specific entity
    /// </summary>
    [HttpGet("entity/{entityType}/{entityId}")]
    public async Task<ActionResult> GetEntityTrail(string entityType, Guid entityId)
    {
        var logs = await _context.AuditLogs
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .OrderBy(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.Action,
                a.UserId,
                a.CreatedAt,
                a.Changes,
                a.IpAddress
            })
            .ToListAsync();

        return Ok(new
        {
            entityType,
            entityId,
            totalChanges = logs.Count,
            history = logs
        });
    }

    /// <summary>
    /// Get user activity report
    /// </summary>
    [HttpGet("user/{userId}/activity")]
    public async Task<ActionResult> GetUserActivity(
        Guid userId,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var query = _context.AuditLogs.Where(a => a.UserId == userId);

        if (from.HasValue)
            query = query.Where(a => a.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.CreatedAt <= to.Value);

        var logs = await query.ToListAsync();

        var activity = new
        {
            userId,
            totalActions = logs.Count,
            byAction = logs.GroupBy(a => a.Action)
                .Select(g => new { action = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ToList(),
            byEntityType = logs.GroupBy(a => a.EntityType)
                .Select(g => new { entityType = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ToList(),
            recentActivity = logs.OrderByDescending(a => a.CreatedAt)
                .Take(10)
                .Select(a => new
                {
                    a.Action,
                    a.EntityType,
                    a.CreatedAt
                })
                .ToList()
        };

        return Ok(activity);
    }

    /// <summary>
    /// Get system activity statistics
    /// </summary>
    [HttpGet("statistics")]
    public async Task<ActionResult> GetStatistics([FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (from.HasValue)
            query = query.Where(a => a.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.CreatedAt <= to.Value);

        var logs = await query.ToListAsync();

        var stats = new
        {
            totalActions = logs.Count,
            uniqueUsers = logs.Select(a => a.UserId).Distinct().Count(),
            byAction = logs.GroupBy(a => a.Action)
                .Select(g => new { action = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ToList(),
            byEntityType = logs.GroupBy(a => a.EntityType)
                .Select(g => new { entityType = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ToList(),
            byHour = logs.GroupBy(a => a.CreatedAt.Hour)
                .Select(g => new { hour = g.Key, count = g.Count() })
                .OrderBy(x => x.hour)
                .ToList(),
            topUsers = logs.GroupBy(a => a.UserId)
                .Select(g => new { userId = g.Key, actionCount = g.Count() })
                .OrderByDescending(x => x.actionCount)
                .Take(10)
                .ToList()
        };

        return Ok(stats);
    }

    /// <summary>
    /// Search audit logs with advanced filters
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult> Search([FromBody] SearchAuditLogsRequest request)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (request.UserIds != null && request.UserIds.Any())
            query = query.Where(a => request.UserIds.Contains(a.UserId));

        if (request.EntityTypes != null && request.EntityTypes.Any())
            query = query.Where(a => request.EntityTypes.Contains(a.EntityType));

        if (request.Actions != null && request.Actions.Any())
            query = query.Where(a => request.Actions.Contains(a.Action));

        if (request.FromDate.HasValue)
            query = query.Where(a => a.CreatedAt >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(a => a.CreatedAt <= request.ToDate.Value);

        if (!string.IsNullOrEmpty(request.IpAddress))
            query = query.Where(a => a.IpAddress == request.IpAddress);

        var total = await query.CountAsync();

        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return Ok(new
        {
            logs,
            pagination = new
            {
                page = request.Page,
                pageSize = request.PageSize,
                total,
                totalPages = (int)Math.Ceiling(total / (double)request.PageSize)
            }
        });
    }

    /// <summary>
    /// Export audit logs (would generate CSV/Excel)
    /// </summary>
    [HttpPost("export")]
    public async Task<ActionResult> Export([FromBody] ExportAuditLogsRequest request)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (request.FromDate.HasValue)
            query = query.Where(a => a.CreatedAt >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(a => a.CreatedAt <= request.ToDate.Value);

        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .Take(10000) // Limit export size
            .ToListAsync();

        // In real implementation, generate CSV/Excel file
        return Ok(new
        {
            message = "Export prepared",
            recordCount = logs.Count,
            format = request.Format
        });
    }
}
*/

/*
public record SearchAuditLogsRequest(
    List<Guid>? UserIds,
    List<string>? EntityTypes,
    List<string>? Actions,
    DateTime? FromDate,
    DateTime? ToDate,
    string? IpAddress,
    int Page = 1,
    int PageSize = 50
);

public record ExportAuditLogsRequest(DateTime? FromDate, DateTime? ToDate, string Format = "csv");
*/