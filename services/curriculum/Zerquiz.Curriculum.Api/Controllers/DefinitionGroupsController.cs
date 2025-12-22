using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefinitionGroupsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public DefinitionGroupsController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all definition groups
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<DefinitionGroupDto>>> GetAll()
    {
        try
        {
            var groups = await _context.DefinitionGroups
                .AsNoTracking()
                .Include(g => g.Translations)
                .Where(g => g.IsActive)
                .OrderBy(g => g.DisplayOrder)
                .ToListAsync();

            var result = groups.Select(g => new DefinitionGroupDto
            {
                Id = g.Id,
                Code = g.Code,
                Name = g.Name,
                Description = g.Description,
                IsSystem = g.IsSystem,
                DisplayOrder = g.DisplayOrder,
                Icon = g.Icon,
                IsActive = g.IsActive,
                Translations = g.Translations.Select(t => new TranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    Name = t.Name,
                    Description = t.Description
                }).ToList()
            }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    /// <summary>
    /// Get definition group by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DefinitionGroupDto>> GetById(Guid id)
    {
        var group = await _context.DefinitionGroups
            .Include(g => g.Translations)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
            return NotFound();

        var result = new DefinitionGroupDto
        {
            Id = group.Id,
            Code = group.Code,
            Name = group.Name,
            Description = group.Description,
            IsSystem = group.IsSystem,
            DisplayOrder = group.DisplayOrder,
            Icon = group.Icon,
            IsActive = group.IsActive,
            Translations = group.Translations.Select(t => new TranslationDto
            {
                LanguageCode = t.LanguageCode,
                Name = t.Name,
                Description = t.Description
            }).ToList()
        };

        return Ok(result);
    }

    /// <summary>
    /// Create definition group
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DefinitionGroupDto>> Create([FromBody] CreateDefinitionGroupRequest request)
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // TODO: Get from auth

        var group = new DefinitionGroup
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            IsSystem = request.IsSystem,
            DisplayOrder = request.DisplayOrder,
            Icon = request.Icon,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        _context.DefinitionGroups.Add(group);

        // Add translations if provided
        if (request.Translations != null && request.Translations.Any())
        {
            foreach (var trans in request.Translations)
            {
                var translation = new DefinitionGroupTranslation
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    DefinitionGroupId = group.Id,
                    LanguageCode = trans.LanguageCode,
                    Name = trans.Name,
                    Description = trans.Description,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = null
                };
                _context.DefinitionGroupTranslations.Add(translation);
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = group.Id }, new DefinitionGroupDto
        {
            Id = group.Id,
            Code = group.Code,
            Name = group.Name,
            Description = group.Description,
            IsSystem = group.IsSystem,
            DisplayOrder = group.DisplayOrder,
            Icon = group.Icon,
            IsActive = group.IsActive
        });
    }

    /// <summary>
    /// Update definition group
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateDefinitionGroupRequest request)
    {
        var group = await _context.DefinitionGroups.FindAsync(id);
        if (group == null)
            return NotFound();

        group.Name = request.Name;
        group.Description = request.Description;
        group.DisplayOrder = request.DisplayOrder;
        group.Icon = request.Icon;
        group.IsActive = request.IsActive;
        group.UpdatedAt = DateTime.UtcNow;
        group.UpdatedBy = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Delete definition group
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var group = await _context.DefinitionGroups.FindAsync(id);
        if (group == null)
            return NotFound();

        if (group.IsSystem)
            return BadRequest(new { message = "Cannot delete system definition groups" });

        group.DeletedAt = DateTime.UtcNow;
        group.DeletedBy = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class DefinitionGroupDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; }
    public List<TranslationDto> Translations { get; set; } = new();
}

public class TranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CreateDefinitionGroupRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
    public string? Icon { get; set; }
    public List<TranslationDto>? Translations { get; set; }
}

public class UpdateDefinitionGroupRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; }
}

