using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Zerquiz.Content.Domain.Entities;
using Zerquiz.Content.Infrastructure.Persistence;

namespace Zerquiz.Content.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIGenerationController : ControllerBase
{
    private readonly ContentDbContext _context;
    private readonly ILogger<AIGenerationController> _logger;

    public AIGenerationController(ContentDbContext context, ILogger<AIGenerationController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";

    // POST: api/AIGeneration/generate/quiz
    [HttpPost("generate/quiz")]
    public async Task<ActionResult<GenerationJob>> GenerateQuiz([FromBody] QuizGenerationRequest request)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        // Validate content item
        var contentItem = await _context.ContentItems
            .FirstOrDefaultAsync(c => c.Id == request.ContentItemId && c.TenantId == tenantId && c.ProcessingStatus == "ready");

        if (contentItem == null)
            return NotFound("Content item not found or not ready");

        // Create generation job
        var job = new GenerationJob
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = request.ContentItemId,
            GenerationType = "quiz",
            Configuration = JsonSerializer.Serialize(new
            {
                questionTypes = request.QuestionTypes,
                difficulty = request.Difficulty,
                count = request.Count,
                language = request.Language
            }),
            Status = "pending",
            TotalItems = request.Count,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.GenerationJobs.Add(job);
        await _context.SaveChangesAsync();

        // Start async generation
        _ = Task.Run(async () => await ProcessQuizGenerationAsync(job.Id));

        _logger.LogInformation("Created quiz generation job {JobId} for content {ContentId}", job.Id, request.ContentItemId);

        return Ok(new
        {
            jobId = job.Id,
            status = job.Status,
            message = "Quiz generation started"
        });
    }

    // POST: api/AIGeneration/generate/flashcards
    [HttpPost("generate/flashcards")]
    public async Task<ActionResult<GenerationJob>> GenerateFlashcards([FromBody] FlashcardGenerationRequest request)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        var contentItem = await _context.ContentItems
            .FirstOrDefaultAsync(c => c.Id == request.ContentItemId && c.TenantId == tenantId && c.ProcessingStatus == "ready");

        if (contentItem == null)
            return NotFound("Content item not found or not ready");

        var job = new GenerationJob
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = request.ContentItemId,
            GenerationType = "flashcard",
            Configuration = JsonSerializer.Serialize(new
            {
                count = request.Count,
                language = request.Language
            }),
            Status = "pending",
            TotalItems = request.Count,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.GenerationJobs.Add(job);
        await _context.SaveChangesAsync();

        _ = Task.Run(async () => await ProcessFlashcardGenerationAsync(job.Id));

        _logger.LogInformation("Created flashcard generation job {JobId}", job.Id);

