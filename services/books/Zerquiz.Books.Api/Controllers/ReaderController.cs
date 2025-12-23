using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Books.Domain.Entities;
using Zerquiz.Books.Infrastructure.Persistence;

namespace Zerquiz.Books.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReaderController : ControllerBase
{
    private readonly BooksDbContext _context;
    private readonly ILogger<ReaderController> _logger;

    public ReaderController(BooksDbContext context, ILogger<ReaderController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get user's reading progress for a book
    /// </summary>
    [HttpGet("progress")]
    public async Task<ActionResult> GetProgress([FromQuery] Guid userId, [FromQuery] Guid bookId)
    {
        try
        {
            var progress = await _context.ReaderProgress
                .FirstOrDefaultAsync(rp => rp.UserId == userId && rp.BookId == bookId);

            if (progress == null)
            {
                return Ok(new { message = "No progress found", progress = (object?)null });
            }

            return Ok(progress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching reading progress");
            return StatusCode(500, new { error = "Failed to fetch progress" });
        }
    }

    /// <summary>
    /// Update reading progress
    /// </summary>
    [HttpPost("progress")]
    public async Task<ActionResult> UpdateProgress([FromBody] ReaderProgress progress)
    {
        try
        {
            var existing = await _context.ReaderProgress
                .FirstOrDefaultAsync(rp => rp.UserId == progress.UserId && rp.BookId == progress.BookId);

            if (existing == null)
            {
                progress.Id = Guid.NewGuid();
                progress.CreatedAt = DateTime.UtcNow;
                progress.UpdatedAt = DateTime.UtcNow;
                progress.StartedReadingAt = DateTime.UtcNow;
                progress.SessionCount = 1;
                _context.ReaderProgress.Add(progress);
            }
            else
            {
                existing.CurrentChapterId = progress.CurrentChapterId;
                existing.CurrentPage = progress.CurrentPage;
                existing.CurrentPosition = progress.CurrentPosition;
                existing.CompletionPercentage = progress.CompletionPercentage;
                existing.ChaptersRead = progress.ChaptersRead;
                existing.PagesRead = progress.PagesRead;
                existing.TotalReadingTimeMinutes = progress.TotalReadingTimeMinutes;
                existing.LastReadAt = DateTime.UtcNow;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.SessionCount++;
                
                if (progress.CompletionPercentage >= 100 && !existing.FinishedAt.HasValue)
                {
                    existing.FinishedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Progress updated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating reading progress");
            return StatusCode(500, new { error = "Failed to update progress" });
        }
    }

    /// <summary>
    /// Get user bookmarks
    /// </summary>
    [HttpGet("bookmarks")]
    public async Task<ActionResult> GetBookmarks([FromQuery] Guid userId, [FromQuery] Guid? bookId)
    {
        try
        {
            var query = _context.Bookmarks.Where(b => b.UserId == userId);

            if (bookId.HasValue)
                query = query.Where(b => b.BookId == bookId.Value);

            var bookmarks = await query
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookmarks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching bookmarks");
            return StatusCode(500, new { error = "Failed to fetch bookmarks" });
        }
    }

    /// <summary>
    /// Create bookmark
    /// </summary>
    [HttpPost("bookmarks")]
    public async Task<ActionResult> CreateBookmark([FromBody] Bookmark bookmark)
    {
        try
        {
            bookmark.Id = Guid.NewGuid();
            bookmark.CreatedAt = DateTime.UtcNow;
            bookmark.UpdatedAt = DateTime.UtcNow;

            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Bookmark created for user {UserId}", bookmark.UserId);
            return CreatedAtAction(nameof(GetBookmarks), new { userId = bookmark.UserId, bookId = bookmark.BookId }, bookmark);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bookmark");
            return StatusCode(500, new { error = "Failed to create bookmark" });
        }
    }

    /// <summary>
    /// Delete bookmark
    /// </summary>
    [HttpDelete("bookmarks/{id}")]
    public async Task<ActionResult> DeleteBookmark(Guid id)
    {
        try
        {
            var bookmark = await _context.Bookmarks.FindAsync(id);
            if (bookmark == null)
                return NotFound();

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bookmark");
            return StatusCode(500, new { error = "Failed to delete bookmark" });
        }
    }

    /// <summary>
    /// Get user highlights
    /// </summary>
    [HttpGet("highlights")]
    public async Task<ActionResult> GetHighlights([FromQuery] Guid userId, [FromQuery] Guid? bookId)
    {
        try
        {
            var query = _context.Highlights.Where(h => h.UserId == userId);

            if (bookId.HasValue)
                query = query.Where(h => h.BookId == bookId.Value);

            var highlights = await query
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();

            return Ok(highlights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching highlights");
            return StatusCode(500, new { error = "Failed to fetch highlights" });
        }
    }

    /// <summary>
    /// Create highlight
    /// </summary>
    [HttpPost("highlights")]
    public async Task<ActionResult> CreateHighlight([FromBody] Highlight highlight)
    {
        try
        {
            highlight.Id = Guid.NewGuid();
            highlight.CreatedAt = DateTime.UtcNow;
            highlight.UpdatedAt = DateTime.UtcNow;

            _context.Highlights.Add(highlight);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Highlight created for user {UserId}", highlight.UserId);
            return CreatedAtAction(nameof(GetHighlights), new { userId = highlight.UserId, bookId = highlight.BookId }, highlight);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating highlight");
            return StatusCode(500, new { error = "Failed to create highlight" });
        }
    }

    /// <summary>
    /// Update highlight (note or color)
    /// </summary>
    [HttpPut("highlights/{id}")]
    public async Task<ActionResult> UpdateHighlight(Guid id, [FromBody] HighlightUpdate update)
    {
        try
        {
            var highlight = await _context.Highlights.FindAsync(id);
            if (highlight == null)
                return NotFound();

            if (!string.IsNullOrEmpty(update.Note))
                highlight.Note = update.Note;
            if (!string.IsNullOrEmpty(update.Color))
                highlight.Color = update.Color;

            highlight.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(highlight);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating highlight");
            return StatusCode(500, new { error = "Failed to update highlight" });
        }
    }

    /// <summary>
    /// Delete highlight
    /// </summary>
    [HttpDelete("highlights/{id}")]
    public async Task<ActionResult> DeleteHighlight(Guid id)
    {
        try
        {
            var highlight = await _context.Highlights.FindAsync(id);
            if (highlight == null)
                return NotFound();

            _context.Highlights.Remove(highlight);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting highlight");
            return StatusCode(500, new { error = "Failed to delete highlight" });
        }
    }
}

public record HighlightUpdate(string? Note, string? Color);

