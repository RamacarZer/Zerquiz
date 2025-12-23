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
[Route("api/books/{bookId}/[controller]")]
public class ChaptersController : ControllerBase
{
    private readonly BooksDbContext _context;
    private readonly ILogger<ChaptersController> _logger;

    public ChaptersController(BooksDbContext context, ILogger<ChaptersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all chapters for a book
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetChapters(Guid bookId)
    {
        try
        {
            var chapters = await _context.BookChapters
                .Where(c => c.BookId == bookId && c.ParentChapterId == null)
                .Include(c => c.SubChapters)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            return Ok(chapters);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching chapters for book {BookId}", bookId);
            return StatusCode(500, new { error = "Failed to fetch chapters" });
        }
    }

    /// <summary>
    /// Get single chapter by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<BookChapter>> GetChapter(Guid bookId, Guid id)
    {
        try
        {
            var chapter = await _context.BookChapters
                .Include(c => c.SubChapters)
                .FirstOrDefaultAsync(c => c.Id == id && c.BookId == bookId);

            if (chapter == null)
                return NotFound(new { error = "Chapter not found" });

            return Ok(chapter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching chapter {ChapterId}", id);
            return StatusCode(500, new { error = "Failed to fetch chapter" });
        }
    }

    /// <summary>
    /// Create a new chapter
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BookChapter>> CreateChapter(Guid bookId, [FromBody] BookChapter chapter)
    {
        try
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
                return NotFound(new { error = "Book not found" });

            chapter.Id = Guid.NewGuid();
            chapter.BookId = bookId;
            chapter.CreatedAt = DateTime.UtcNow;
            chapter.UpdatedAt = DateTime.UtcNow;

            // Auto-set chapter number and display order
            var maxChapterNumber = await _context.BookChapters
                .Where(c => c.BookId == bookId)
                .MaxAsync(c => (int?)c.ChapterNumber) ?? 0;
            chapter.ChapterNumber = maxChapterNumber + 1;

            if (chapter.DisplayOrder == 0)
            {
                var maxOrder = await _context.BookChapters
                    .Where(c => c.BookId == bookId && c.ParentChapterId == chapter.ParentChapterId)
                    .MaxAsync(c => (int?)c.DisplayOrder) ?? 0;
                chapter.DisplayOrder = maxOrder + 1;
            }

            // Calculate word count from content
            if (!string.IsNullOrEmpty(chapter.Content))
            {
                chapter.WordCount = chapter.Content.Split(new[] { ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
                chapter.EstimatedReadingMinutes = (int)Math.Ceiling(chapter.WordCount / 200.0); // Average reading speed
            }

            _context.BookChapters.Add(chapter);
            await _context.SaveChangesAsync();

            // Update book chapter count
            book.ChapterCount = await _context.BookChapters.CountAsync(c => c.BookId == bookId);
            book.WordCount = await _context.BookChapters.Where(c => c.BookId == bookId).SumAsync(c => c.WordCount);
            book.EstimatedReadingMinutes = await _context.BookChapters.Where(c => c.BookId == bookId).SumAsync(c => c.EstimatedReadingMinutes);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Chapter created: {ChapterId} for book {BookId}", chapter.Id, bookId);
            return CreatedAtAction(nameof(GetChapter), new { bookId, id = chapter.Id }, chapter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating chapter for book {BookId}", bookId);
            return StatusCode(500, new { error = "Failed to create chapter" });
        }
    }

    /// <summary>
    /// Update chapter
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<BookChapter>> UpdateChapter(Guid bookId, Guid id, [FromBody] BookChapter chapter)
    {
        try
        {
            var existingChapter = await _context.BookChapters.FindAsync(id);
            if (existingChapter == null || existingChapter.BookId != bookId)
                return NotFound(new { error = "Chapter not found" });

            existingChapter.Title = chapter.Title;
            existingChapter.Subtitle = chapter.Subtitle;
            existingChapter.Content = chapter.Content;
            existingChapter.Summary = chapter.Summary;
            existingChapter.AudioUrl = chapter.AudioUrl;
            existingChapter.AudioDurationSeconds = chapter.AudioDurationSeconds;
            existingChapter.TopicId = chapter.TopicId;
            existingChapter.LearningOutcomeIds = chapter.LearningOutcomeIds;
            existingChapter.Metadata = chapter.Metadata;
            existingChapter.UpdatedAt = DateTime.UtcNow;
            existingChapter.Version++;

            // Recalculate word count
            if (!string.IsNullOrEmpty(existingChapter.Content))
            {
                existingChapter.WordCount = existingChapter.Content.Split(new[] { ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
                existingChapter.EstimatedReadingMinutes = (int)Math.Ceiling(existingChapter.WordCount / 200.0);
            }

            await _context.SaveChangesAsync();

            // Update book totals
            var book = await _context.Books.FindAsync(bookId);
            if (book != null)
            {
                book.WordCount = await _context.BookChapters.Where(c => c.BookId == bookId).SumAsync(c => c.WordCount);
                book.EstimatedReadingMinutes = await _context.BookChapters.Where(c => c.BookId == bookId).SumAsync(c => c.EstimatedReadingMinutes);
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Chapter updated: {ChapterId}", id);
            return Ok(existingChapter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating chapter {ChapterId}", id);
            return StatusCode(500, new { error = "Failed to update chapter" });
        }
    }

    /// <summary>
    /// Delete chapter (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteChapter(Guid bookId, Guid id)
    {
        try
        {
            var chapter = await _context.BookChapters.FindAsync(id);
            if (chapter == null || chapter.BookId != bookId)
                return NotFound(new { error = "Chapter not found" });

            chapter.DeletedAt = DateTime.UtcNow;
            chapter.IsActive = false;
            await _context.SaveChangesAsync();

            // Update book chapter count
            var book = await _context.Books.FindAsync(bookId);
            if (book != null)
            {
                book.ChapterCount = await _context.BookChapters.CountAsync(c => c.BookId == bookId && !c.IsDeleted);
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Chapter soft deleted: {ChapterId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting chapter {ChapterId}", id);
            return StatusCode(500, new { error = "Failed to delete chapter" });
        }
    }

    /// <summary>
    /// Reorder chapters
    /// </summary>
    [HttpPost("reorder")]
    public async Task<ActionResult> ReorderChapters(Guid bookId, [FromBody] ChapterReorderRequest request)
    {
        try
        {
            foreach (var item in request.Orders)
            {
                var chapter = await _context.BookChapters.FindAsync(item.ChapterId);
                if (chapter != null && chapter.BookId == bookId)
                {
                    chapter.DisplayOrder = item.NewOrder;
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Chapters reordered for book {BookId}", bookId);
            return Ok(new { message = "Chapters reordered successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reordering chapters for book {BookId}", bookId);
            return StatusCode(500, new { error = "Failed to reorder chapters" });
        }
    }
}

public record ChapterReorderRequest(ChapterOrderItem[] Orders);
public record ChapterOrderItem(Guid ChapterId, int NewOrder);

