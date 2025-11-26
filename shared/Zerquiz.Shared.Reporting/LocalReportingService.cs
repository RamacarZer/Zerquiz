using Microsoft.Extensions.Logging;
using System.Text;

namespace Zerquiz.Shared.Reporting;

/// <summary>
/// Local reporting service (generates basic text reports for development)
/// </summary>
public class LocalReportingService : IReportingService
{
    private readonly ILogger<LocalReportingService> _logger;
    private readonly string _outputPath;

    public LocalReportingService(ILogger<LocalReportingService> logger, string? outputPath = null)
    {
        _logger = logger;
        _outputPath = outputPath ?? Path.Combine(Path.GetTempPath(), "zerquiz-reports");

        if (!Directory.Exists(_outputPath))
        {
            Directory.CreateDirectory(_outputPath);
        }
    }

    public Task<ReportResult> GeneratePdfReportAsync(ReportRequest request)
    {
        _logger.LogInformation("📄 Generating PDF report: {ReportType}", request.ReportType);
        return GenerateReportAsync(request, "pdf");
    }

    public Task<ReportResult> GenerateExcelReportAsync(ReportRequest request)
    {
        _logger.LogInformation("📊 Generating Excel report: {ReportType}", request.ReportType);
        return GenerateReportAsync(request, "xlsx");
    }

    public Task<ReportResult> GenerateCsvReportAsync(ReportRequest request)
    {
        _logger.LogInformation("📋 Generating CSV report: {ReportType}", request.ReportType);
        return GenerateReportAsync(request, "csv");
    }

    public Task<Stream> GetReportStreamAsync(string reportId)
    {
        var filePath = Path.Combine(_outputPath, $"{reportId}.txt");

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"Report not found: {reportId}");
        }

        return Task.FromResult<Stream>(File.OpenRead(filePath));
    }

    private Task<ReportResult> GenerateReportAsync(ReportRequest request, string extension)
    {
        try
        {
            var reportId = $"{request.ReportType}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid():N}";
            var fileName = $"{reportId}.{extension}";
            var filePath = Path.Combine(_outputPath, fileName);

            // Generate simple text report (in production, use proper PDF/Excel libraries)
            var content = GenerateReportContent(request);
            File.WriteAllText(filePath, content);

            var fileInfo = new FileInfo(filePath);

            return Task.FromResult(new ReportResult
            {
                Success = true,
                ReportId = reportId,
                FilePath = filePath,
                DownloadUrl = $"/api/reports/download/{reportId}",
                FileSize = fileInfo.Length,
                GeneratedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate report: {ReportType}", request.ReportType);
            return Task.FromResult(new ReportResult
            {
                Success = false,
                Error = ex.Message
            });
        }
    }

    private string GenerateReportContent(ReportRequest request)
    {
        var sb = new StringBuilder();

        sb.AppendLine("=".PadRight(80, '='));
        sb.AppendLine($"ZERQUIZ REPORT: {request.ReportType.ToUpper()}");
        sb.AppendLine($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        sb.AppendLine("=".PadRight(80, '='));
        sb.AppendLine();

        sb.AppendLine("PARAMETERS:");
        foreach (var param in request.Parameters)
        {
            sb.AppendLine($"  - {param.Key}: {param.Value}");
        }
        sb.AppendLine();

        sb.AppendLine("REPORT DATA:");
        sb.AppendLine("(In production, this would contain actual data from databases)");
        sb.AppendLine();

        // Sample data based on report type
        sb.AppendLine(request.ReportType switch
        {
            "exam_results" => GenerateExamResultsReport(),
            "student_performance" => GenerateStudentPerformanceReport(),
            "financial" => GenerateFinancialReport(),
            "audit_log" => GenerateAuditLogReport(),
            _ => "Report data would be generated here..."
        });

        sb.AppendLine();
        sb.AppendLine("=".PadRight(80, '='));
        sb.AppendLine("END OF REPORT");

        return sb.ToString();
    }

    private string GenerateExamResultsReport()
    {
        return @"
Exam Results Summary:
---------------------
Total Students: 150
Average Score: 75.5
Highest Score: 98
Lowest Score: 42
Pass Rate: 85%

Top 5 Students:
1. Student A - 98 points
2. Student B - 95 points
3. Student C - 92 points
4. Student D - 90 points
5. Student E - 88 points";
    }

    private string GenerateStudentPerformanceReport()
    {
        return @"
Student Performance Analysis:
----------------------------
Student ID: 12345
Total Exams: 12
Average Score: 82.3
Improvement Trend: +5.2%

Subject Performance:
- Mathematics: 85%
- Science: 78%
- Literature: 84%
- History: 81%";
    }

    private string GenerateFinancialReport()
    {
        return @"
Financial Summary:
-----------------
Period: Last 30 Days

Revenue:
- Subscriptions: $15,250
- Exam Fees: $8,400
- Total: $23,650

Expenses:
- Royalty Payments: $5,230
- Review Fees: $1,850
- Platform Costs: $2,100
- Total: $9,180

Net Profit: $14,470";
    }

    private string GenerateAuditLogReport()
    {
        return @"
Audit Log Summary:
-----------------
Total Actions: 1,245
Period: Last 7 Days

Top Actions:
- User Login: 450
- Question Created: 185
- Exam Submitted: 142
- Grade Published: 98
- Other: 370";
    }
}

