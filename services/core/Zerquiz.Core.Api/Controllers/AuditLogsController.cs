using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<AuditLogsController> _logger;

    public AuditLogsController(CoreDbContext context, ILogger<AuditLogsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get audit logs with filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AuditLogDto>>>> GetAll(
        [FromQuery] Guid? tenantId,
        [FromQuery] Guid? userId,
        [FromQuery] string? action,
        [FromQuery] string? entityName,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.AuditLogs.AsQueryable();

        // Filters
        if (tenantId.HasValue)
            query = query.Where(a => a.TenantId == tenantId.Value);

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(a => a.Action == action);

        if (!string.IsNullOrWhiteSpace(entityName))
            query = query.Where(a => a.EntityName == entityName);

        if (startDate.HasValue)
            query = query.Where(a => a.Timestamp >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(a => a.Timestamp <= endDate.Value);

        var totalCount = await query.CountAsync();

        var logs = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = logs.Select(a => new AuditLogDto
        {
            Id = a.Id,
            TenantId = a.TenantId,
            UserId = a.UserId,
            Action = a.Action,
            EntityName = a.EntityName,
            EntityId = a.EntityId,
            IpAddress = a.IpAddress,
            Timestamp = a.Timestamp
        }).ToList();

        var result = new PagedResult<AuditLogDto>(dtos, totalCount, pageNumber, pageSize);

        return Ok(ApiResponse<PagedResult<AuditLogDto>>.SuccessResult(result));
    }

    /// <summary>
    /// Get audit log by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AuditLogDto>>> GetById(Guid id)
    {
        var log = await _context.AuditLogs.FindAsync(id);

        if (log == null)
            return NotFound(ApiResponse<AuditLogDto>.ErrorResult("Audit log not found"));

        var dto = new AuditLogDto
        {
            Id = log.Id,
            TenantId = log.TenantId,
            UserId = log.UserId,
            Action = log.Action,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            IpAddress = log.IpAddress,
            Timestamp = log.Timestamp
        };

        return Ok(ApiResponse<AuditLogDto>.SuccessResult(dto));
    }

    /// <summary>
    /// Get audit logs for specific entity
    /// </summary>
    [HttpGet("entity/{entityName}/{entityId}")]
    public async Task<ActionResult<ApiResponse<List<AuditLogDto>>>> GetByEntity(string entityName, Guid entityId)
    {
        var logs = await _context.AuditLogs
            .Where(a => a.EntityName == entityName && a.EntityId == entityId)
            .OrderByDescending(a => a.Timestamp)
            .Take(100) // Limit to last 100 changes
            .ToListAsync();

        var dtos = logs.Select(a => new AuditLogDto
        {
            Id = a.Id,
            TenantId = a.TenantId,
            UserId = a.UserId,
            Action = a.Action,
            EntityName = a.EntityName,
            EntityId = a.EntityId,
            IpAddress = a.IpAddress,
            Timestamp = a.Timestamp
        }).ToList();

        return Ok(ApiResponse<List<AuditLogDto>>.SuccessResult(dtos));
    }

    /// <summary>
    /// Get distinct actions
    /// </summary>
    [HttpGet("actions")]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetActions()
    {
        var actions = await _context.AuditLogs
            .Select(a => a.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();

        return Ok(ApiResponse<List<string>>.SuccessResult(actions));
    }

    /// <summary>
    /// Get distinct entity names
    /// </summary>
    [HttpGet("entities")]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetEntityNames()
    {
        var entityNames = await _context.AuditLogs
            .Select(a => a.EntityName)
            .Distinct()
            .OrderBy(e => e)
            .ToListAsync();

        return Ok(ApiResponse<List<string>>.SuccessResult(entityNames));
    }
}

// DTOs
public class AuditLogDto
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

