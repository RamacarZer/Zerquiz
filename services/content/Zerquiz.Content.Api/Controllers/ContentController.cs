using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Content.Domain.Entities;
using Zerquiz.Content.Infrastructure.Persistence;
using Zerquiz.Content.Infrastructure.Services;

namespace Zerquiz.Content.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private readonly ContentDbContext _context;
    private readonly PdfExtractionService _pdfService;
    private readonly ILogger<ContentController> _logger;
    private readonly IWebHostEnvironment _env;
    private const long MaxFileSize = 50 * 1024 * 1024; // 50 MB

    public ContentController(
        ContentDbContext context,
        PdfExtractionService pdfService,
        ILogger<ContentController> logger,
        IWebHostEnvironment env)
    {
        _context = context;
        _pdfService = pdfService;
        _logger = logger;
        _env = env;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<ActionResult> Upload(IFormFile file, [FromForm] string? title, [FromForm] Guid tenantId, [FromForm] Guid userId)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        if (file.Length > MaxFileSize)
            return BadRequest(new { error = $"File size exceeds {MaxFileSize / 1024 / 1024}MB limit" });

        // Validate file type
        var allowedTypes = new[] { "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain" };
        if (!allowedTypes.Contains(file.ContentType))
            return BadRequest(new { error = $"File type {file.ContentType} not supported" });

        try
        {
            // Determine content type
            var contentType = file.ContentType switch
            {
                "application/pdf" => "pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "docx",
                "text/plain" => "txt",
                _ => "unknown"
            };

            // Generate unique file key
            var extension = Path.GetExtension(file.FileName);
            var fileKey = $"{Guid.NewGuid()}{extension}";

            // Save file
            var uploadsPath = Path.Combine(_env.ContentRootPath, "uploads", "content");
            Directory.CreateDirectory(uploadsPath);
            var filePath = Path.Combine(uploadsPath, fileKey);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create content item
            var contentItem = new ContentItem
            {
                TenantId = tenantId,
                UserId = userId,
                Title = title ?? file.FileName,
                ContentType = contentType,
                FileKey = fileKey,
                FileSize = file.Length,
                MimeType = file.ContentType,
                FilePath = filePath,
                OriginalFileName = file.FileName,
                ProcessingStatus = "pending",
                UploadedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ContentItems.Add(contentItem);
            await _context.SaveChangesAsync();

            // Start async processing (PDF extraction)
            _ = Task.Run(async () => await ProcessContentAsync(contentItem.Id));

            return Ok(new
            {
                id = contentItem.Id,
                title = contentItem.Title,
                contentType = contentItem.ContentType,
                fileSize = contentItem.FileSize,
                processingStatus = contentItem.ProcessingStatus,
                uploadedAt = contentItem.UploadedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file");
            return StatusCode(500, new { error = "Upload failed" });
        }
    }

    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] Guid tenantId, [FromQuery] string? contentType, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.ContentItems.Where(c => c.TenantId == tenantId && c.DeletedAt == null);

        if (!string.IsNullOrEmpty(contentType))
            query = query.Where(c => c.ContentType == contentType);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.UploadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.ContentType,
                c.FileSize,
                c.ProcessingStatus,
                c.UploadedAt,
                c.Tags
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var item = await _context.ContentItems
            .Include(c => c.ExtractedMetadata)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (item == null)
            return NotFound(new { error = "Content not found" });

        return Ok(new
        {
            item.Id,
            item.Title,
            item.Description,
            item.ContentType,
            item.FileSize,
            item.ProcessingStatus,
            item.UploadedAt,
            item.Tags,
            metadata = item.ExtractedMetadata == null ? null : new
            {
                item.ExtractedMetadata.PageCount,
                item.ExtractedMetadata.WordCount,
                item.ExtractedMetadata.EstimatedReadingTimeMinutes,
                item.ExtractedMetadata.LanguageDetected,
                textPreview = item.ExtractedMetadata.ExtractedText?.Substring(0, Math.Min(500, item.ExtractedMetadata.ExtractedText.Length))
            }
        });
    }

    [HttpGet("{id}/extract")]
    public async Task<ActionResult> GetExtractedText(Guid id)
    {
        var metadata = await _context.ContentMetadata
            .FirstOrDefaultAsync(m => m.ContentItemId == id);

        if (metadata == null)
            return NotFound(new { error = "Extracted text not found" });

        return Ok(new { extractedText = metadata.ExtractedText });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var item = await _context.ContentItems.FindAsync(id);
        if (item == null)
            return NotFound();

        item.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Content deleted successfully" });
    }

    private async Task ProcessContentAsync(Guid contentItemId)
    {
        try
        {
            var item = await _context.ContentItems.FindAsync(contentItemId);
            if (item == null) return;

            item.ProcessingStatus = "processing";
            await _context.SaveChangesAsync();

            if (item.ContentType == "pdf")
            {
                // Extract text
                var extractedText = await _pdfService.ExtractTextAsync(item.FilePath);
                var pageCount = _pdfService.GetPageCount(item.FilePath);
                var wordCount = extractedText.Split(new[] { ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;

                // Create metadata
                var metadata = new ContentMetadata
                {
                    TenantId = item.TenantId,
                    ContentItemId = item.Id,
                    ExtractedText = extractedText,
                    PageCount = pageCount,
                    WordCount = wordCount,
                    EstimatedReadingTimeMinutes = wordCount / 200, // Average reading speed
                    ExtractedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ContentMetadata.Add(metadata);
            }

            item.ProcessingStatus = "ready";
            item.ProcessedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing content {ContentId}", contentItemId);
            var item = await _context.ContentItems.FindAsync(contentItemId);
            if (item != null)
            {
                item.ProcessingStatus = "failed";
                item.ProcessingError = ex.Message;
                await _context.SaveChangesAsync();
            }
        }
    }
}

