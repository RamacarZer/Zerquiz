using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;
using Zerquiz.Curriculum.Domain.Entities;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationModelsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public EducationModelsController(CurriculumDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EducationModelDto>>>> GetEducationModels()
    {
        var models = await _context.EducationModels
            .OrderBy(m => m.Name)
            .ToListAsync();

        var result = models.Select(m => new EducationModelDto
        {
            Id = m.Id,
            Code = m.Code,
            Name = m.Name,
            Country = m.Country,
            Description = m.Description
        }).ToList();

        return Ok(ApiResponse<List<EducationModelDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EducationModelDto>>> GetEducationModel(Guid id)
    {
        var model = await _context.EducationModels.FindAsync(id);
        if (model == null)
            return NotFound(ApiResponse<EducationModelDto>.ErrorResult("Education model not found"));

        var result = new EducationModelDto
        {
            Id = model.Id,
            Code = model.Code,
            Name = model.Name,
            Country = model.Country,
            Description = model.Description
        };

        return Ok(ApiResponse<EducationModelDto>.SuccessResult(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EducationModelDto>>> CreateEducationModel([FromBody] CreateEducationModelRequest request)
    {
        var model = new EducationModel
        {
            Code = request.Code,
            Name = request.Name,
            Country = request.Country,
            Description = request.Description,
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // Default tenant
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.EducationModels.Add(model);
        await _context.SaveChangesAsync();

        var result = new EducationModelDto
        {
            Id = model.Id,
            Code = model.Code,
            Name = model.Name,
            Country = model.Country,
            Description = model.Description
        };

        return Ok(ApiResponse<EducationModelDto>.SuccessResult(result, "Education model created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EducationModelDto>>> UpdateEducationModel(Guid id, [FromBody] UpdateEducationModelRequest request)
    {
        var model = await _context.EducationModels.FindAsync(id);
        if (model == null)
            return NotFound(ApiResponse<EducationModelDto>.ErrorResult("Education model not found"));

        model.Code = request.Code;
        model.Name = request.Name;
        model.Country = request.Country;
        model.Description = request.Description;
        model.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EducationModelDto>.SuccessResult(null, "Education model updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteEducationModel(Guid id)
    {
        var model = await _context.EducationModels.FindAsync(id);
        if (model == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Education model not found"));

        _context.EducationModels.Remove(model);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true, "Education model deleted successfully"));
    }
}

public class EducationModelDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CreateEducationModelRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateEducationModelRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Description { get; set; }
}

