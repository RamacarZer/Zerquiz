using Microsoft.Extensions.Logging;

namespace Zerquiz.Shared.Storage;

/// <summary>
/// Local filesystem storage implementation (for development)
/// </summary>
public class LocalStorageService : IStorageService
{
    private readonly string _basePath;
    private readonly string _baseUrl;
    private readonly ILogger<LocalStorageService> _logger;

    public LocalStorageService(string basePath, string baseUrl, ILogger<LocalStorageService> logger)
    {
        _basePath = basePath;
        _baseUrl = baseUrl;
        _logger = logger;

        // Ensure base directory exists
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
        }
    }

    public async Task<StorageResult> UploadAsync(Stream fileStream, string fileName, string contentType, string? folder = null)
    {
        try
        {
            var fileKey = GenerateFileKey(fileName, folder);
            var fullPath = Path.Combine(_basePath, fileKey);

            // Ensure directory exists
            var directory = Path.GetDirectoryName(fullPath);
            if (directory != null && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Write file
            using var fileStreamOut = File.Create(fullPath);
            await fileStream.CopyToAsync(fileStreamOut);

            var fileInfo = new FileInfo(fullPath);

            return new StorageResult
            {
                Success = true,
                FileKey = fileKey,
                PublicUrl = $"{_baseUrl}/{fileKey.Replace("\\", "/")}",
                FileSize = fileInfo.Length,
                ContentType = contentType
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file: {FileName}", fileName);
            return new StorageResult
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public Task<Stream> DownloadAsync(string fileKey)
    {
        var fullPath = Path.Combine(_basePath, fileKey);

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"File not found: {fileKey}");
        }

        return Task.FromResult<Stream>(File.OpenRead(fullPath));
    }

    public Task<bool> DeleteAsync(string fileKey)
    {
        try
        {
            var fullPath = Path.Combine(_basePath, fileKey);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {FileKey}", fileKey);
            return Task.FromResult(false);
        }
    }

    public Task<string> GetPresignedUrlAsync(string fileKey, int expiryMinutes = 60)
    {
        // For local storage, return direct URL (no expiry)
        var url = $"{_baseUrl}/{fileKey.Replace("\\", "/")}";
        return Task.FromResult(url);
    }

    public Task<bool> ExistsAsync(string fileKey)
    {
        var fullPath = Path.Combine(_basePath, fileKey);
        return Task.FromResult(File.Exists(fullPath));
    }

    public Task<StorageMetadata?> GetMetadataAsync(string fileKey)
    {
        var fullPath = Path.Combine(_basePath, fileKey);

        if (!File.Exists(fullPath))
        {
            return Task.FromResult<StorageMetadata?>(null);
        }

        var fileInfo = new FileInfo(fullPath);

        return Task.FromResult<StorageMetadata?>(new StorageMetadata
        {
            FileKey = fileKey,
            FileName = Path.GetFileName(fileKey),
            FileSize = fileInfo.Length,
            ContentType = GetContentType(fileKey),
            LastModified = fileInfo.LastWriteTimeUtc
        });
    }

    public async Task<StorageResult> CopyAsync(string sourceKey, string destinationKey)
    {
        try
        {
            var sourcePath = Path.Combine(_basePath, sourceKey);
            var destPath = Path.Combine(_basePath, destinationKey);

            if (!File.Exists(sourcePath))
            {
                return new StorageResult { Success = false, Error = "Source file not found" };
            }

            // Ensure destination directory exists
            var directory = Path.GetDirectoryName(destPath);
            if (directory != null && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.Copy(sourcePath, destPath, overwrite: true);

            var fileInfo = new FileInfo(destPath);

            return new StorageResult
            {
                Success = true,
                FileKey = destinationKey,
                PublicUrl = $"{_baseUrl}/{destinationKey.Replace("\\", "/")}",
                FileSize = fileInfo.Length
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to copy file from {Source} to {Dest}", sourceKey, destinationKey);
            return new StorageResult { Success = false, Error = ex.Message };
        }
    }

    public Task<List<StorageMetadata>> ListFilesAsync(string? folder = null, int maxResults = 100)
    {
        var searchPath = string.IsNullOrEmpty(folder) ? _basePath : Path.Combine(_basePath, folder);

        if (!Directory.Exists(searchPath))
        {
            return Task.FromResult(new List<StorageMetadata>());
        }

        var files = Directory.GetFiles(searchPath, "*", SearchOption.TopDirectoryOnly)
            .Take(maxResults)
            .Select(fullPath =>
            {
                var fileInfo = new FileInfo(fullPath);
                var relativePath = Path.GetRelativePath(_basePath, fullPath);

                return new StorageMetadata
                {
                    FileKey = relativePath,
                    FileName = fileInfo.Name,
                    FileSize = fileInfo.Length,
                    ContentType = GetContentType(fileInfo.Name),
                    LastModified = fileInfo.LastWriteTimeUtc
                };
            })
            .ToList();

        return Task.FromResult(files);
    }

    private string GenerateFileKey(string fileName, string? folder)
    {
        var sanitizedName = Path.GetFileName(fileName);
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
        var uniqueId = Guid.NewGuid().ToString()[..8];
        var extension = Path.GetExtension(sanitizedName);
        var nameWithoutExt = Path.GetFileNameWithoutExtension(sanitizedName);

        var newFileName = $"{nameWithoutExt}_{timestamp}_{uniqueId}{extension}";

        if (string.IsNullOrEmpty(folder))
        {
            return newFileName;
        }

        return Path.Combine(folder, newFileName);
    }

    private string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".pdf" => "application/pdf",
            ".mp3" => "audio/mpeg",
            ".mp4" => "video/mp4",
            ".txt" => "text/plain",
            ".json" => "application/json",
            ".xml" => "application/xml",
            _ => "application/octet-stream"
        };
    }
}

