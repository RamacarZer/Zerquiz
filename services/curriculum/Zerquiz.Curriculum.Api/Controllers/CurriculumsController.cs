using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurriculumsController : ControllerBase
{
    private readonly CurriculumDbContext _context;
    private readonly ILogger<CurriculumsController> _logger;

    public CurriculumsController(CurriculumDbContext context, ILogger<CurriculumsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CurriculumDto>>>> GetAll(
        [FromQuery] Guid? educationModelId,
        [FromQuery] int? year,
        [FromQuery] bool? isActive)
    {
        var query = _context.Curricula
            .Include(c => c.EducationModel)
            .Where(c => c.DeletedAt == null);

        if (educationModelId.HasValue)
            query = query.Where(c => c.EducationModelId == educationModelId);

        if (year.HasValue)
            query = query.Where(c => c.Year == year);

        if (isActive.HasValue)
            query = query.Where(c => c.IsActive == isActive);

        var curricula = await query
            .OrderByDescending(c => c.Year)
            .ThenBy(c => c.Term)
            .ToListAsync();

        var dtos = curricula.Select(c => new CurriculumDto
        {
            Id = c.Id,
            EducationModelId = c.EducationModelId,
            EducationModelName = c.EducationModel.Name,
            Name = c.Name,
            Year = c.Year,
            Term = c.Term,
            Version = c.CurriculumVersion,
            IsActive = c.IsActive
        }).ToList();

        return Ok(ApiResponse<List<CurriculumDto>>.SuccessResult(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CurriculumDto>>> GetById(Guid id)
    {
        var curriculum = await _context.Curricula
            .Include(c => c.EducationModel)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (curriculum == null)
            return NotFound(ApiResponse<CurriculumDto>.ErrorResult("Curriculum not found"));

        var dto = new CurriculumDto
        {
            Id = curriculum.Id,
            EducationModelId = curriculum.EducationModelId,
            EducationModelName = curriculum.EducationModel.Name,
            Name = curriculum.Name,
            Year = curriculum.Year,
            Term = curriculum.Term,
            Version = curriculum.CurriculumVersion,
            IsActive = curriculum.IsActive
        };

        return Ok(ApiResponse<CurriculumDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CurriculumDto>>> Create([FromBody] CreateCurriculumRequest request)
    {
        // Check if education model exists
        var educationModel = await _context.EducationModels.FindAsync(request.EducationModelId);
        if (educationModel == null)
            return BadRequest(ApiResponse<CurriculumDto>.ErrorResult("Education model not found"));

        var curriculum = new Domain.Entities.Curriculum
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // System level
            EducationModelId = request.EducationModelId,
            Name = request.Name,
            Year = request.Year,
            Term = request.Term,
            CurriculumVersion = request.Version,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Version = 1
        };

        _context.Curricula.Add(curriculum);
        await _context.SaveChangesAsync();

        // Reload with includes
        curriculum = await _context.Curricula
            .Include(c => c.EducationModel)
            .FirstAsync(c => c.Id == curriculum.Id);

        var dto = new CurriculumDto
        {
            Id = curriculum.Id,
            EducationModelId = curriculum.EducationModelId,
            EducationModelName = curriculum.EducationModel.Name,
            Name = curriculum.Name,
            Year = curriculum.Year,
            Term = curriculum.Term,
            Version = curriculum.CurriculumVersion,
            IsActive = curriculum.IsActive
        };

        return CreatedAtAction(nameof(GetById), new { id = curriculum.Id }, ApiResponse<CurriculumDto>.SuccessResult(dto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CurriculumDto>>> Update(Guid id, [FromBody] UpdateCurriculumRequest request)
    {
        var curriculum = await _context.Curricula
            .Include(c => c.EducationModel)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (curriculum == null)
            return NotFound(ApiResponse<CurriculumDto>.ErrorResult("Curriculum not found"));

        curriculum.Name = request.Name;
        curriculum.Year = request.Year;
        curriculum.Term = request.Term;
        curriculum.CurriculumVersion = request.Version;
        curriculum.UpdatedAt = DateTime.UtcNow;
        curriculum.Version++;

        await _context.SaveChangesAsync();

        var dto = new CurriculumDto
        {
            Id = curriculum.Id,
            EducationModelId = curriculum.EducationModelId,
            EducationModelName = curriculum.EducationModel.Name,
            Name = curriculum.Name,
            Year = curriculum.Year,
            Term = curriculum.Term,
            Version = curriculum.CurriculumVersion,
            IsActive = curriculum.IsActive
        };

        return Ok(ApiResponse<CurriculumDto>.SuccessResult(dto));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var curriculum = await _context.Curricula
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (curriculum == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Curriculum not found"));

        // Soft delete
        curriculum.DeletedAt = DateTime.UtcNow;
        curriculum.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleStatus(Guid id)
    {
        var curriculum = await _context.Curricula
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (curriculum == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Curriculum not found"));

        curriculum.IsActive = !curriculum.IsActive;
        curriculum.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }
}

// DTOs
public class CurriculumDto
{
    public Guid Id { get; set; }
    public Guid EducationModelId { get; set; }
    public string EducationModelName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Term { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreateCurriculumRequest
{
    public Guid EducationModelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Term { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0";
}

public class UpdateCurriculumRequest
{
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Term { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0";
}

