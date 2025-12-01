using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorksheetsController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<WorksheetsController> _logger;

    public WorksheetsController(LessonsDbContext context, ILogger<WorksheetsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";

    // GET: api/Worksheets/list
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<Worksheet>>> GetAll()
    {
        var tenantId = GetTenantId();
        
        var worksheets = await _context.Worksheets
            .Where(w => w.TenantId == tenantId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(worksheets);
    }

    // GET: api/Worksheets/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Worksheet>> GetById(Guid id)
    {
        var tenantId = GetTenantId();
        
        var worksheet = await _context.Worksheets
            .FirstOrDefaultAsync(w => w.Id == id && w.TenantId == tenantId);

        if (worksheet == null)
            return NotFound();

        return Ok(worksheet);
    }

    // POST: api/Worksheets/generate
    [HttpPost("generate")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<ActionResult<Worksheet>> Generate([FromBody] GenerateWorksheetRequest request)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        // TODO: Integrate with AI Provider Service to generate worksheet
        // For now, create a placeholder

        var worksheet = new Worksheet
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = request.ContentItemId,
            Title = request.Title,
            Instructions = request.Instructions ?? "Complete the following exercises.",
            Questions = "[]", // Will be populated by AI generation
            AnswerKey = "[]",
            Format = request.Format ?? "pdf",
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Worksheets.Add(worksheet);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Generated worksheet {Id} for tenant {TenantId}", worksheet.Id, tenantId);

        return CreatedAtAction(nameof(GetById), new { id = worksheet.Id }, worksheet);
    }

    // GET: api/Worksheets/{id}/download
    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(Guid id)
    {
        var tenantId = GetTenantId();
        
        var worksheet = await _context.Worksheets
            .FirstOrDefaultAsync(w => w.Id == id && w.TenantId == tenantId);

        if (worksheet == null)
            return NotFound();

        // TODO: Implement actual file generation based on format
        // For now, return JSON representation
        return Ok(new
        {
            worksheet.Id,
            worksheet.Title,
            worksheet.Instructions,
            worksheet.Questions,
            worksheet.AnswerKey,
            worksheet.Format
        });
    }

    // DELETE: api/Worksheets/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        
        var worksheet = await _context.Worksheets
            .FirstOrDefaultAsync(w => w.Id == id && w.TenantId == tenantId && w.CreatedBy == userId);

        if (worksheet == null)
            return NotFound();

        _context.Worksheets.Remove(worksheet);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted worksheet {Id} for tenant {TenantId}", id, tenantId);

        return NoContent();
    }
}

public class GenerateWorksheetRequest
{
    public Guid? ContentItemId { get; set; }
    public string Title { get; set; } = "";
    public string? Instructions { get; set; }
    public string? Format { get; set; } // pdf, docx, html
    public int QuestionCount { get; set; } = 10;
    public string? Difficulty { get; set; }
}

