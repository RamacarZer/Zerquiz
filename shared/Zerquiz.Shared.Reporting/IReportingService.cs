namespace Zerquiz.Shared.Reporting;

/// <summary>
/// Reporting service interface for PDF/Excel/CSV exports
/// </summary>
public interface IReportingService
{
    Task<ReportResult> GeneratePdfReportAsync(ReportRequest request);
    Task<ReportResult> GenerateExcelReportAsync(ReportRequest request);
    Task<ReportResult> GenerateCsvReportAsync(ReportRequest request);
    Task<Stream> GetReportStreamAsync(string reportId);
}

public class ReportRequest
{
    public string ReportType { get; set; } = string.Empty; // exam_results, student_performance, financial, etc.
    public Dictionary<string, object> Parameters { get; set; } = new();
    public string? TemplateId { get; set; }
    public string OutputFormat { get; set; } = "pdf"; // pdf, excel, csv
}

public class ReportResult
{
    public bool Success { get; set; }
    public string? ReportId { get; set; }
    public string? FilePath { get; set; }
    public string? DownloadUrl { get; set; }
    public long FileSize { get; set; }
    public string? Error { get; set; }
    public DateTime GeneratedAt { get; set; }
}

