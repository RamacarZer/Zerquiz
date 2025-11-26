using Microsoft.AspNetCore.Mvc;
using Zerquiz.Shared.Storage;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IStorageService _storageService;
    private readonly ILogger<MediaController> _logger;

    public MediaController(IStorageService storageService, ILogger<MediaController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Upload single file
    /// </summary>
    [HttpPost("upload")]
    [RequestSizeLimit(100_000_000)] // 100 MB
    public async Task<ActionResult> Upload(IFormFile file, [FromQuery] string? folder = null)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _storageService.UploadAsync(stream, file.FileName, file.ContentType, folder);

            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(new
            {
                fileKey = result.FileKey,
                publicUrl = result.PublicUrl,
                fileSize = result.FileSize,
                contentType = result.ContentType
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file: {FileName}", file.FileName);
            return StatusCode(500, "Upload failed");
        }
    }

    /// <summary>
    /// Upload multiple files
    /// </summary>
    [HttpPost("upload-multiple")]
    [RequestSizeLimit(500_000_000)] // 500 MB total
    public async Task<ActionResult> UploadMultiple(List<IFormFile> files, [FromQuery] string? folder = null)
    {
        if (files == null || !files.Any())
            return BadRequest("No files provided");

        var results = new List<object>();

        foreach (var file in files)
        {
            try
            {
                using var stream = file.OpenReadStream();
                var result = await _storageService.UploadAsync(stream, file.FileName, file.ContentType, folder);

                results.Add(new
                {
                    fileName = file.FileName,
                    success = result.Success,
                    fileKey = result.FileKey,
                    publicUrl = result.PublicUrl,
                    fileSize = result.FileSize,
                    error = result.Error
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to upload file: {FileName}", file.FileName);
                results.Add(new
                {
                    fileName = file.FileName,
                    success = false,
                    error = ex.Message
                });
            }
        }

        return Ok(new
        {
            totalFiles = files.Count,
            successCount = results.Count(r => (bool)r.GetType().GetProperty("success")!.GetValue(r)!),
            results
        });
    }

    /// <summary>
    /// Download file
    /// </summary>
    [HttpGet("download/{**fileKey}")]
    public async Task<ActionResult> Download(string fileKey)
    {
        try
        {
            var stream = await _storageService.DownloadAsync(fileKey);
            var metadata = await _storageService.GetMetadataAsync(fileKey);

            return File(stream, metadata?.ContentType ?? "application/octet-stream", metadata?.FileName);
        }
        catch (FileNotFoundException)
        {
            return NotFound("File not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to download file: {FileKey}", fileKey);
            return StatusCode(500, "Download failed");
        }
    }

    /// <summary>
    /// Get presigned URL
    /// </summary>
    [HttpGet("presigned-url/{**fileKey}")]
    public async Task<ActionResult> GetPresignedUrl(string fileKey, [FromQuery] int expiryMinutes = 60)
    {
        try
        {
            var exists = await _storageService.ExistsAsync(fileKey);
            if (!exists)
                return NotFound("File not found");

            var url = await _storageService.GetPresignedUrlAsync(fileKey, expiryMinutes);

            return Ok(new
            {
                fileKey,
                presignedUrl = url,
                expiresIn = expiryMinutes
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get presigned URL: {FileKey}", fileKey);
            return StatusCode(500, "Failed to generate URL");
        }
    }

    /// <summary>
    /// Delete file
    /// </summary>
    [HttpDelete("{**fileKey}")]
    public async Task<ActionResult> Delete(string fileKey)
    {
        try
        {
            var result = await _storageService.DeleteAsync(fileKey);

            if (result)
                return Ok(new { message = "File deleted successfully" });

            return NotFound("File not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {FileKey}", fileKey);
            return StatusCode(500, "Delete failed");
        }
    }

    /// <summary>
    /// Get file metadata
    /// </summary>
    [HttpGet("metadata/{**fileKey}")]
    public async Task<ActionResult> GetMetadata(string fileKey)
    {
        try
        {
            var metadata = await _storageService.GetMetadataAsync(fileKey);

            if (metadata == null)
                return NotFound("File not found");

            return Ok(metadata);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get metadata: {FileKey}", fileKey);
            return StatusCode(500, "Failed to get metadata");
        }
    }

    /// <summary>
    /// List files in folder
    /// </summary>
    [HttpGet("list")]
    public async Task<ActionResult> ListFiles([FromQuery] string? folder = null, [FromQuery] int maxResults = 100)
    {
        try
        {
            var files = await _storageService.ListFilesAsync(folder, maxResults);

            return Ok(new
            {
                folder = folder ?? "root",
                count = files.Count,
                files
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list files in folder: {Folder}", folder);
            return StatusCode(500, "Failed to list files");
        }
    }
}

