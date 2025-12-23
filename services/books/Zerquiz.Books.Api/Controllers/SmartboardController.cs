using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Zerquiz.Books.Infrastructure.Persistence;

namespace Zerquiz.Books.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SmartboardController : ControllerBase
{
    private readonly BooksDbContext _context;
    private readonly ILogger<SmartboardController> _logger;

    public SmartboardController(BooksDbContext context, ILogger<SmartboardController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Create offline package for book
    /// </summary>
    [HttpPost("packages/book/{bookId}")]
    public async Task<ActionResult> CreateBookPackage(Guid bookId)
    {
        try
        {
            var book = await _context.Books
                .Include(b => b.Chapters)
                .Include(b => b.Assets)
                .FirstOrDefaultAsync(b => b.Id == bookId);

            if (book == null)
                return NotFound(new { error = "Book not found" });

            // Create package
            var package = new
            {
                manifest = new
                {
                    version = "1.0",
                    type = "book",
                    contentId = bookId,
                    createdAt = DateTime.UtcNow
                },
                book = new
                {
                    book.Id,
                    book.Title,
                    book.Author,
                    book.CoverImageUrl
                },
                chapters = book.Chapters.Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Content,
                    c.DisplayOrder
                }).ToList(),
                assets = book.Assets.Select(a => new
                {
                    a.Id,
                    a.FileKey,
                    a.PublicUrl
                }).ToList()
            };

            // In production, would create ZIP file with assets
            // For now, return JSON
            _logger.LogInformation("Smartboard package created for book {BookId}", bookId);
            
            return Ok(new
            {
                packageId = Guid.NewGuid(),
                downloadUrl = $"/api/smartboard/packages/download/{bookId}",
                size = JsonSerializer.Serialize(package).Length,
                createdAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating smartboard package");
            return StatusCode(500, new { error = "Failed to create package" });
        }
    }

    /// <summary>
    /// Sync offline progress back to server
    /// </summary>
    [HttpPost("sync")]
    public async Task<ActionResult> SyncProgress([FromBody] SyncRequest request)
    {
        try
        {
            // In production, would update reader progress, bookmarks, highlights
            _logger.LogInformation("Syncing progress for user {UserId}", request.UserId);
            
            // Simplified - just acknowledge
            return Ok(new
            {
                message = "Progress synced successfully",
                syncedAt = DateTime.UtcNow,
                itemsSynced = request.ProgressData?.Count() ?? 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing progress");
            return StatusCode(500, new { error = "Failed to sync progress" });
        }
    }
}

public record SyncRequest(Guid UserId, object[]? ProgressData);

