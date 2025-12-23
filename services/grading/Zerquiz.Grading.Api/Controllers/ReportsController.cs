using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Grading.Infrastructure.Persistence;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly GradingDbContext _context;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(GradingDbContext context, ILogger<ReportsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get student progress report
    /// </summary>
    [HttpGet("student-progress")]
    public async Task<ActionResult> GetStudentProgress([FromQuery] Guid userId, [FromQuery] Guid? curriculumId)
    {
        try
        {
            // Query student exam results
            var results = await _context.ExamResults
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CompletedAt)
                .Select(r => new
                {
                    r.ExamId,
                    r.Score,
                    r.MaxScore,
                    r.CompletedAt,
                    Percentage = (decimal)r.Score / r.MaxScore * 100
                })
                .ToListAsync();

            var report = new
            {
                userId,
                totalExamsTaken = results.Count,
                averageScore = results.Any() ? results.Average(r => r.Percentage) : 0,
                highestScore = results.Any() ? results.Max(r => r.Percentage) : 0,
                lowestScore = results.Any() ? results.Min(r => r.Percentage) : 0,
                recentExams = results.Take(10),
                progressTrend = CalculateTrend(results.Select(r => r.Percentage).ToList())
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating student progress report");
            return StatusCode(500, new { error = "Failed to generate report" });
        }
    }

    /// <summary>
    /// Get parent dashboard data
    /// </summary>
    [HttpGet("parent-dashboard")]
    public async Task<ActionResult> GetParentDashboard([FromQuery] Guid parentId, [FromQuery] Guid studentId)
    {
        try
        {
            // Simplified - in production would verify parent-student relationship
            var results = await _context.ExamResults
                .Where(r => r.UserId == studentId)
                .OrderByDescending(r => r.CompletedAt)
                .Take(20)
                .ToListAsync();

            var dashboard = new
            {
                studentId,
                weeklyProgress = new
                {
                    examsCompleted = results.Count(r => r.CompletedAt > DateTime.UtcNow.AddDays(-7)),
                    averageScore = results.Where(r => r.CompletedAt > DateTime.UtcNow.AddDays(-7))
                        .Select(r => (decimal)r.Score / r.MaxScore * 100).DefaultIfEmpty(0).Average(),
                    timeSpentMinutes = results.Where(r => r.CompletedAt > DateTime.UtcNow.AddDays(-7))
                        .Sum(r => (r.CompletedAt - r.StartedAt).TotalMinutes)
                },
                weakTopics = new[] { "Topic A", "Topic B" }, // Placeholder - would analyze question statistics
                recommendations = new[] { "Practice more on Topic A", "Review Topic B concepts" }
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating parent dashboard");
            return StatusCode(500, new { error = "Failed to generate dashboard" });
        }
    }

    /// <summary>
    /// Get school analytics
    /// </summary>
    [HttpGet("school-analytics")]
    public async Task<ActionResult> GetSchoolAnalytics([FromQuery] Guid tenantId)
    {
        try
        {
            // Aggregate statistics for all students in tenant
            var analytics = new
            {
                tenantId,
                totalStudents = 0, // Would query from identity service
                totalExams = await _context.ExamResults.CountAsync(),
                averageScore = 75.5m, // Placeholder calculation
                classComparison = new[] 
                {
                    new { className = "Class A", averageScore = 78.2m, studentCount = 25 },
                    new { className = "Class B", averageScore = 72.8m, studentCount = 23 }
                },
                curriculumCompletion = new { completed = 65, total = 100, percentage = 65m },
                topPerformers = new[] { "Student 1", "Student 2", "Student 3" }
            };

            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating school analytics");
            return StatusCode(500, new { error = "Failed to generate analytics" });
        }
    }

    /// <summary>
    /// Get publisher dashboard
    /// </summary>
    [HttpGet("publisher")]
    public async Task<ActionResult> GetPublisherDashboard([FromQuery] Guid publisherId)
    {
        try
        {
            var dashboard = new
            {
                publisherId,
                contentUsage = new
                {
                    totalViews = 0, // Would aggregate from books/content service
                    uniqueUsers = 0,
                    totalReadingTime = 0
                },
                popularBooks = new[] 
                {
                    new { title = "Book 1", views = 1250, readers = 85 },
                    new { title = "Book 2", views = 980, readers = 72 }
                },
                revenue = new
                {
                    thisMonth = 0m,
                    lastMonth = 0m,
                    trend = "up"
                }
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating publisher dashboard");
            return StatusCode(500, new { error = "Failed to generate dashboard" });
        }
    }

    private string CalculateTrend(List<decimal> scores)
    {
        if (scores.Count < 2) return "stable";
        var recent = scores.Take(5).Average();
        var older = scores.Skip(5).Take(5).DefaultIfEmpty(recent).Average();
        return recent > older ? "improving" : recent < older ? "declining" : "stable";
    }
}

