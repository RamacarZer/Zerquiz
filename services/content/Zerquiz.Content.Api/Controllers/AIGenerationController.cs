using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Zerquiz.Content.Domain.Entities;
using Zerquiz.Content.Infrastructure.Persistence;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Content.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIGenerationController : ControllerBase
{
    private readonly ContentDbContext _context;
    private readonly ILogger<AIGenerationController> _logger;
    private readonly IAIProvider _aiProvider;

    public AIGenerationController(
        ContentDbContext context,
        ILogger<AIGenerationController> logger,
        IAIProvider aiProvider)
    {
        _context = context;
        _logger = logger;
        _aiProvider = aiProvider;
    }

    private Guid? GetTenantId()
    {
        var tenantIdStr = User.FindFirst("tenantId")?.Value;
        return string.IsNullOrEmpty(tenantIdStr) ? null : Guid.Parse(tenantIdStr);
    }
    
    private Guid GetUserId()
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value;
        return Guid.Parse(userIdStr ?? Guid.Empty.ToString());
    }

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

            // Get content item
            var contentItem = await _context.ContentItems.FindAsync(job.ContentItemId);
            if (contentItem == null)
            {
                job.Status = "failed";
                job.ErrorMessage = "Content item not found";
                await _context.SaveChangesAsync();
                return;
            }

            // Parse configuration
            var config = JsonSerializer.Deserialize<QuizGenerationConfig>(job.Configuration);
            if (config == null)
            {
                job.Status = "failed";
                job.ErrorMessage = "Invalid configuration";
                await _context.SaveChangesAsync();
                return;
            }

            // Get extracted text
            var extractedText = contentItem.ExtractedText;
            if (string.IsNullOrEmpty(extractedText))
            {
                job.Status = "failed";
                job.ErrorMessage = "No extracted text available";
                await _context.SaveChangesAsync();
                return;
            }

            // Call AI Provider
            var input = new ContentInput
            {
                Content = extractedText,
                Language = config.Language ?? "tr"
            };

            var quizConfig = new QuizConfig
            {
                Count = config.Count,
                QuestionTypeCodes = config.QuestionTypes ?? new List<string> { "multiple_choice_single" },
                Difficulty = config.Difficulty ?? "medium",
                Language = config.Language ?? "tr",
                IncludeExplanations = true
            };

            _logger.LogInformation("Calling AI provider to generate {Count} questions", config.Count);
            var aiResult = await _aiProvider.GenerateQuizAsync(input, quizConfig);

            if (!aiResult.Success || aiResult.Data == null)
            {
                job.Status = "failed";
                job.ErrorMessage = aiResult.Error ?? "AI generation failed";
                await _context.SaveChangesAsync();
                return;
            }

            // Save generated content
            var generated = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TenantId = job.TenantId,
                ContentItemId = job.ContentItemId,
                GenerationType = "quiz",
                GeneratedData = JsonSerializer.Serialize(aiResult.Data),
                Status = "draft",
                ItemCount = aiResult.Data.Questions?.Count ?? 0,
                Difficulty = config.Difficulty,
                Language = config.Language,
                TokensUsed = aiResult.TokensUsed,
                Model = aiResult.Model,
                Provider = aiResult.Provider,
                CreatedBy = job.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GeneratedContents.Add(generated);

            job.Status = "completed";
            job.Progress = 100;
            job.CompletedItems = config.Count;
            job.CompletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully generated {Count} questions for job {JobId}", 
                generated.ItemCount, jobId);
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
        try
        {
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job == null) return;

            job.Status = "processing";
            job.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var contentItem = await _context.ContentItems.FindAsync(job.ContentItemId);
            if (contentItem == null)
            {
                job.Status = "failed";
                job.ErrorMessage = "Content item not found";
                await _context.SaveChangesAsync();
                return;
            }

            var config = JsonSerializer.Deserialize<FlashcardGenerationConfig>(job.Configuration);
            if (config == null || string.IsNullOrEmpty(contentItem.ExtractedText))
            {
                job.Status = "failed";
                job.ErrorMessage = "Invalid configuration or no extracted text";
                await _context.SaveChangesAsync();
                return;
            }

            // Call AI Provider
            var input = new ContentInput
            {
                Content = contentItem.ExtractedText,
                Language = config.Language ?? "tr"
            };

            _logger.LogInformation("Calling AI provider to generate {Count} flashcards", config.Count);
            var aiResult = await _aiProvider.GenerateFlashcardsAsync(input, config.Count);

            if (!aiResult.Success || aiResult.Data == null)
            {
                job.Status = "failed";
                job.ErrorMessage = aiResult.Error ?? "AI generation failed";
                await _context.SaveChangesAsync();
                return;
            }

            // Save generated content
            var generated = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TenantId = job.TenantId,
                ContentItemId = job.ContentItemId,
                GenerationType = "flashcard",
                GeneratedData = JsonSerializer.Serialize(aiResult.Data),
                Status = "draft",
                ItemCount = aiResult.Data.Cards?.Count ?? 0,
                Language = config.Language,
                TokensUsed = aiResult.TokensUsed,
                Model = aiResult.Model,
                Provider = aiResult.Provider,
                CreatedBy = job.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GeneratedContents.Add(generated);

            job.Status = "completed";
            job.Progress = 100;
            job.CompletedItems = config.Count;
            job.CompletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully generated {Count} flashcards for job {JobId}", 
                generated.ItemCount, jobId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing flashcard generation job {JobId}", jobId);
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job != null)
            {
                job.Status = "failed";
                job.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }

    private async Task ProcessSummaryGenerationAsync(Guid jobId)
    {
        try
        {
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job == null) return;

            job.Status = "processing";
            job.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var contentItem = await _context.ContentItems.FindAsync(job.ContentItemId);
            if (contentItem == null || string.IsNullOrEmpty(contentItem.ExtractedText))
            {
                job.Status = "failed";
                job.ErrorMessage = "Content item not found or no extracted text";
                await _context.SaveChangesAsync();
                return;
            }

            var config = JsonSerializer.Deserialize<SummaryGenerationConfig>(job.Configuration);
            var summaryLength = Enum.TryParse<SummaryLength>(config?.Length ?? "medium", true, out var length) 
                ? length 
                : SummaryLength.Medium;

            // Call AI Provider
            var input = new ContentInput
            {
                Content = contentItem.ExtractedText,
                Language = config?.Language ?? "tr"
            };

            _logger.LogInformation("Calling AI provider to generate {Length} summary", summaryLength);
            var aiResult = await _aiProvider.GenerateSummaryAsync(input, summaryLength);

            if (!aiResult.Success || string.IsNullOrEmpty(aiResult.Data))
            {
                job.Status = "failed";
                job.ErrorMessage = aiResult.Error ?? "AI generation failed";
                await _context.SaveChangesAsync();
                return;
            }

            // Save generated content
            var generated = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TenantId = job.TenantId,
                ContentItemId = job.ContentItemId,
                GenerationType = "summary",
                GeneratedData = JsonSerializer.Serialize(new { summary = aiResult.Data }),
                Status = "draft",
                ItemCount = 1,
                Language = config?.Language,
                TokensUsed = aiResult.TokensUsed,
                Model = aiResult.Model,
                Provider = aiResult.Provider,
                CreatedBy = job.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GeneratedContents.Add(generated);

            job.Status = "completed";
            job.Progress = 100;
            job.CompletedItems = 1;
            job.CompletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully generated summary for job {JobId}", jobId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing summary generation job {JobId}", jobId);
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job != null)
            {
                job.Status = "failed";
                job.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }

    private async Task ProcessWorksheetGenerationAsync(Guid jobId)
    {
        try
        {
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job == null) return;

            job.Status = "processing";
            job.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var contentItem = await _context.ContentItems.FindAsync(job.ContentItemId);
            if (contentItem == null || string.IsNullOrEmpty(contentItem.ExtractedText))
            {
                job.Status = "failed";
                job.ErrorMessage = "Content item not found or no extracted text";
                await _context.SaveChangesAsync();
                return;
            }

            var config = JsonSerializer.Deserialize<WorksheetGenerationConfig>(job.Configuration);

            // Call AI Provider
            var input = new ContentInput
            {
                Content = contentItem.ExtractedText,
                Language = config?.Language ?? "tr"
            };

            _logger.LogInformation("Calling AI provider to generate worksheet");
            var aiResult = await _aiProvider.GenerateWorksheetAsync(input);

            if (!aiResult.Success || aiResult.Data == null)
            {
                job.Status = "failed";
                job.ErrorMessage = aiResult.Error ?? "AI generation failed";
                await _context.SaveChangesAsync();
                return;
            }

            // Save generated content
            var generated = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TenantId = job.TenantId,
                ContentItemId = job.ContentItemId,
                GenerationType = "worksheet",
                GeneratedData = JsonSerializer.Serialize(aiResult.Data),
                Status = "draft",
                ItemCount = aiResult.Data.Questions?.Count ?? 0,
                Difficulty = config?.Difficulty,
                Language = config?.Language,
                TokensUsed = aiResult.TokensUsed,
                Model = aiResult.Model,
                Provider = aiResult.Provider,
                CreatedBy = job.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GeneratedContents.Add(generated);

            job.Status = "completed";
            job.Progress = 100;
            job.CompletedItems = config?.Count ?? 1;
            job.CompletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully generated worksheet for job {JobId}", jobId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing worksheet generation job {JobId}", jobId);
            var job = await _context.GenerationJobs.FindAsync(jobId);
            if (job != null)
            {
                job.Status = "failed";
                job.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }
}

// Configuration DTOs for deserialization
internal class QuizGenerationConfig
{
    public List<string>? QuestionTypes { get; set; }
    public string? Difficulty { get; set; }
    public int Count { get; set; }
    public string? Language { get; set; }
}

internal class FlashcardGenerationConfig
{
    public int Count { get; set; }
    public string? Language { get; set; }
}

internal class SummaryGenerationConfig
{
    public string? Length { get; set; }
    public string? Language { get; set; }
}

internal class WorksheetGenerationConfig
{
    public List<string>? QuestionTypes { get; set; }
    public int Count { get; set; }
    public string? Difficulty { get; set; }
    public string? Language { get; set; }
    public bool IncludeAnswerKey { get; set; }
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

