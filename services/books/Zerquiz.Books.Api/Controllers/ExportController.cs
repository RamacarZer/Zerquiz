using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Books.Domain.Entities;
using Zerquiz.Books.Infrastructure.Persistence;

namespace Zerquiz.Books.Api.Controllers;

[ApiController]
[Route("api/books/{bookId}/[controller]")]
public class ExportController : ControllerBase
{
    private readonly BooksDbContext _context;
    private readonly ILogger<ExportController> _logger;

    public ExportController(BooksDbContext context, ILogger<ExportController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all exports for a book
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetExports(Guid bookId)
    {
        try
        {
            var exports = await _context.BookExports
                .Where(e => e.BookId == bookId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return Ok(exports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching exports for book {BookId}", bookId);
            return StatusCode(500, new { error = "Failed to fetch exports" });
        }
    }

    /// <summary>
    /// Start book export
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> StartExport(Guid bookId, [FromBody] ExportRequest request)
    {
        try
        {
            var book = await _context.Books
                .Include(b => b.Chapters)
                .FirstOrDefaultAsync(b => b.Id == bookId);

            if (book == null)
                return NotFound(new { error = "Book not found" });

            var export = new BookExport
            {
                Id = Guid.NewGuid(),
                BookId = bookId,
                Format = request.Format,
                FormatVersion = GetFormatVersion(request.Format),
                ExportStatus = "pending",
                ExportSettings = System.Text.Json.JsonSerializer.Serialize(request.Settings),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                StartedAt = DateTime.UtcNow
            };

            _context.BookExports.Add(export);
            await _context.SaveChangesAsync();

            // Start background export job (simplified - in production use Hangfire)
            _ = Task.Run(async () => await ProcessExportAsync(export.Id));

            _logger.LogInformation("Export started: {ExportId} for book {BookId}", export.Id, bookId);
            return CreatedAtAction(nameof(GetExportStatus), new { bookId, id = export.Id }, export);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting export for book {BookId}", bookId);
            return StatusCode(500, new { error = "Failed to start export" });
        }
    }

    /// <summary>
    /// Get export status
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetExportStatus(Guid bookId, Guid id)
    {
        try
        {
            var export = await _context.BookExports
                .FirstOrDefaultAsync(e => e.Id == id && e.BookId == bookId);

            if (export == null)
                return NotFound(new { error = "Export not found" });

            return Ok(export);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching export status {ExportId}", id);
            return StatusCode(500, new { error = "Failed to fetch export status" });
        }
    }

    /// <summary>
    /// Download export file
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<ActionResult> DownloadExport(Guid bookId, Guid id)
    {
        try
        {
            var export = await _context.BookExports
                .FirstOrDefaultAsync(e => e.Id == id && e.BookId == bookId);

            if (export == null)
                return NotFound(new { error = "Export not found" });

            if (export.ExportStatus != "completed")
                return BadRequest(new { error = "Export not completed yet" });

            if (string.IsNullOrEmpty(export.FileKey))
                return NotFound(new { error = "Export file not found" });

            // In production, use proper storage service
            var filePath = Path.Combine("exports", export.FileKey);
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { error = "Export file not found on disk" });

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var contentType = export.Format switch
            {
                "epub" => "application/epub+zip",
                "pdf" => "application/pdf",
                "html" => "text/html",
                _ => "application/octet-stream"
            };

            var book = await _context.Books.FindAsync(bookId);
            var fileName = $"{book?.Title ?? "book"}.{export.Format}";

            export.DownloadCount++;
            export.LastDownloadedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return File(fileBytes, contentType, fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading export {ExportId}", id);
            return StatusCode(500, new { error = "Failed to download export" });
        }
    }

    private async Task ProcessExportAsync(Guid exportId)
    {
        try
        {
            var export = await _context.BookExports
                .Include(e => e.Book)
                    .ThenInclude(b => b.Chapters)
                .FirstOrDefaultAsync(e => e.Id == exportId);

            if (export == null) return;

            export.ExportStatus = "processing";
            await _context.SaveChangesAsync();

            // Simulate export processing (in production, use proper export libraries)
            await Task.Delay(3000); // Simulated processing time

            // Generate file (placeholder - real implementation would use VersOne.Epub, QuestPDF, etc.)
            var exportPath = Path.Combine("exports");
            Directory.CreateDirectory(exportPath);
            
            var fileKey = $"{export.Id}.{export.Format}";
            var filePath = Path.Combine(exportPath, fileKey);

            // Placeholder: write simple text file
            var content = $"Book: {export.Book.Title}\n\nChapters:\n";
            foreach (var chapter in export.Book.Chapters.OrderBy(c => c.DisplayOrder))
            {
                content += $"\n{chapter.Title}\n{chapter.Content}\n";
            }
            await System.IO.File.WriteAllTextAsync(filePath, content);

            export.ExportStatus = "completed";
            export.CompletedAt = DateTime.UtcNow;
            export.FileKey = fileKey;
            export.FileSize = new FileInfo(filePath).Length;
            export.IsValid = true;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Export completed: {ExportId}", exportId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing export {ExportId}", exportId);
            var export = await _context.BookExports.FindAsync(exportId);
            if (export != null)
            {
                export.ExportStatus = "failed";
                export.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }

    private string GetFormatVersion(string format)
    {
        return format switch
        {
            "epub" => "3.0",
            "pdf" => "1.7",
            "html" => "5.0",
            _ => "1.0"
        };
    }
}

public record ExportRequest(string Format, ExportSettings? Settings);
public record ExportSettings(string? PageSize = "A4", int FontSize = 12, bool IncludeImages = true, bool IncludeTOC = true);

