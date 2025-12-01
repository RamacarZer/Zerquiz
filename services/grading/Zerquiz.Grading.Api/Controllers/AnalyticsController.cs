using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Grading.Infrastructure.Persistence;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly GradingDbContext _context;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(GradingDbContext context, ILogger<AnalyticsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";
    private bool IsTeacher() => User.IsInRole("Teacher") || User.IsInRole("TenantAdmin") || User.IsInRole("SuperAdmin");

    // GET: api/Analytics/student/{studentId}/progress
    [HttpGet("student/{studentId}/progress")]
    public async Task<ActionResult<StudentProgress>> GetStudentProgress(string studentId)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        // Students can only view their own progress, teachers can view any student
        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        var progress = await _context.StudentProgress
            .Where(p => p.TenantId == tenantId && p.StudentId == studentId)
            .OrderByDescending(p => p.LastActivityDate)
            .ToListAsync();

        return Ok(progress);
    }

    // GET: api/Analytics/student/{studentId}/learning-style
    [HttpGet("student/{studentId}/learning-style")]
    public async Task<ActionResult<LearningStyleProfile>> GetLearningStyle(string studentId)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        var profile = await _context.LearningStyleProfiles
            .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.StudentId == studentId);

        if (profile == null)
        {
            // Create default profile
            profile = new LearningStyleProfile
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                StudentId = studentId,
                VisualScore = 33,
                AuditoryScore = 33,
                KinestheticScore = 34,
                LastAnalyzedAt = DateTime.UtcNow
            };
        }

        return Ok(profile);
    }

    // POST: api/Analytics/student/{studentId}/analyze-learning-style
    [HttpPost("student/{studentId}/analyze-learning-style")]
    public async Task<ActionResult<LearningStyleProfile>> AnalyzeLearningStyle(string studentId)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        // TODO: Implement AI-powered learning style analysis based on:
        // - Response patterns
        // - Question type preferences
        // - Time spent on different question types
        // - Accuracy by question type

        // For now, create/update with placeholder data
        var existing = await _context.LearningStyleProfiles
            .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.StudentId == studentId);

        if (existing == null)
        {
            existing = new LearningStyleProfile
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                StudentId = studentId,
                VisualScore = 40,
                AuditoryScore = 30,
                KinestheticScore = 30,
                PreferredQuestionTypes = "[\"multiple_choice_single\", \"image_prompt\", \"hotspot\"]",
                LastAnalyzedAt = DateTime.UtcNow
            };
            _context.LearningStyleProfiles.Add(existing);
        }
        else
        {
            existing.LastAnalyzedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Analyzed learning style for student {StudentId}", studentId);

        return Ok(existing);
    }

    // GET: api/Analytics/student/{studentId}/recommendations
    [HttpGet("student/{studentId}/recommendations")]
    public async Task<ActionResult<IEnumerable<StudyRecommendation>>> GetRecommendations(string studentId)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        var recommendations = await _context.StudyRecommendations
            .Where(r => r.TenantId == tenantId && r.StudentId == studentId && r.Status != "completed")
            .OrderByDescending(r => r.Priority)
            .ThenByDescending(r => r.GeneratedAt)
            .ToListAsync();

        return Ok(recommendations);
    }

    // POST: api/Analytics/student/{studentId}/generate-recommendations
    [HttpPost("student/{studentId}/generate-recommendations")]
    public async Task<ActionResult<IEnumerable<StudyRecommendation>>> GenerateRecommendations(string studentId)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        // TODO: Implement AI-powered recommendation engine based on:
        // - StudentProgress (weak areas)
        // - Recent exam scores
        // - Time since last practice
        // - Learning style preferences

        // Create sample recommendations
        var recommendations = new List<StudyRecommendation>
        {
            new StudyRecommendation
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                StudentId = studentId,
                RecommendationType = "topic_focus",
                Priority = "high",
                Title = "Practice more questions on weak topics",
                Description = "Focus on improving mastery in identified weak areas",
                Reasoning = "Your recent performance shows room for improvement in these topics",
                ResourceType = "quiz",
                Status = "pending",
                GeneratedAt = DateTime.UtcNow
            }
        };

        _context.StudyRecommendations.AddRange(recommendations);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Generated {Count} recommendations for student {StudentId}", 
            recommendations.Count, studentId);

        return Ok(recommendations);
    }

    // PUT: api/Analytics/recommendation/{id}/status
    [HttpPut("recommendation/{id}/status")]
    public async Task<IActionResult> UpdateRecommendationStatus(Guid id, [FromBody] string status)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        var recommendation = await _context.StudyRecommendations
            .FirstOrDefaultAsync(r => r.Id == id && r.TenantId == tenantId && r.StudentId == userId);

        if (recommendation == null)
            return NotFound();

        recommendation.Status = status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Analytics/classroom/dashboard
    [HttpGet("classroom/dashboard")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<ActionResult<ClassroomDashboard>> GetClassroomDashboard(
        [FromQuery] string? classId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var tenantId = GetTenantId();
        var teacherId = GetUserId();

        startDate ??= DateTime.UtcNow.AddDays(-30);
        endDate ??= DateTime.UtcNow;

        // TODO: Implement comprehensive dashboard data aggregation
        // - Average scores by class/subject
        // - Participation rates
        // - Top performers
        // - Students needing help
        // - Question difficulty distribution

        var dashboard = new ClassroomDashboard
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            TeacherId = teacherId,
            ClassId = classId,
            StartDate = startDate.Value,
            EndDate = endDate.Value,
            AverageScore = 75.5m,
            ParticipationRate = 85.0m,
            TopPerformers = "[\"student1\", \"student2\", \"student3\"]",
            NeedHelp = "[\"student4\", \"student5\"]",
            QuestionDifficultyDistribution = "{\"easy\": 30, \"medium\": 50, \"hard\": 20}",
            GeneratedAt = DateTime.UtcNow
        };

        return Ok(dashboard);
    }

    // GET: api/Analytics/performance-report/{studentId}
    [HttpGet("performance-report/{studentId}")]
    public async Task<ActionResult<object>> GetPerformanceReport(
        string studentId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var tenantId = GetTenantId();
        var currentUserId = GetUserId();
        var isTeacher = IsTeacher();

        if (!isTeacher && currentUserId != studentId)
            return Forbid();

        startDate ??= DateTime.UtcNow.AddDays(-30);
        endDate ??= DateTime.UtcNow;

        var progress = await _context.StudentProgress
            .Where(p => p.TenantId == tenantId && p.StudentId == studentId)
            .ToListAsync();

        var learningStyle = await _context.LearningStyleProfiles
            .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.StudentId == studentId);

        var recommendations = await _context.StudyRecommendations
            .Where(r => r.TenantId == tenantId && r.StudentId == studentId)
            .OrderByDescending(r => r.GeneratedAt)
            .Take(5)
            .ToListAsync();

        var report = new
        {
            StudentId = studentId,
            DateRange = new { Start = startDate, End = endDate },
            Progress = progress,
            LearningStyle = learningStyle,
            Recommendations = recommendations,
            Summary = new
            {
                TotalQuestions = progress.Sum(p => p.TotalQuestions),
                CorrectAnswers = progress.Sum(p => p.CorrectAnswers),
                AverageMastery = progress.Any() ? progress.Average(p => p.MasteryLevel) : 0,
                CurrentStreak = progress.OrderByDescending(p => p.LastActivityDate).FirstOrDefault()?.StreakDays ?? 0
            }
        };

        return Ok(report);
    }
}
