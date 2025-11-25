using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefinitionsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public DefinitionsController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all definitions with optional filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<DefinitionDto>>> GetAll(
        [FromQuery] string? groupKey = null,
        [FromQuery] Guid? parentId = null,
        [FromQuery] bool includeChildren = false)
    {
        var query = _context.Definitions
            .Include(d => d.Group)
            .Include(d => d.Parent)
            .Include(d => d.Translations)
            .Where(d => d.IsActive);

        if (!string.IsNullOrEmpty(groupKey))
            query = query.Where(d => d.GroupKey == groupKey);

        if (parentId.HasValue)
            query = query.Where(d => d.ParentId == parentId);
        else if (!includeChildren)
            query = query.Where(d => d.ParentId == null);

        var definitions = await query.OrderBy(d => d.DisplayOrder).ToListAsync();

        var result = definitions.Select(d => MapToDto(d, includeChildren)).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Get hierarchical tree
    /// </summary>
    [HttpGet("tree")]
    public async Task<ActionResult<List<DefinitionDto>>> GetTree([FromQuery] string? groupKey = null)
    {
        var query = _context.Definitions
            .Include(d => d.Group)
            .Include(d => d.Translations)
            .Where(d => d.IsActive);

        if (!string.IsNullOrEmpty(groupKey))
            query = query.Where(d => d.GroupKey == groupKey);

        var allDefinitions = await query.OrderBy(d => d.DisplayOrder).ToListAsync();

        var tree = BuildHierarchy(allDefinitions);

        return Ok(tree);
    }

    /// <summary>
    /// Get definition by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DefinitionDto>> GetById(Guid id)
    {
        var definition = await _context.Definitions
            .Include(d => d.Group)
            .Include(d => d.Parent)
            .Include(d => d.Translations)
            .Include(d => d.Children)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (definition == null)
            return NotFound();

        var result = MapToDto(definition, true);

        return Ok(result);
    }

    /// <summary>
    /// Get children of a definition
    /// </summary>
    [HttpGet("{id}/children")]
    public async Task<ActionResult<List<DefinitionDto>>> GetChildren(Guid id)
    {
        var children = await _context.Definitions
            .Include(d => d.Group)
            .Include(d => d.Translations)
            .Where(d => d.ParentId == id && d.IsActive)
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        var result = children.Select(d => MapToDto(d, false)).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Create definition
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DefinitionDto>> Create([FromBody] CreateDefinitionRequest request)
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // TODO: Get from auth

        // Validate group exists
        var group = await _context.DefinitionGroups.FindAsync(request.GroupId);
        if (group == null)
            return BadRequest(new { message = "Definition group not found" });

        // Validate parent if provided
        if (request.ParentId.HasValue)
        {
            var parent = await _context.Definitions.FindAsync(request.ParentId.Value);
            if (parent == null)
                return BadRequest(new { message = "Parent definition not found" });
        }

        var definition = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = request.GroupId,
            GroupKey = request.GroupKey,
            ParentId = request.ParentId,
            Code = request.Code,
            Name = request.Name,
            AltNames = request.AltNames,
            Description = request.Description,
            Color = request.Color,
            Icon = request.Icon,
            IsDefault = request.IsDefault,
            DisplayOrder = request.DisplayOrder,
            IsSystem = false,
            ValidFrom = request.ValidFrom,
            ValidTo = request.ValidTo,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        _context.Definitions.Add(definition);

        // Add translations if provided
        if (request.Translations != null && request.Translations.Any())
        {
            foreach (var trans in request.Translations)
            {
                var translation = new DefinitionTranslation
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    DefinitionId = definition.Id,
                    LanguageCode = trans.LanguageCode,
                    Name = trans.Name,
                    Description = trans.Description,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = null
                };
                _context.DefinitionTranslations.Add(translation);
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = definition.Id }, MapToDto(definition, false));
    }

    /// <summary>
    /// Update definition
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateDefinitionRequest request)
    {
        var definition = await _context.Definitions.FindAsync(id);
        if (definition == null)
            return NotFound();

        definition.Name = request.Name;
        definition.AltNames = request.AltNames;
        definition.Description = request.Description;
        definition.Color = request.Color;
        definition.Icon = request.Icon;
        definition.IsDefault = request.IsDefault;
        definition.DisplayOrder = request.DisplayOrder;
        definition.ValidFrom = request.ValidFrom;
        definition.ValidTo = request.ValidTo;
        definition.IsActive = request.IsActive;
        definition.UpdatedAt = DateTime.UtcNow;
        definition.UpdatedBy = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Delete definition
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var definition = await _context.Definitions
            .Include(d => d.Children)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (definition == null)
            return NotFound();

        if (definition.IsSystem)
            return BadRequest(new { message = "Cannot delete system definitions" });

        if (definition.Children.Any())
            return BadRequest(new { message = "Cannot delete definition with children" });

        definition.DeletedAt = DateTime.UtcNow;
        definition.DeletedBy = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Helper methods
    private DefinitionDto MapToDto(Definition definition, bool includeChildren)
    {
        var dto = new DefinitionDto
        {
            Id = definition.Id,
            GroupId = definition.GroupId,
            GroupKey = definition.GroupKey,
            GroupName = definition.Group?.Name,
            ParentId = definition.ParentId,
            ParentName = definition.Parent?.Name,
            Code = definition.Code,
            Name = definition.Name,
            AltNames = definition.AltNames,
            Description = definition.Description,
            Color = definition.Color,
            Icon = definition.Icon,
            IsDefault = definition.IsDefault,
            DisplayOrder = definition.DisplayOrder,
            IsSystem = definition.IsSystem,
            ValidFrom = definition.ValidFrom,
            ValidTo = definition.ValidTo,
            IsActive = definition.IsActive,
            Translations = definition.Translations.Select(t => new TranslationDto
            {
                LanguageCode = t.LanguageCode,
                Name = t.Name,
                Description = t.Description
            }).ToList()
        };

        if (includeChildren && definition.Children != null)
        {
            dto.Children = definition.Children
                .OrderBy(c => c.DisplayOrder)
                .Select(c => MapToDto(c, true))
                .ToList();
        }

        return dto;
    }

    private List<DefinitionDto> BuildHierarchy(List<Definition> allDefinitions)
    {
        var definitionMap = allDefinitions.ToDictionary(d => d.Id);
        var rootDefinitions = new List<DefinitionDto>();

        foreach (var definition in allDefinitions.OrderBy(d => d.DisplayOrder))
        {
            var dto = MapToDto(definition, false);

            if (definition.ParentId == null)
            {
                rootDefinitions.Add(dto);
            }
            else if (definitionMap.ContainsKey(definition.ParentId.Value))
            {
                var parent = allDefinitions.First(d => d.Id == definition.ParentId.Value);
                // This will be handled recursively
            }
        }

        // Build children recursively
        foreach (var root in rootDefinitions)
        {
            PopulateChildren(root, allDefinitions);
        }

        return rootDefinitions;
    }

    private void PopulateChildren(DefinitionDto parent, List<Definition> allDefinitions)
    {
        var children = allDefinitions
            .Where(d => d.ParentId == parent.Id)
            .OrderBy(d => d.DisplayOrder)
            .Select(d => MapToDto(d, false))
            .ToList();

        parent.Children = children;

        foreach (var child in children)
        {
            PopulateChildren(child, allDefinitions);
        }
    }
}

// DTOs
public class DefinitionDto
{
    public Guid Id { get; set; }
    public Guid GroupId { get; set; }
    public string GroupKey { get; set; } = string.Empty;
    public string? GroupName { get; set; }
    public Guid? ParentId { get; set; }
    public string? ParentName { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string[]? AltNames { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public bool IsDefault { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsSystem { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; }
    public List<TranslationDto> Translations { get; set; } = new();
    public List<DefinitionDto> Children { get; set; } = new();
}

public class CreateDefinitionRequest
{
    public Guid GroupId { get; set; }
    public string GroupKey { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string[]? AltNames { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public bool IsDefault { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public List<TranslationDto>? Translations { get; set; }
}

public class UpdateDefinitionRequest
{
    public string Name { get; set; } = string.Empty;
    public string[]? AltNames { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public bool IsDefault { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; }
}

