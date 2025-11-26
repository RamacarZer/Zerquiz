namespace Zerquiz.Shared.Storage;

/// <summary>
/// Storage service interface for S3/Blob operations
/// </summary>
public interface IStorageService
{
    /// <summary>
    /// Upload file to storage
    /// </summary>
    Task<StorageResult> UploadAsync(Stream fileStream, string fileName, string contentType, string? folder = null);

    /// <summary>
    /// Download file from storage
    /// </summary>
    Task<Stream> DownloadAsync(string fileKey);

    /// <summary>
    /// Delete file from storage
    /// </summary>
    Task<bool> DeleteAsync(string fileKey);

    /// <summary>
    /// Get presigned URL for temporary access
    /// </summary>
    Task<string> GetPresignedUrlAsync(string fileKey, int expiryMinutes = 60);

    /// <summary>
    /// Check if file exists
    /// </summary>
    Task<bool> ExistsAsync(string fileKey);

    /// <summary>
    /// Get file metadata
    /// </summary>
    Task<StorageMetadata?> GetMetadataAsync(string fileKey);

    /// <summary>
    /// Copy file within storage
    /// </summary>
    Task<StorageResult> CopyAsync(string sourceKey, string destinationKey);

    /// <summary>
    /// List files in folder
    /// </summary>
    Task<List<StorageMetadata>> ListFilesAsync(string? folder = null, int maxResults = 100);
}

public class StorageResult
{
    public bool Success { get; set; }
    public string? FileKey { get; set; }
    public string? PublicUrl { get; set; }
    public long FileSize { get; set; }
    public string? ContentType { get; set; }
    public string? Error { get; set; }
}

public class StorageMetadata
{
    public string FileKey { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DateTime LastModified { get; set; }
    public string? ETag { get; set; }
}

