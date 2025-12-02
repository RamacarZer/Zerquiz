using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefinitionsController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<DefinitionsController> _logger;

    public DefinitionsController(CoreDbContext context, ILogger<DefinitionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Dropdown için tanımlamaları getir (multi-language destekli)
    /// </summary>
    /// <param name="groupCode">Definition group code (örn: question_types, difficulty_levels)</param>
    /// <param name="language">Dil kodu (tr, en, ar)</param>
    /// <param name="includeInactive">Pasif kayıtları da getir</param>
    [HttpGet("dropdown/{groupCode}")]
    public async Task<ActionResult<DropdownResponse>> GetDropdown(
        string groupCode,
        [FromQuery] string language = "en",
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            // Get group
            var group = await _context.DefinitionGroups
                .FirstOrDefaultAsync(g => g.Code == groupCode);

            if (group == null)
            {
                return NotFound($"Definition group '{groupCode}' not found");
            }

            // Get definitions with translations
            var query = _context.Definitions
                .Where(d => d.DefinitionGroupId == group.Id);

            if (!includeInactive)
            {
                query = query.Where(d => d.IsActive);
            }

            var definitions = await query
                .OrderBy(d => d.DisplayOrder)
                .Select(d => new DropdownItemDto
                {
                    Id = d.Id,
                    Code = d.Code,
                    Value = d.Value, // Default English value
                    DisplayOrder = d.DisplayOrder,
                    IconName = d.IconName,
                    ColorCode = d.ColorCode,
                    IsActive = d.IsActive,
                    Metadata = d.Metadata != null ? d.Metadata.RootElement.ToString() : null
                })
                .ToListAsync();

            // Get translations for requested language
            if (language != "en")
            {
                var definitionIds = definitions.Select(d => d.Id).ToList();
                var translations = await _context.DefinitionTranslations
                    .Where(t => definitionIds.Contains(t.DefinitionId) && t.LanguageCode == language)
                    .ToDictionaryAsync(t => t.DefinitionId, t => t.Value);

                // Apply translations
                foreach (var def in definitions)
                {
                    if (translations.TryGetValue(def.Id, out var translatedName))
                    {
                        def.Value = translatedName;
                    }
                }
            }

            var response = new DropdownResponse
            {
                GroupCode = groupCode,
                GroupName = group.Name,
                Language = language,
                Items = definitions,
                TotalCount = definitions.Count() // Add () to invoke Count method
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dropdown for group {GroupCode}", groupCode);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Hiyerarşik dropdown (parent-child ilişkileri ile)
    /// </summary>
    [HttpGet("dropdown/{groupCode}/hierarchical")]
    public async Task<ActionResult<HierarchicalDropdownResponse>> GetHierarchicalDropdown(
        string groupCode,
        [FromQuery] string language = "en",
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var group = await _context.DefinitionGroups
                .FirstOrDefaultAsync(g => g.Code == groupCode);

            if (group == null)
            {
                return NotFound($"Definition group '{groupCode}' not found");
            }

            // Get all definitions
            var query = _context.Definitions
                .Where(d => d.DefinitionGroupId == group.Id);

            if (!includeInactive)
            {
                query = query.Where(d => d.IsActive);
            }

            var definitions = await query
                .OrderBy(d => d.DisplayOrder)
                .ToListAsync();

            // Get translations
            var definitionIds = definitions.Select(d => d.Id).ToList();
            var translations = language != "en"
                ? await _context.DefinitionTranslations
                    .Where(t => definitionIds.Contains(t.DefinitionId) && t.LanguageCode == language)
                    .ToDictionaryAsync(t => t.DefinitionId, t => t.Value)
                : new Dictionary<Guid, string>();

            // Build hierarchical structure
            var items = definitions.Select(d => new HierarchicalDropdownItemDto
            {
                Id = d.Id,
                Code = d.Code,
                Value = translations.TryGetValue(d.Id, out var translated) ? translated : d.Value,
                ParentId = d.ParentDefinitionId,
                Level = d.Level,
                DisplayOrder = d.DisplayOrder,
                IconName = d.IconName,
                ColorCode = d.ColorCode,
                IsActive = d.IsActive,
                HasChildren = definitions.Any(child => child.ParentDefinitionId == d.Id),
                Metadata = d.Metadata != null ? d.Metadata.RootElement.ToString() : null
            }).ToList();

            var response = new HierarchicalDropdownResponse
            {
                GroupCode = groupCode,
                GroupName = group.Name,
                Language = language,
                Items = items,
                TotalCount = items.Count() // Add () to invoke Count method
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting hierarchical dropdown for group {GroupCode}", groupCode);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Belirli bir definition'ın detaylarını getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DefinitionDetailDto>> GetById(Guid id, [FromQuery] string language = "en")
    {
        try
        {
            var definition = await _context.Definitions
                .Include(d => d.DefinitionGroup)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (definition == null)
            {
                return NotFound();
            }

            // Get translations
            var translations = await _context.DefinitionTranslations
                .Where(t => t.DefinitionId == id)
                .ToDictionaryAsync(t => t.LanguageCode);

            var detail = new DefinitionDetailDto
            {
                Id = definition.Id,
                GroupCode = definition.DefinitionGroup?.Code ?? "",
                Code = definition.Code,
                Value = definition.Value,
                Description = definition.Description,
                ParentId = definition.ParentDefinitionId,
                Level = definition.Level,
                DisplayOrder = definition.DisplayOrder,
                IconName = definition.IconName,
                ColorCode = definition.ColorCode,
                IsSystemReserved = definition.IsSystemReserved,
                IsActive = definition.IsActive,
                Metadata = definition.Metadata != null ? definition.Metadata.RootElement.ToString() : null,
                Translations = translations.Select(kvp => new TranslationDto
                {
                    LanguageCode = kvp.Key,
                    Name = kvp.Value.Value,
                    Description = kvp.Value.Description
                }).ToList()
            };

            return Ok(detail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting definition {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Tüm definition gruplarını listele
    /// </summary>
    [HttpGet("groups")]
    public async Task<ActionResult<List<DefinitionGroupDto>>> GetGroups([FromQuery] string? moduleCode = null)
    {
        try
        {
            var query = _context.DefinitionGroups.AsQueryable();

            if (!string.IsNullOrEmpty(moduleCode))
            {
                // Filter by ModuleId if needed (moduleCode would need to be converted to Guid)
                // For now, skip this filter or implement module lookup
                // query = query.Where(g => g.ModuleId == moduleGuid);
            }

            var groups = await query
                .OrderBy(g => g.DisplayOrder)
                .Select(g => new DefinitionGroupDto
                {
                    Id = g.Id,
                    Code = g.Code,
                    Name = g.Name,
                    Description = g.Description,
                    ModuleCode = null, // ModuleId is Guid, not string
                    Level = 0, // DefinitionGroup doesn't have Level
                    IconName = g.IconName,
                    DisplayOrder = g.DisplayOrder,
                    IsSystemReserved = g.IsSystemReserved,
                    IsActive = g.IsActive,
                    DefinitionCount = _context.Definitions.Count(d => d.DefinitionGroupId == g.Id)
                })
                .ToListAsync();

            return Ok(groups);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting definition groups");
            return StatusCode(500, "Internal server error");
        }
    }
}

// ============================================
// DTOs
// ============================================

public class DropdownResponse
{
    public string GroupCode { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public List<DropdownItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
}

public class DropdownItemDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public bool IsActive { get; set; }
    public string? Metadata { get; set; }
}

public class HierarchicalDropdownResponse
{
    public string GroupCode { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public List<HierarchicalDropdownItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
}

public class HierarchicalDropdownItemDto : DropdownItemDto
{
    public Guid? ParentId { get; set; }
    public int Level { get; set; }
    public bool HasChildren { get; set; }
}

public class DefinitionDetailDto
{
    public Guid Id { get; set; }
    public string GroupCode { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentId { get; set; }
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public bool IsSystemReserved { get; set; }
    public bool IsActive { get; set; }
    public string? Metadata { get; set; }
    public List<TranslationDto> Translations { get; set; } = new();
}

public class TranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class DefinitionGroupDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ModuleCode { get; set; }
    public int Level { get; set; }
    public string? IconName { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsSystemReserved { get; set; }
    public bool IsActive { get; set; }
    public int DefinitionCount { get; set; }
}

