using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionSolutionsController : ControllerBase
{
    private readonly QuestionsDbContext _context;

    public QuestionSolutionsController(QuestionsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all solutions for a question
    /// </summary>
    [HttpGet("question/{questionId}")]
    public async Task<ActionResult> GetByQuestionId(Guid questionId)
    {
        var solutions = await _context.QuestionSolutions
            .Where(s => s.QuestionId == questionId && s.IsVisible)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new
            {
                s.Id,
                s.SolutionType,
                s.Title,
                s.Description,
                s.TextContent,
                s.MediaUrl,
                s.MediaMimeType,
                s.MediaDurationSeconds,
                s.AuthorName,
                s.IsOfficial,
                s.ViewCount,
                s.LikeCount,
                s.DislikeCount,
                s.DisplayOrder,
                s.CreatedAt
            })
            .ToListAsync();

        return Ok(solutions);
    }

    /// <summary>
    /// Get solution by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var solution = await _context.QuestionSolutions.FindAsync(id);
        if (solution == null)
            return NotFound();

        // Increment view count
        solution.ViewCount++;
        await _context.SaveChangesAsync();

        return Ok(solution);
    }

    /// <summary>
    /// Create new solution
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateSolutionRequest request)
    {
        var solution = new QuestionSolution
        {
            QuestionId = request.QuestionId,
            SolutionType = request.SolutionType,
            Title = request.Title,
            Description = request.Description,
            TextContent = request.TextContent,
            MediaUrl = request.MediaUrl,
            MediaStorageKey = request.MediaStorageKey,
            MediaMimeType = request.MediaMimeType,
            MediaFileSize = request.MediaFileSize,
            MediaDurationSeconds = request.MediaDurationSeconds,
            AuthorName = request.AuthorName,
            IsOfficial = request.IsOfficial ?? true,
            DisplayOrder = request.DisplayOrder ?? 1,
            Transcript = request.Transcript
        };

        _context.QuestionSolutions.Add(solution);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = solution.Id }, solution);
    }

    /// <summary>
    /// Update solution
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateSolutionRequest request)
    {
        var solution = await _context.QuestionSolutions.FindAsync(id);
        if (solution == null)
            return NotFound();

        solution.Title = request.Title ?? solution.Title;
        solution.Description = request.Description ?? solution.Description;
        solution.TextContent = request.TextContent ?? solution.TextContent;
        solution.MediaUrl = request.MediaUrl ?? solution.MediaUrl;
        solution.DisplayOrder = request.DisplayOrder ?? solution.DisplayOrder;
        solution.IsVisible = request.IsVisible ?? solution.IsVisible;
        solution.Transcript = request.Transcript ?? solution.Transcript;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Delete solution
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var solution = await _context.QuestionSolutions.FindAsync(id);
        if (solution == null)
            return NotFound();

        _context.QuestionSolutions.Remove(solution);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Like solution
    /// </summary>
    [HttpPost("{id}/like")]
    public async Task<ActionResult> Like(Guid id)
    {
        var solution = await _context.QuestionSolutions.FindAsync(id);
        if (solution == null)
            return NotFound();

        solution.LikeCount++;
        await _context.SaveChangesAsync();

        return Ok(new { likeCount = solution.LikeCount });
    }

    /// <summary>
    /// Dislike solution
    /// </summary>
    [HttpPost("{id}/dislike")]
    public async Task<ActionResult> Dislike(Guid id)
    {
        var solution = await _context.QuestionSolutions.FindAsync(id);
        if (solution == null)
            return NotFound();

        solution.DislikeCount++;
        await _context.SaveChangesAsync();

        return Ok(new { dislikeCount = solution.DislikeCount });
    }

    /// <summary>
    /// Get popular solutions (by views and likes)
    /// </summary>
    [HttpGet("popular")]
    public async Task<ActionResult> GetPopular([FromQuery] int limit = 10)
    {
        var solutions = await _context.QuestionSolutions
            .Where(s => s.IsVisible && s.IsOfficial)
            .OrderByDescending(s => s.LikeCount)
            .ThenByDescending(s => s.ViewCount)
            .Take(limit)
            .Select(s => new
            {
                s.Id,
                s.QuestionId,
                s.Title,
                s.SolutionType,
                s.ViewCount,
                s.LikeCount,
                s.AuthorName,
                s.CreatedAt
            })
            .ToListAsync();

        return Ok(solutions);
    }

    /// <summary>
    /// Get solutions by type
    /// </summary>
    [HttpGet("by-type/{solutionType}")]
    public async Task<ActionResult> GetByType(string solutionType)
    {
        var solutions = await _context.QuestionSolutions
            .Where(s => s.SolutionType == solutionType && s.IsVisible)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id,
                s.QuestionId,
                s.Title,
                s.MediaUrl,
                s.MediaDurationSeconds,
                s.ViewCount,
                s.LikeCount,
                s.CreatedAt
            })
            .ToListAsync();

        return Ok(solutions);
    }

    /// <summary>
    /// Reorder solutions
    /// </summary>
    [HttpPost("reorder")]
    public async Task<ActionResult> Reorder([FromBody] ReorderRequest request)
    {
        foreach (var item in request.Items)
        {
            var solution = await _context.QuestionSolutions.FindAsync(item.SolutionId);
            if (solution != null)
            {
                solution.DisplayOrder = item.DisplayOrder;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Solutions reordered" });
    }
}

public record CreateSolutionRequest(
    Guid QuestionId,
    string SolutionType,
    string? Title,
    string? Description,
    string? TextContent,
    string? MediaUrl,
    string? MediaStorageKey,
    string? MediaMimeType,
    long? MediaFileSize,
    int? MediaDurationSeconds,
    string? AuthorName,
    bool? IsOfficial,
    int? DisplayOrder,
    string? Transcript
);

public record UpdateSolutionRequest(
    string? Title,
    string? Description,
    string? TextContent,
    string? MediaUrl,
    int? DisplayOrder,
    bool? IsVisible,
    string? Transcript
);

public record ReorderRequest(List<ReorderItem> Items);
public record ReorderItem(Guid SolutionId, int DisplayOrder);

