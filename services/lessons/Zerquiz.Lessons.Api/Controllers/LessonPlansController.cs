using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonPlansController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<LessonPlansController> _logger;
    private readonly IAIProvider _aiProvider;

    public LessonPlansController(
        LessonsDbContext context,
        ILogger<LessonPlansController> logger,
        IAIProvider aiProvider)
    {
        _context = context;
        _logger = logger;
        _aiProvider = aiProvider;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";

    // GET: api/LessonPlans/list
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<LessonPlan>>> GetAll([FromQuery] string? status = null)
    {
        var tenantId = GetTenantId();
        var query = _context.LessonPlans
            .Include(lp => lp.Activities)
            .Where(lp => lp.TenantId == tenantId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(lp => lp.Status == status);
        }

        var lessonPlans = await query
            .OrderByDescending(lp => lp.CreatedAt)
            .ToListAsync();

        return Ok(lessonPlans);
    }

    // GET: api/LessonPlans/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<LessonPlan>> GetById(Guid id)
    {
        var tenantId = GetTenantId();
        var lessonPlan = await _context.LessonPlans
            .Include(lp => lp.Activities)
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.TenantId == tenantId);

        if (lessonPlan == null)
            return NotFound();

        return Ok(lessonPlan);
    }

    // POST: api/LessonPlans/create
    [HttpPost("create")]
    public async Task<ActionResult<LessonPlan>> Create([FromBody] LessonPlan lessonPlan)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        lessonPlan.Id = Guid.NewGuid();
        lessonPlan.TenantId = tenantId;
        lessonPlan.CreatedBy = userId;
        lessonPlan.CreatedAt = DateTime.UtcNow;
        lessonPlan.UpdatedAt = DateTime.UtcNow;

        // Create activities
        if (lessonPlan.Activities != null)
        {
            foreach (var activity in lessonPlan.Activities)
            {
                activity.Id = Guid.NewGuid();
                activity.LessonPlanId = lessonPlan.Id;
            }
        }

        _context.LessonPlans.Add(lessonPlan);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created lesson plan {Id} for tenant {TenantId}", lessonPlan.Id, tenantId);

        return CreatedAtAction(nameof(GetById), new { id = lessonPlan.Id }, lessonPlan);
    }

    // PUT: api/LessonPlans/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LessonPlan lessonPlan)
    {
        var tenantId = GetTenantId();
        var existing = await _context.LessonPlans
            .Include(lp => lp.Activities)
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.TenantId == tenantId);

        if (existing == null)
            return NotFound();

        // Update properties
        existing.Title = lessonPlan.Title;
        existing.Subject = lessonPlan.Subject;
        existing.Grade = lessonPlan.Grade;
        existing.Duration = lessonPlan.Duration;
        existing.Objectives = lessonPlan.Objectives;
        existing.MaterialsNeeded = lessonPlan.MaterialsNeeded;
        existing.Status = lessonPlan.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        // Update activities
        if (lessonPlan.Activities != null)
        {
            // Remove old activities
            _context.LessonActivities.RemoveRange(existing.Activities);

            // Add new activities
            foreach (var activity in lessonPlan.Activities)
            {
                activity.Id = Guid.NewGuid();
                activity.LessonPlanId = existing.Id;
                _context.LessonActivities.Add(activity);
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/LessonPlans/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var tenantId = GetTenantId();
        var lessonPlan = await _context.LessonPlans
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.TenantId == tenantId);

        if (lessonPlan == null)
            return NotFound();

        _context.LessonPlans.Remove(lessonPlan);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted lesson plan {Id} for tenant {TenantId}", id, tenantId);

        return NoContent();
    }

    // POST: api/LessonPlans/duplicate/{id}
    [HttpPost("duplicate/{id}")]
    public async Task<ActionResult<LessonPlan>> Duplicate(Guid id)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        
        var original = await _context.LessonPlans
            .Include(lp => lp.Activities)
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.TenantId == tenantId);

        if (original == null)
            return NotFound();

        var duplicate = new LessonPlan
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            CreatedBy = userId,
            Title = $"{original.Title} (Copy)",
            Subject = original.Subject,
            Grade = original.Grade,
            Duration = original.Duration,
            LessonTemplateId = original.LessonTemplateId,
            Objectives = original.Objectives,
            MaterialsNeeded = original.MaterialsNeeded,
            Status = "draft",
            GenerationSource = original.GenerationSource,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Activities = original.Activities.Select(a => new LessonActivity
            {
                Id = Guid.NewGuid(),
                ActivityType = a.ActivityType,
                Title = a.Title,
                Description = a.Description,
                Duration = a.Duration,
                Instructions = a.Instructions,
                DisplayOrder = a.DisplayOrder
            }).ToList()
        };

        _context.LessonPlans.Add(duplicate);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = duplicate.Id }, duplicate);
    }

    // POST: api/LessonPlans/generate-ai
    [HttpPost("generate-ai")]
    public async Task<ActionResult<LessonPlan>> GenerateWithAI([FromBody] AILessonPlanRequest request)
    {
        try
        {
            var tenantId = GetTenantId();
            var userId = GetUserId();

            // Validate request
            if (string.IsNullOrEmpty(request.Topic))
                return BadRequest(new { error = "Topic is required" });

            // Call AI Provider
            var input = new LessonPlanInput
            {
                Topic = request.Topic,
                Subject = request.Subject ?? "General",
                Grade = request.Grade ?? "9",
                Duration = request.Duration ?? 45,
                TemplateCode = request.TemplateCode ?? "direct_instruction",
                Language = request.Language ?? "tr"
            };

            _logger.LogInformation("Generating AI lesson plan for topic: {Topic}", request.Topic);
            var aiResult = await _aiProvider.GenerateLessonPlanAsync(input);

            if (!aiResult.Success || aiResult.Data == null)
            {
                _logger.LogError("AI lesson plan generation failed: {Error}", aiResult.Error);
                return StatusCode(500, new { error = "AI generation failed", message = aiResult.Error });
            }

            // Create lesson plan from AI result
            var lessonPlan = new LessonPlan
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                CreatedBy = userId,
                Title = aiResult.Data.Title ?? request.Topic,
                Subject = request.Subject ?? "General",
                Grade = request.Grade ?? "9",
                Duration = request.Duration ?? 45,
                LessonTemplateId = null, // Can be fetched from template code
                Objectives = aiResult.Data.Objectives != null 
                    ? string.Join("; ", aiResult.Data.Objectives) 
                    : "",
                MaterialsNeeded = aiResult.Data.MaterialsNeeded != null 
                    ? string.Join("; ", aiResult.Data.MaterialsNeeded) 
                    : "",
                Status = "draft",
                GenerationSource = "ai",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Create activities from AI result
            if (aiResult.Data.Activities != null)
            {
                lessonPlan.Activities = aiResult.Data.Activities.Select((a, index) => new LessonActivity
                {
                    Id = Guid.NewGuid(),
                    LessonPlanId = lessonPlan.Id,
                    ActivityType = a.Type ?? "activity",
                    Title = a.Title ?? $"Activity {index + 1}",
                    Description = a.Description ?? "",
                    Duration = a.Duration ?? 10,
                    Instructions = a.Instructions ?? "",
                    DisplayOrder = index + 1
                }).ToList();
            }

            _context.LessonPlans.Add(lessonPlan);
            await _context.SaveChangesAsync();

            _logger.LogInformation("AI lesson plan created {Id} for tenant {TenantId}", lessonPlan.Id, tenantId);

            return CreatedAtAction(nameof(GetById), new { id = lessonPlan.Id }, new
            {
                lessonPlan,
                metadata = new
                {
                    tokensUsed = aiResult.TokensUsed,
                    model = aiResult.Model,
                    provider = aiResult.Provider
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating AI lesson plan");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }
}

public class AILessonPlanRequest
{
    public string Topic { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string? Grade { get; set; }
    public int? Duration { get; set; }
    public string? TemplateCode { get; set; }
    public string? Language { get; set; }
}
    public string? Subject { get; set; }
    public string? Grade { get; set; }
    public int Duration { get; set; }
    public string? TemplateCode { get; set; }
    public List<string>? LearningObjectives { get; set; }
}
