using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly QuestionsDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<AssetsController> _logger;
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public AssetsController(
        QuestionsDbContext context,
        IWebHostEnvironment env,
        ILogger<AssetsController> logger)
    {
        _context = context;
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Upload asset file (image, audio, video)
    /// </summary>
    [HttpPost("upload")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<ActionResult<AssetUploadResponse>> UploadAsset(
        [FromForm] IFormFile file,
        [FromForm] Guid? questionVersionId = null,
        [FromForm] string? assetType = null)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file uploaded" });
            }

            if (file.Length > MaxFileSize)
            {
                return BadRequest(new { error = $"File size exceeds maximum limit of {MaxFileSize / 1024 / 1024}MB" });
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp", "audio/mpeg", "audio/wav", "video/mp4" };
            if (!allowedTypes.Contains(file.ContentType))
            {
                return BadRequest(new { error = $"File type {file.ContentType} is not allowed" });
            }

            // Generate unique filename
            var extension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            // Create uploads directory
            var uploadsPath = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads", "assets");
            Directory.CreateDirectory(uploadsPath);

            // Save file
            var filePath = Path.Combine(uploadsPath, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Determine asset type
            var detectedType = assetType ?? DetectAssetType(file.ContentType);

            // Create asset record
            var asset = new QuestionAsset
            {
                Id = Guid.NewGuid(),
                TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), // TODO: Get from tenant context
                QuestionVersionId = questionVersionId ?? Guid.Empty,
                Type = detectedType,
                FileName = file.FileName,
                StorageKey = uniqueFileName,
                Url = $"/uploads/assets/{uniqueFileName}",
                FileSize = file.Length,
                MimeType = file.ContentType,
                Position = "unassigned",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = Guid.Empty // TODO: Get from auth context
            };

            _context.QuestionAssets.Add(asset);
            await _context.SaveChangesAsync();

            return Ok(new AssetUploadResponse
            {
                Id = asset.Id,
                Url = asset.Url,
                FileName = asset.FileName,
                FileSize = asset.FileSize,
                MimeType = asset.MimeType,
                Type = asset.Type
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading asset");
            return StatusCode(500, new { error = "Failed to upload asset" });
        }
    }

    /// <summary>
    /// Get asset by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionAsset>> GetAsset(Guid id)
    {
        var asset = await _context.QuestionAssets.FindAsync(id);
        if (asset == null)
        {
            return NotFound();
        }
        return Ok(asset);
    }

    /// <summary>
    /// Get all assets for a question version
    /// </summary>
    [HttpGet("by-version/{questionVersionId}")]
    public async Task<ActionResult<List<QuestionAsset>>> GetAssetsByVersion(Guid questionVersionId)
    {
        var assets = await _context.QuestionAssets
            .Where(a => a.QuestionVersionId == questionVersionId)
            .OrderBy(a => a.Position)
            .ToListAsync();

        return Ok(assets);
    }

    /// <summary>
    /// Delete asset
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsset(Guid id)
    {
        var asset = await _context.QuestionAssets.FindAsync(id);
        if (asset == null)
        {
            return NotFound();
        }

        // Delete physical file
        try
        {
            var filePath = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads", "assets", asset.StorageKey);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete physical file for asset {AssetId}", id);
        }

        // Delete database record
        _context.QuestionAssets.Remove(asset);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string DetectAssetType(string mimeType)
    {
        return mimeType switch
        {
            var t when t.StartsWith("image/") => "image",
            var t when t.StartsWith("audio/") => "audio",
            var t when t.StartsWith("video/") => "video",
            _ => "other"
        };
    }
}

public class AssetUploadResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? MimeType { get; set; }
    public string Type { get; set; } = string.Empty;
}

