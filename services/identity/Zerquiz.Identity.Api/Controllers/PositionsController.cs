using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Identity.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PositionsController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public PositionsController(IdentityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PositionDto>>>> GetPositions()
    {
        var positions = await _context.Positions
            .OrderBy(p => p.Level)
            .ThenBy(p => p.DisplayOrder)
            .ToListAsync();

        var result = positions.Select(p => new PositionDto
        {
            Id = p.Id,
            Code = p.Code,
            Name = p.Name,
            Description = p.Description,
            Level = p.Level,
            DisplayOrder = p.DisplayOrder
        }).ToList();

        return Ok(ApiResponse<List<PositionDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PositionDto>>> GetPosition(Guid id)
    {
        var position = await _context.Positions.FindAsync(id);
        if (position == null)
            return NotFound(ApiResponse<PositionDto>.ErrorResult("Position not found"));

        var result = new PositionDto
        {
            Id = position.Id,
            Code = position.Code,
            Name = position.Name,
            Description = position.Description,
            Level = position.Level,
            DisplayOrder = position.DisplayOrder
        };

        return Ok(ApiResponse<PositionDto>.SuccessResult(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PositionDto>>> CreatePosition([FromBody] CreatePositionRequest request)
    {
        var position = new Position
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            Level = request.Level,
            DisplayOrder = request.DisplayOrder,
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Positions.Add(position);
        await _context.SaveChangesAsync();

        var result = new PositionDto
        {
            Id = position.Id,
            Code = position.Code,
            Name = position.Name,
            Description = position.Description,
            Level = position.Level,
            DisplayOrder = position.DisplayOrder
        };

        return Ok(ApiResponse<PositionDto>.SuccessResult(result, "Position created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PositionDto>>> UpdatePosition(Guid id, [FromBody] UpdatePositionRequest request)
    {
        var position = await _context.Positions.FindAsync(id);
        if (position == null)
            return NotFound(ApiResponse<PositionDto>.ErrorResult("Position not found"));

        position.Code = request.Code;
        position.Name = request.Name;
        position.Description = request.Description;
        position.Level = request.Level;
        position.DisplayOrder = request.DisplayOrder;
        position.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<PositionDto>.SuccessResult(null, "Position updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePosition(Guid id)
    {
        var position = await _context.Positions.FindAsync(id);
        if (position == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Position not found"));

        _context.Positions.Remove(position);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true, "Position deleted successfully"));
    }
}

public class PositionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreatePositionRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdatePositionRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
}