        return Ok(new
        {
            jobId = job.Id,
            status = job.Status,
            message = "Flashcard generation started"
        });
    }

    // POST: api/AIGeneration/generate/summary
    [HttpPost("generate/summary")]
    public async Task<ActionResult<GenerationJob>> GenerateSummary([FromBody] SummaryGenerationRequest request)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        var contentItem = await _context.ContentItems
            .FirstOrDefaultAsync(c => c.Id == request.ContentItemId && c.TenantId == tenantId && c.ProcessingStatus == "ready");

        if (contentItem == null)
            return NotFound("Content item not found or not ready");

        var job = new GenerationJob
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = request.ContentItemId,
            GenerationType = "summary",
            Configuration = JsonSerializer.Serialize(new
            {
                length = request.Length,
                language = request.Language
            }),
            Status = "pending",
            TotalItems = 1,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.GenerationJobs.Add(job);
        await _context.SaveChangesAsync();

        _ = Task.Run(async () => await ProcessSummaryGenerationAsync(job.Id));

        _logger.LogInformation("Created summary generation job {JobId}", job.Id);

        return Ok(new
        {
            jobId = job.Id,
            status = job.Status,
            message = "Summary generation started"
        });
    }

    // POST: api/AIGeneration/generate/worksheet
    [HttpPost("generate/worksheet")]
    public async Task<ActionResult<GenerationJob>> GenerateWorksheet([FromBody] WorksheetGenerationRequest request)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        var contentItem = await _context.ContentItems
            .FirstOrDefaultAsync(c => c.Id == request.ContentItemId && c.TenantId == tenantId && c.ProcessingStatus == "ready");

        if (contentItem == null)
            return NotFound("Content item not found or not ready");

        var job = new GenerationJob
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = request.ContentItemId,
            GenerationType = "worksheet",
            Configuration = JsonSerializer.Serialize(new
            {
                questionTypes = request.QuestionTypes,
                count = request.Count,
                difficulty = request.Difficulty,
                language = request.Language,
                includeAnswerKey = request.IncludeAnswerKey
            }),
            Status = "pending",
            TotalItems = request.Count,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.GenerationJobs.Add(job);
        await _context.SaveChangesAsync();

        _ = Task.Run(async () => await ProcessWorksheetGenerationAsync(job.Id));

        _logger.LogInformation("Created worksheet generation job {JobId}", job.Id);

        return Ok(new
        {
            jobId = job.Id,
            status = job.Status,
            message = "Worksheet generation started"
        });
    }

    // GET: api/AIGeneration/job/{id}/status
    [HttpGet("job/{id}/status")]
    public async Task<ActionResult> GetJobStatus(Guid id)
    {
        var tenantId = GetTenantId();

        var job = await _context.GenerationJobs
            .FirstOrDefaultAsync(j => j.Id == id && j.TenantId == tenantId);

        if (job == null)
            return NotFound();

        return Ok(new
        {
            job.Id,
            job.Status,
            job.Progress,
            job.CompletedItems,
            job.TotalItems,
            job.ErrorMessage,
            job.StartedAt,
            job.CompletedAt
        });
    }

    // GET: api/AIGeneration/content/{contentId}/generated
    [HttpGet("content/{contentId}/generated")]
    public async Task<ActionResult> GetGeneratedContent(Guid contentId, [FromQuery] string? type = null)
    {
        var tenantId = GetTenantId();

        var query = _context.GeneratedContents
            .Where(g => g.ContentItemId == contentId && g.TenantId == tenantId);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(g => g.GenerationType == type);

        var generated = await query
            .OrderByDescending(g => g.CreatedAt)
            .Select(g => new
            {
                g.Id,
                g.GenerationType,
                g.QuestionTypeCode,
                g.Status,
                g.ItemCount,
                g.Difficulty,
                g.Language,
                g.CreatedAt,
                g.PublishedAt,
                preview = g.GeneratedData.Substring(0, Math.Min(200, g.GeneratedData.Length))
            })
            .ToListAsync();

        return Ok(generated);
    }

    // POST: api/AIGeneration/{id}/approve
    [HttpPost("{id}/approve")]
    public async Task<ActionResult> ApproveGenerated(Guid id)
    {
        var tenantId = GetTenantId();

        var generated = await _context.GeneratedContents
            .FirstOrDefaultAsync(g => g.Id == id && g.TenantId == tenantId);

        if (generated == null)
            return NotFound();

        generated.Status = "published";
        generated.PublishedAt = DateTime.UtcNow;
        generated.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Approved generated content {Id}", id);

        return Ok(new { message = "Content approved and published" });
    }

    // Private helper methods for async processing
    private async Task ProcessQuizGenerationAsync(Guid jobId)
    {
        try
        {
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job == null) return;

            job.Status = "processing";
            job.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // TODO: Integrate with AI Provider Service
            // For now, create placeholder generated content
            var config = JsonSerializer.Deserialize<Dictionary<string, object>>(job.Configuration);

            // Simulate AI generation
            await Task.Delay(3000);

            var generated = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TenantId = job.TenantId,
                ContentItemId = job.ContentItemId,
                GenerationType = "quiz",
                GeneratedData = JsonSerializer.Serialize(new
                {
                    questions = new[]
                    {
                        new
                        {
                            stem = "Sample AI-generated question",
                            options = new[] { "A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4" },
                            correct_answer = "A",
                            explanation = "AI explanation",
                            difficulty = "medium",
                            points = 5
                        }
                    }
                }),
                Status = "draft",
                ItemCount = 1,
                CreatedBy = job.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GeneratedContents.Add(generated);

            job.Status = "completed";
            job.Progress = 100;
            job.CompletedItems = job.TotalItems;
            job.CompletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing quiz generation job {JobId}", jobId);
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job != null)
            {
                job.Status = "failed";
                job.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }

    private async Task ProcessFlashcardGenerationAsync(Guid jobId)
    {
        // Similar to ProcessQuizGenerationAsync
        // TODO: Implement AI integration
        await Task.CompletedTask;
    }

    private async Task ProcessSummaryGenerationAsync(Guid jobId)
    {
        // TODO: Implement AI integration
        await Task.CompletedTask;
    }

    private async Task ProcessWorksheetGenerationAsync(Guid jobId)
    {
        // TODO: Implement AI integration
        await Task.CompletedTask;
    }
}

// Request DTOs
public class QuizGenerationRequest
{
    public Guid ContentItemId { get; set; }
    public List<string> QuestionTypes { get; set; } = new();
    public string Difficulty { get; set; } = "medium";
    public int Count { get; set; } = 10;
    public string Language { get; set; } = "tr";
}

public class FlashcardGenerationRequest
{
    public Guid ContentItemId { get; set; }
    public int Count { get; set; } = 20;
    public string Language { get; set; } = "tr";
}

public class SummaryGenerationRequest
{
    public Guid ContentItemId { get; set; }
    public string Length { get; set; } = "medium"; // short, medium, long
    public string Language { get; set; } = "tr";
}

public class WorksheetGenerationRequest
{
    public Guid ContentItemId { get; set; }
    public List<string> QuestionTypes { get; set; } = new();
    public int Count { get; set; } = 10;
    public string Difficulty { get; set; } = "medium";
    public string Language { get; set; } = "tr";
    public bool IncludeAnswerKey { get; set; } = true;
}

