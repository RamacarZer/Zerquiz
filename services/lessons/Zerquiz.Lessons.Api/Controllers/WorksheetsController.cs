using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;
using System.Text.Json;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorksheetsController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<WorksheetsController> _logger;
    private readonly IAIProvider _aiProvider;
    private readonly IHttpClientFactory _httpClientFactory;

    public WorksheetsController(
        LessonsDbContext context,
        ILogger<WorksheetsController> logger,
        IAIProvider aiProvider,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _logger = logger;
        _aiProvider = aiProvider;
        _httpClientFactory = httpClientFactory;
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
        try
        {
            var tenantId = GetTenantId();
            var userId = GetUserId();

            // Get content from Content Service if ContentItemId provided
            string? contentText = null;
            if (request.ContentItemId.HasValue)
            {
                var client = _httpClientFactory.CreateClient();
                var contentServiceUrl = "http://localhost:5008"; // From config
                var response = await client.GetAsync($"{contentServiceUrl}/api/Content/{request.ContentItemId.Value}/extract");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(content);
                    contentText = jsonDoc.RootElement.GetProperty("extractedText").GetString();
                }
            }

            // Use provided content or extracted content
            var inputContent = request.ContentText ?? contentText;
            if (string.IsNullOrEmpty(inputContent))
                return BadRequest(new { error = "Content is required (either ContentItemId or ContentText)" });

            // Call AI Provider to generate worksheet
            var input = new ContentInput
            {
                Content = inputContent,
                Language = request.Language ?? "tr"
            };

            _logger.LogInformation("Generating AI worksheet for content item {ContentItemId}", request.ContentItemId);
            var aiResult = await _aiProvider.GenerateWorksheetAsync(input);

            if (!aiResult.Success || aiResult.Data == null)
            {
                _logger.LogError("AI worksheet generation failed: {Error}", aiResult.Error);
                return StatusCode(500, new { error = "AI generation failed", message = aiResult.Error });
            }

            // Save worksheet
            var worksheet = new Worksheet
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                ContentItemId = request.ContentItemId,
                Title = request.Title ?? aiResult.Data.Title ?? "Generated Worksheet",
                Instructions = request.Instructions ?? aiResult.Data.Instructions ?? "Complete the following exercises.",
                Questions = JsonSerializer.Serialize(aiResult.Data.Questions),
                AnswerKey = JsonSerializer.Serialize(aiResult.Data.AnswerKey),
                Format = request.Format ?? "pdf",
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Worksheets.Add(worksheet);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Generated worksheet {Id} for tenant {TenantId}", worksheet.Id, tenantId);

            return CreatedAtAction(nameof(GetById), new { id = worksheet.Id }, new
            {
                worksheet,
                metadata = new
                {
                    tokensUsed = aiResult.TokensUsed,
                    model = aiResult.Model,
                    provider = aiResult.Provider,
                    questionCount = aiResult.Data.Questions?.Count ?? 0
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating worksheet");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
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
    public string? ContentText { get; set; } // Direct content text (alternative to ContentItemId)
    public string Title { get; set; } = "";
    public string? Instructions { get; set; }
    public string? Format { get; set; } // pdf, docx, html
    public int QuestionCount { get; set; } = 10;
    public string? Difficulty { get; set; }
    public string? Language { get; set; }
}




