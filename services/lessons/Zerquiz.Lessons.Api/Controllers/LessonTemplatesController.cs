using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonTemplatesController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<LessonTemplatesController> _logger;

    public LessonTemplatesController(LessonsDbContext context, ILogger<LessonTemplatesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/LessonTemplates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LessonTemplate>>> GetAll()
    {
        var templates = await _context.LessonTemplates
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        return Ok(templates);
    }

    // GET: api/LessonTemplates/{code}
    [HttpGet("{code}")]
    public async Task<ActionResult<LessonTemplate>> GetByCode(string code)
    {
        var template = await _context.LessonTemplates
            .FirstOrDefaultAsync(t => t.Code == code);

        if (template == null)
            return NotFound();

        return Ok(template);
    }

    // POST: api/LessonTemplates
    [HttpPost]
    [Authorize(Roles = "TenantAdmin,SuperAdmin")]
    public async Task<ActionResult<LessonTemplate>> Create([FromBody] LessonTemplate template)
    {
        template.Id = Guid.NewGuid();
        template.CreatedAt = DateTime.UtcNow;

        _context.LessonTemplates.Add(template);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created lesson template {Code}", template.Code);

        return CreatedAtAction(nameof(GetByCode), new { code = template.Code }, template);
    }

    // PUT: api/LessonTemplates/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LessonTemplate template)
    {
        var existing = await _context.LessonTemplates.FindAsync(id);

        if (existing == null)
            return NotFound();

        // Prevent editing system-reserved templates
        if (existing.IsSystemReserved)
            return BadRequest("Cannot edit system-reserved templates");

        existing.Name = template.Name;
        existing.Description = template.Description;
        existing.Structure = template.Structure;
        existing.DisplayOrder = template.DisplayOrder;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/LessonTemplates/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var template = await _context.LessonTemplates.FindAsync(id);

        if (template == null)
            return NotFound();

        // Prevent deleting system-reserved templates
        if (template.IsSystemReserved)
            return BadRequest("Cannot delete system-reserved templates");

        _context.LessonTemplates.Remove(template);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted lesson template {Id}", id);

        return NoContent();
    }
}

