// TEMPORARY: Disabled due to missing shared library
/*
using Microsoft.AspNetCore.Mvc;
using Zerquiz.Shared.Reporting;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportingService _reportingService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IReportingService reportingService, ILogger<ReportsController> logger)
    {
        _reportingService = reportingService;
        _logger = logger;
    }

    /// <summary>
    /// Generate report (PDF/Excel/CSV)
    /// </summary>
    [HttpPost("generate")]
    public async Task<ActionResult> Generate([FromBody] GenerateReportRequest request)
    {
        try
        {
            var reportRequest = new ReportRequest
            {
                ReportType = request.ReportType,
                Parameters = request.Parameters,
                TemplateId = request.TemplateId,
                OutputFormat = request.OutputFormat ?? "pdf"
            };

            var result = request.OutputFormat?.ToLower() switch
            {
                "excel" or "xlsx" => await _reportingService.GenerateExcelReportAsync(reportRequest),
                "csv" => await _reportingService.GenerateCsvReportAsync(reportRequest),
                _ => await _reportingService.GeneratePdfReportAsync(reportRequest)
            };

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new
            {
                reportId = result.ReportId,
                downloadUrl = result.DownloadUrl,
                fileSize = result.FileSize,
                generatedAt = result.GeneratedAt,
                message = "Report generated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate report: {ReportType}", request.ReportType);
            return StatusCode(500, "Failed to generate report");
        }
    }

    /// <summary>
    /// Download report by ID
    /// </summary>
    [HttpGet("download/{reportId}")]
    public async Task<ActionResult> Download(string reportId)
    {
        try
        {
            var stream = await _reportingService.GetReportStreamAsync(reportId);
            return File(stream, "application/octet-stream", $"{reportId}.txt");
        }
        catch (FileNotFoundException)
        {
            return NotFound("Report not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to download report: {ReportId}", reportId);
            return StatusCode(500, "Failed to download report");
        }
    }

    /// <summary>
    /// Generate exam results report
    /// </summary>
    [HttpPost("exam-results")]
    public async Task<ActionResult> GenerateExamResults([FromBody] ExamResultsReportRequest request)
    {
        var reportRequest = new ReportRequest
        {
            ReportType = "exam_results",
            Parameters = new Dictionary<string, object>
            {
                ["examId"] = request.ExamId,
                ["includeDetails"] = request.IncludeDetails,
                ["format"] = request.Format ?? "pdf"
            },
            OutputFormat = request.Format ?? "pdf"
        };

        var result = await _reportingService.GeneratePdfReportAsync(reportRequest);
        return Ok(result);
    }

    /// <summary>
    /// Generate student performance report
    /// </summary>
    [HttpPost("student-performance")]
    public async Task<ActionResult> GenerateStudentPerformance([FromBody] StudentPerformanceReportRequest request)
    {
        var reportRequest = new ReportRequest
        {
            ReportType = "student_performance",
            Parameters = new Dictionary<string, object>
            {
                ["studentId"] = request.StudentId,
                ["fromDate"] = request.FromDate,
                ["toDate"] = request.ToDate
            },
            OutputFormat = request.Format ?? "pdf"
        };

        var result = await _reportingService.GeneratePdfReportAsync(reportRequest);
        return Ok(result);
    }

    /// <summary>
    /// Generate financial report
    /// </summary>
    [HttpPost("financial")]
    public async Task<ActionResult> GenerateFinancial([FromBody] FinancialReportRequest request)
    {
        var reportRequest = new ReportRequest
        {
            ReportType = "financial",
            Parameters = new Dictionary<string, object>
            {
                ["fromDate"] = request.FromDate,
                ["toDate"] = request.ToDate,
                ["includeRoyalties"] = request.IncludeRoyalties,
                ["includePayouts"] = request.IncludePayouts
            },
            OutputFormat = request.Format ?? "excel"
        };

        var result = await _reportingService.GenerateExcelReportAsync(reportRequest);
        return Ok(result);
    }

    /// <summary>
    /// Generate audit log report
    /// </summary>
    [HttpPost("audit-log")]
    public async Task<ActionResult> GenerateAuditLog([FromBody] AuditLogReportRequest request)
    {
        var reportRequest = new ReportRequest
        {
            ReportType = "audit_log",
            Parameters = new Dictionary<string, object>
            {
                ["fromDate"] = request.FromDate,
                ["toDate"] = request.ToDate,
                ["userId"] = request.UserId ?? Guid.Empty,
                ["action"] = request.Action ?? ""
            },
            OutputFormat = "csv"
        };

        var result = await _reportingService.GenerateCsvReportAsync(reportRequest);
        return Ok(result);
    }

    /// <summary>
    /// Get available report templates
    /// </summary>
    [HttpGet("templates")]
    public ActionResult GetTemplates()
    {
        var templates = new[]
        {
            new { id = "exam_results", name = "Exam Results Report", formats = new[] { "pdf", "excel", "csv" } },
            new { id = "student_performance", name = "Student Performance Report", formats = new[] { "pdf", "excel" } },
            new { id = "financial", name = "Financial Report", formats = new[] { "excel", "csv" } },
            new { id = "audit_log", name = "Audit Log Report", formats = new[] { "csv", "excel" } },
            new { id = "royalty_summary", name = "Royalty Summary Report", formats = new[] { "pdf", "excel" } },
            new { id = "question_analytics", name = "Question Analytics Report", formats = new[] { "pdf", "excel" } }
        };

        return Ok(templates);
    }
}
*/

/*
public record GenerateReportRequest(string ReportType, Dictionary<string, object> Parameters, string? TemplateId, string? OutputFormat);
public record ExamResultsReportRequest(Guid ExamId, bool IncludeDetails, string? Format);
public record StudentPerformanceReportRequest(Guid StudentId, DateTime FromDate, DateTime ToDate, string? Format);
public record FinancialReportRequest(DateTime FromDate, DateTime ToDate, bool IncludeRoyalties, bool IncludePayouts, string? Format);
public record AuditLogReportRequest(DateTime FromDate, DateTime ToDate, Guid? UserId, string? Action);
*/