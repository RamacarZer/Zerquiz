using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Content.Domain.Entities;
using Zerquiz.Content.Infrastructure.Persistence;

namespace Zerquiz.Content.Api.Controllers;

/// <summary>
/// Auto Module Generator - Pipeline orchestration for complete course generation
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ModuleGeneratorController : ControllerBase
{
    private readonly ContentDbContext _context;
    private readonly ILogger<ModuleGeneratorController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public ModuleGeneratorController(
        ContentDbContext context,
        ILogger<ModuleGeneratorController> logger,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Generate complete course module (Quiz + Flashcards + Summary + Lesson Plan)
    /// POST /api/ModuleGenerator/generate-complete-module
    /// </summary>
    [HttpPost("generate-complete-module")]
    public async Task<ActionResult> GenerateCompleteModule([FromBody] CompleteModuleRequest request)
    {
        try
        {
            var tenantId = Guid.Parse(User.FindFirst("tenantId")?.Value ?? Guid.Empty.ToString());
            var userId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());

            // Validate content item
            var contentItem = await _context.ContentItems
                .FirstOrDefaultAsync(c => c.Id == request.ContentItemId && c.ProcessingStatus == "ready");

            if (contentItem == null)
                return NotFound(new { error = "Content item not found or not ready" });

            // Create master job
            var masterJobId = Guid.NewGuid();
            var jobs = new List<GenerationJob>();

            // Create parallel generation jobs
            if (request.GenerateQuiz)
            {
                jobs.Add(CreateJob(masterJobId, tenantId, request.ContentItemId, "quiz", new
                {
                    questionTypes = request.QuizConfig?.QuestionTypes ?? new[] { "multiple_choice_single" },
                    difficulty = request.QuizConfig?.Difficulty ?? "medium",
                    count = request.QuizConfig?.Count ?? 10,
                    language = request.Language
                }, userId));
            }

            if (request.GenerateFlashcards)
            {
                jobs.Add(CreateJob(masterJobId, tenantId, request.ContentItemId, "flashcard", new
                {
                    count = request.FlashcardCount ?? 20,
                    language = request.Language
                }, userId));
            }

            if (request.GenerateSummary)
            {
                jobs.Add(CreateJob(masterJobId, tenantId, request.ContentItemId, "summary", new
                {
                    length = request.SummaryLength ?? "medium",
                    language = request.Language
                }, userId));
            }

            if (request.GenerateWorksheet)
            {
                jobs.Add(CreateJob(masterJobId, tenantId, request.ContentItemId, "worksheet", new
                {
                    questionTypes = request.WorksheetConfig?.QuestionTypes ?? new[] { "short_answer", "fill_blank" },
                    count = request.WorksheetConfig?.Count ?? 10,
                    difficulty = request.WorksheetConfig?.Difficulty ?? "medium",
                    language = request.Language,
                    includeAnswerKey = true
                }, userId));
            }

            // Save all jobs
            _context.GenerationJobs.AddRange(jobs);
            await _context.SaveChangesAsync();

            // Start parallel generation (fire and forget)
            foreach (var job in jobs)
            {
                _ = Task.Run(async () => await TriggerGeneration(job));
            }

            _logger.LogInformation("Started module generation {MasterJobId} with {Count} jobs", 
                masterJobId, jobs.Count);

            return Ok(new
            {
                masterJobId,
                jobs = jobs.Select(j => new
                {
                    j.Id,
                    j.GenerationType,
                    j.Status
                }).ToList(),
                message = "Module generation started. Use polling to check status."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting module generation");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Check module generation status
    /// GET /api/ModuleGenerator/status/{masterJobId}
    /// </summary>
    [HttpGet("status/{masterJobId}")]
    public async Task<ActionResult> GetModuleStatus(Guid masterJobId)
    {
        try
        {
            // Get all jobs with same parent/master ID (we'll use metadata for this)
            var jobs = await _context.GenerationJobs
                .Where(j => j.Configuration.Contains(masterJobId.ToString()))
                .OrderBy(j => j.CreatedAt)
                .Select(j => new
                {
                    j.Id,
                    j.GenerationType,
                    j.Status,
                    j.Progress,
                    j.ErrorMessage,
                    j.CompletedAt
                })
                .ToListAsync();

            if (!jobs.Any())
                return NotFound(new { error = "Module generation jobs not found" });

            var totalJobs = jobs.Count;
            var completedJobs = jobs.Count(j => j.Status == "completed");
            var failedJobs = jobs.Count(j => j.Status == "failed");
            var overallProgress = (completedJobs + failedJobs) * 100 / totalJobs;

            return Ok(new
            {
                masterJobId,
                overallStatus = failedJobs > 0 ? "partial_failure" : 
                               completedJobs == totalJobs ? "completed" : 
                               "processing",
                overallProgress,
                totalJobs,
                completedJobs,
                failedJobs,
                jobs
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching module status");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Get generated module bundle
    /// GET /api/ModuleGenerator/bundle/{masterJobId}
    /// </summary>
    [HttpGet("bundle/{masterJobId}")]
    public async Task<ActionResult> GetModuleBundle(Guid masterJobId)
    {
        try
        {
            var jobs = await _context.GenerationJobs
                .Where(j => j.Configuration.Contains(masterJobId.ToString()) && j.Status == "completed")
                .ToListAsync();

            if (!jobs.Any())
                return NotFound(new { error = "No completed generation jobs found" });

            var bundle = new Dictionary<string, object>();

            foreach (var job in jobs)
            {
                var generatedContent = await _context.GeneratedContents
                    .Where(g => g.ContentItemId == job.ContentItemId && 
                               g.GenerationType == job.GenerationType &&
                               g.CreatedAt >= job.StartedAt)
                    .OrderByDescending(g => g.CreatedAt)
                    .FirstOrDefaultAsync();

                if (generatedContent != null)
                {
                    bundle[job.GenerationType] = new
                    {
                        generatedContent.Id,
                        generatedContent.GeneratedData,
                        generatedContent.ItemCount,
                        generatedContent.Status,
                        generatedContent.CreatedAt
                    };
                }
            }

            return Ok(new
            {
                masterJobId,
                bundleSize = bundle.Count,
                bundle
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching module bundle");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    #region Helper Methods

    private GenerationJob CreateJob(
        Guid masterJobId,
        Guid? tenantId,
        Guid contentItemId,
        string type,
        object config,
        Guid? userId)
    {
        return new GenerationJob
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ContentItemId = contentItemId,
            GenerationType = type,
            Configuration = System.Text.Json.JsonSerializer.Serialize(new
            {
                masterJobId,
                config
            }),
            Status = "pending",
            TotalItems = type == "quiz" ? 10 : type == "flashcard" ? 20 : 1,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task TriggerGeneration(GenerationJob job)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var endpoint = job.GenerationType switch
            {
                "quiz" => "/api/AIGeneration/generate/quiz",
                "flashcard" => "/api/AIGeneration/generate/flashcards",
                "summary" => "/api/AIGeneration/generate/summary",
                "worksheet" => "/api/AIGeneration/generate/worksheet",
                _ => null
            };

            if (endpoint != null)
            {
                await client.PostAsJsonAsync($"http://localhost:5008{endpoint}", new
                {
                    contentItemId = job.ContentItemId,
                    // Parse config and pass relevant fields
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error triggering generation for job {JobId}", job.Id);
        }
    }

    #endregion
}

// Request DTOs
public class CompleteModuleRequest
{
    public Guid ContentItemId { get; set; }
    public bool GenerateQuiz { get; set; } = true;
    public bool GenerateFlashcards { get; set; } = true;
    public bool GenerateSummary { get; set; } = true;
    public bool GenerateWorksheet { get; set; } = false;
    public string Language { get; set; } = "tr";
    
    public QuizConfigOptions? QuizConfig { get; set; }
    public int? FlashcardCount { get; set; }
    public string? SummaryLength { get; set; }
    public WorksheetConfigOptions? WorksheetConfig { get; set; }
}

public class QuizConfigOptions
{
    public List<string>? QuestionTypes { get; set; }
    public string? Difficulty { get; set; }
    public int Count { get; set; } = 10;
}

public class WorksheetConfigOptions
{
    public List<string>? QuestionTypes { get; set; }
    public string? Difficulty { get; set; }
    public int Count { get; set; } = 10;
}

