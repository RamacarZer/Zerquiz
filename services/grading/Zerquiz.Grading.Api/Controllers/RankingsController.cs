using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Grading.Infrastructure.Persistence;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RankingsController : ControllerBase
{
    private readonly GradingDbContext _context;

    public RankingsController(GradingDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get rankings for an exam
    /// </summary>
    [HttpGet("exam/{examId}")]
    public async Task<ActionResult> GetExamRankings(
        Guid examId,
        [FromQuery] string? scope = "global",
        [FromQuery] int limit = 100)
    {
        var rankings = await _context.Rankings
            .Where(r => r.ExamId == examId && r.Scope == scope)
            .OrderBy(r => r.Rank)
            .Take(limit)
            .ToListAsync();

        return Ok(rankings);
    }

    /// <summary>
    /// Get user's rankings
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult> GetUserRankings(Guid userId)
    {
        var rankings = await _context.Rankings
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.ExamDate)
            .ToListAsync();

        return Ok(rankings);
    }

    /// <summary>
    /// Calculate rankings for an exam (simplified)
    /// </summary>
    [HttpPost("calculate/{examId}")]
    public async Task<ActionResult> CalculateRankings(Guid examId, [FromQuery] string scope = "global")
    {
        var results = await _context.ExamResults
            .Where(r => r.ExamId == examId && r.Status == "completed")
            .OrderByDescending(r => r.Score)
            .ToListAsync();

        if (!results.Any())
            return BadRequest("No completed results found");

        var rankings = new List<Ranking>();
        int rank = 1;

        foreach (var result in results)
        {
            var ranking = new Ranking
            {
                ExamId = examId,
                UserId = result.UserId,
                ExamResultId = result.Id,
                Scope = scope,
                Rank = rank,
                Score = result.Score,
                SuccessRate = result.SuccessRate,
                TotalParticipants = results.Count,
                Percentile = ((decimal)(results.Count - rank + 1) / results.Count) * 100,
                ExamDate = result.CompletedAt ?? DateTime.UtcNow,
                CalculatedAt = DateTime.UtcNow
            };
            rankings.Add(ranking);
            rank++;
        }

        _context.Rankings.AddRange(rankings);
        await _context.SaveChangesAsync();

        return Ok(new { examId, rankingsCreated = rankings.Count });
    }
}

