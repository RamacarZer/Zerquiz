using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemDefinitionsController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<SystemDefinitionsController> _logger;

    public SystemDefinitionsController(CoreDbContext context, ILogger<SystemDefinitionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Kategoriye göre tanımlamaları getir
    /// </summary>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<SystemDefinition>>> GetByCategory(string category, [FromQuery] string? language = "tr")
    {
        var definitions = await _context.SystemDefinitions
            .Where(d => d.Category == category)
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        return Ok(definitions);
    }

    /// <summary>
    /// Tüm kategorileri listele
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _context.SystemDefinitions
            .Select(d => d.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Yeni tanımlama ekle
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SystemDefinition>> Create([FromBody] SystemDefinition definition)
    {
        // Check for duplicate
        var exists = await _context.SystemDefinitions
            .AnyAsync(d => d.Category == definition.Category && d.Code == definition.Code);

        if (exists)
        {
            return BadRequest("Bu kategori ve kod kombinasyonu zaten mevcut.");
        }

        definition.Id = Guid.NewGuid();
        definition.CreatedAt = DateTime.UtcNow;
        definition.UpdatedAt = DateTime.UtcNow;

        _context.SystemDefinitions.Add(definition);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = definition.Id }, definition);
    }

    /// <summary>
    /// ID ile tanımlama getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SystemDefinition>> GetById(Guid id)
    {
        var definition = await _context.SystemDefinitions.FindAsync(id);

        if (definition == null)
        {
            return NotFound();
        }

        return Ok(definition);
    }

    /// <summary>
    /// Tanımlama güncelle
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<SystemDefinition>> Update(Guid id, [FromBody] SystemDefinition definition)
    {
        var existing = await _context.SystemDefinitions.FindAsync(id);

        if (existing == null)
        {
            return NotFound();
        }

        if (existing.IsSystemReserved && !definition.IsEditable)
        {
            return BadRequest("Sistem tanımlamaları düzenlenemez.");
        }

        existing.Name = definition.Name;
        existing.Description = definition.Description;
        existing.NameEn = definition.NameEn;
        existing.NameTr = definition.NameTr;
        existing.NameAr = definition.NameAr;
        existing.DescriptionEn = definition.DescriptionEn;
        existing.DescriptionTr = definition.DescriptionTr;
        existing.DescriptionAr = definition.DescriptionAr;
        existing.DisplayOrder = definition.DisplayOrder;
        existing.Icon = definition.Icon;
        existing.Color = definition.Color;
        existing.ConfigurationJson = definition.ConfigurationJson;
        existing.IsActive = definition.IsActive;
        existing.Tags = definition.Tags;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.Version++;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    /// <summary>
    /// Tanımlama sil (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var definition = await _context.SystemDefinitions.FindAsync(id);

        if (definition == null)
        {
            return NotFound();
        }

        if (definition.IsSystemReserved)
        {
            return BadRequest("Sistem tanımlamaları silinemez.");
        }

        definition.DeletedAt = DateTime.UtcNow;
        definition.IsActive = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Hiyerarşik yapı için child tanımlamaları getir
    /// </summary>
    [HttpGet("{id}/children")]
    public async Task<ActionResult<List<SystemDefinition>>> GetChildren(Guid id)
    {
        var children = await _context.SystemDefinitions
            .Where(d => d.ParentId == id)
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        return Ok(children);
    }
}

