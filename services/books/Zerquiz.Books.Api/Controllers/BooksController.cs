using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Books.Domain.Entities;
using Zerquiz.Books.Infrastructure.Persistence;

namespace Zerquiz.Books.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksDbContext _context;
    private readonly ILogger<BooksController> _logger;

    public BooksController(BooksDbContext context, ILogger<BooksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all books with pagination and filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<object>> GetBooks(
        [FromQuery] Guid? tenantId,
        [FromQuery] string? bookType,
        [FromQuery] string? workflowStatus,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.Books.AsQueryable();

            if (tenantId.HasValue)
                query = query.Where(b => b.TenantId == tenantId.Value);

            if (!string.IsNullOrEmpty(bookType))
                query = query.Where(b => b.BookType == bookType);

            if (!string.IsNullOrEmpty(workflowStatus))
                query = query.Where(b => b.WorkflowStatus == workflowStatus);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(b => b.Title.Contains(search) || 
                                        (b.Author != null && b.Author.Contains(search)) ||
                                        (b.ISBN != null && b.ISBN.Contains(search)));

            var totalCount = await query.CountAsync();
            var books = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.Id,
                    b.TenantId,
                    b.Title,
                    b.Subtitle,
                    b.Author,
                    b.BookType,
                    b.Category,
                    b.Grade,
                    b.ISBN,
                    b.CoverImageUrl,
                    b.WorkflowStatus,
                    b.ChapterCount,
                    b.PageCount,
                    b.PublishedAt,
                    b.CreatedAt,
                    b.UpdatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                data = books,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching books");
            return StatusCode(500, new { error = "Failed to fetch books" });
        }
    }

    /// <summary>
    /// Get book by ID with chapters
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(Guid id)
    {
        try
        {
            var book = await _context.Books
                .Include(b => b.Chapters.OrderBy(c => c.DisplayOrder))
                .Include(b => b.Assets)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound(new { error = "Book not found" });

            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching book {BookId}", id);
            return StatusCode(500, new { error = "Failed to fetch book" });
        }
    }

    /// <summary>
    /// Create a new book
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook([FromBody] Book book)
    {
        try
        {
            book.Id = Guid.NewGuid();
            book.CreatedAt = DateTime.UtcNow;
            book.UpdatedAt = DateTime.UtcNow;
            book.WorkflowStatus = "draft";
            book.ChapterCount = 0;
            book.PageCount = 0;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Book created: {BookId} - {Title}", book.Id, book.Title);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating book");
            return StatusCode(500, new { error = "Failed to create book" });
        }
    }

    /// <summary>
    /// Update book
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Book>> UpdateBook(Guid id, [FromBody] Book book)
    {
        try
        {
            var existingBook = await _context.Books.FindAsync(id);
            if (existingBook == null)
                return NotFound(new { error = "Book not found" });

            // Update fields
            existingBook.Title = book.Title;
            existingBook.Subtitle = book.Subtitle;
            existingBook.Description = book.Description;
            existingBook.BookType = book.BookType;
            existingBook.Category = book.Category;
            existingBook.Grade = book.Grade;
            existingBook.Language = book.Language;
            existingBook.ISBN = book.ISBN;
            existingBook.Publisher = book.Publisher;
            existingBook.Author = book.Author;
            existingBook.Authors = book.Authors;
            existingBook.PublishedDate = book.PublishedDate;
            existingBook.Edition = book.Edition;
            existingBook.CoverImageUrl = book.CoverImageUrl;
            existingBook.ThumbnailUrl = book.ThumbnailUrl;
            existingBook.CurriculumId = book.CurriculumId;
            existingBook.SubjectId = book.SubjectId;
            existingBook.Metadata = book.Metadata;
            existingBook.UpdatedAt = DateTime.UtcNow;
            existingBook.Version++;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Book updated: {BookId}", id);
            return Ok(existingBook);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating book {BookId}", id);
            return StatusCode(500, new { error = "Failed to update book" });
        }
    }

    /// <summary>
    /// Delete book (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBook(Guid id)
    {
        try
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { error = "Book not found" });

            book.DeletedAt = DateTime.UtcNow;
            book.IsActive = false;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Book soft deleted: {BookId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting book {BookId}", id);
            return StatusCode(500, new { error = "Failed to delete book" });
        }
    }

    /// <summary>
    /// Update book workflow status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult> UpdateWorkflowStatus(Guid id, [FromBody] WorkflowStatusUpdate update)
    {
        try
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { error = "Book not found" });

            book.WorkflowStatus = update.Status;
            if (update.Status == "published" && !book.PublishedAt.HasValue)
            {
                book.PublishedAt = DateTime.UtcNow;
            }
            if (!string.IsNullOrEmpty(update.ReviewNotes))
            {
                book.ReviewNotes = update.ReviewNotes;
                book.ReviewedAt = DateTime.UtcNow;
                book.ReviewedBy = update.ReviewedBy;
            }
            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Book status updated: {BookId} -> {Status}", id, update.Status);
            return Ok(new { message = "Status updated", status = book.WorkflowStatus });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating book status {BookId}", id);
            return StatusCode(500, new { error = "Failed to update status" });
        }
    }

    /// <summary>
    /// Get book statistics
    /// </summary>
    [HttpGet("{id}/stats")]
    public async Task<ActionResult<object>> GetBookStats(Guid id)
    {
        try
        {
            var book = await _context.Books
                .Include(b => b.Chapters)
                .Include(b => b.ReaderProgress)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound(new { error = "Book not found" });

            var stats = new
            {
                ChapterCount = book.Chapters.Count,
                TotalWords = book.Chapters.Sum(c => c.WordCount),
                TotalPages = book.Chapters.Sum(c => c.PageCount),
                EstimatedReadingMinutes = book.Chapters.Sum(c => c.EstimatedReadingMinutes),
                ReaderCount = book.ReaderProgress.Count,
                AverageCompletion = book.ReaderProgress.Any() 
                    ? book.ReaderProgress.Average(rp => rp.CompletionPercentage) 
                    : 0,
                FinishedCount = book.ReaderProgress.Count(rp => rp.FinishedAt.HasValue)
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching book stats {BookId}", id);
            return StatusCode(500, new { error = "Failed to fetch stats" });
        }
    }
}

public record WorkflowStatusUpdate(string Status, string? ReviewNotes, Guid? ReviewedBy);

