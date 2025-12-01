using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Zerquiz.Content.Infrastructure.Services;

public interface IStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task<Stream> DownloadFileAsync(string fileKey);
    Task<bool> DeleteFileAsync(string fileKey);
    Task<string> GetFileUrlAsync(string fileKey);
    Task<bool> FileExistsAsync(string fileKey);
}

/// <summary>
/// Local filesystem storage implementation (for development)
/// Production: Replace with Azure Blob Storage or AWS S3
/// </summary>
public class LocalFileStorageService : IStorageService
{
    private readonly string _storagePath;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(IConfiguration configuration, ILogger<LocalFileStorageService> logger)
    {
        _storagePath = configuration["Storage:LocalPath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "storage");
        _logger = logger;

        // Ensure storage directory exists
        if (!Directory.Exists(_storagePath))
        {
            Directory.CreateDirectory(_storagePath);
            _logger.LogInformation("Created storage directory at: {Path}", _storagePath);
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        try
        {
            // Generate unique file key
            var fileKey = $"{Guid.NewGuid()}_{SanitizeFileName(fileName)}";
            var filePath = Path.Combine(_storagePath, fileKey);

            // Write file to disk
            using (var fileStreamOut = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                await fileStream.CopyToAsync(fileStreamOut);
            }

            _logger.LogInformation("File uploaded: {FileKey}", fileKey);
            return fileKey;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName}", fileName);
            throw;
        }
    }

    public async Task<Stream> DownloadFileAsync(string fileKey)
    {
        try
        {
            var filePath = Path.Combine(_storagePath, fileKey);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {fileKey}");
            }

            var memoryStream = new MemoryStream();
            using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                await fileStream.CopyToAsync(memoryStream);
            }

            memoryStream.Position = 0;
            return memoryStream;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileKey}", fileKey);
            throw;
        }
    }

    public Task<bool> DeleteFileAsync(string fileKey)
    {
        try
        {
            var filePath = Path.Combine(_storagePath, fileKey);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation("File deleted: {FileKey}", fileKey);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileKey}", fileKey);
            throw;
        }
    }

    public Task<string> GetFileUrlAsync(string fileKey)
    {
        // For local storage, return a local path or API endpoint
        // In production, this would return a signed URL from cloud storage
        var url = $"/api/content/files/{fileKey}";
        return Task.FromResult(url);
    }

    public Task<bool> FileExistsAsync(string fileKey)
    {
        var filePath = Path.Combine(_storagePath, fileKey);
        return Task.FromResult(File.Exists(filePath));
    }

    private string SanitizeFileName(string fileName)
    {
        // Remove invalid characters
        var invalidChars = Path.GetInvalidFileNameChars();
        var sanitized = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
        return sanitized;
    }
}

/// <summary>
/// Azure Blob Storage implementation (for production)
/// Uncomment and configure when deploying to Azure
/// </summary>
/*
public class AzureBlobStorageService : IStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    private readonly ILogger<AzureBlobStorageService> _logger;

    public AzureBlobStorageService(
        IConfiguration configuration,
        ILogger<AzureBlobStorageService> logger)
    {
        var connectionString = configuration.GetValue<string>("Storage:Azure:ConnectionString");
        _containerName = configuration.GetValue<string>("Storage:Azure:ContainerName") ?? "zerquiz-content";
        _blobServiceClient = new BlobServiceClient(connectionString);
        _logger = logger;

        // Ensure container exists
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        containerClient.CreateIfNotExists(PublicAccessType.None);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var fileKey = $"{Guid.NewGuid()}_{fileName}";
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileKey);

        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
        };

        await blobClient.UploadAsync(fileStream, options);
        _logger.LogInformation("File uploaded to Azure Blob: {FileKey}", fileKey);
        return fileKey;
    }

    public async Task<Stream> DownloadFileAsync(string fileKey)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileKey);

        var downloadInfo = await blobClient.DownloadAsync();
        return downloadInfo.Value.Content;
    }

    public async Task<bool> DeleteFileAsync(string fileKey)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileKey);

        var result = await blobClient.DeleteIfExistsAsync();
        return result.Value;
    }

    public async Task<string> GetFileUrlAsync(string fileKey)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileKey);

        // Generate SAS token for temporary access
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = fileKey,
            Resource = "b",
            ExpiresOn = DateTimeOffset.UtcNow.AddHours(1)
        };
        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        var sasToken = blobClient.GenerateSasUri(sasBuilder);
        return sasToken.ToString();
    }

    public async Task<bool> FileExistsAsync(string fileKey)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileKey);

        return await blobClient.ExistsAsync();
    }
}
*/

