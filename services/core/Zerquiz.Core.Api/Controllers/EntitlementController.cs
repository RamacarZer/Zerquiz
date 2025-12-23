using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EntitlementController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<EntitlementController> _logger;

    public EntitlementController(CoreDbContext context, ILogger<EntitlementController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Check if tenant has access to a feature
    /// </summary>
    [HttpGet("check")]
    public async Task<ActionResult> CheckEntitlement(
        [FromQuery] Guid tenantId, 
        [FromQuery] string featureCode)
    {
        try
        {
            var license = await _context.TenantLicenses
                .Include(l => l.LicensePackage)
                .Where(l => l.TenantId == tenantId && l.Status == "active")
                .OrderByDescending(l => l.CreatedAt)
                .FirstOrDefaultAsync();

            if (license == null || license.EndDate < DateTime.UtcNow)
            {
                return Ok(new { hasAccess = false, reason = "No active license" });
            }

            // Check feature in package
            var hasFeature = license.LicensePackage?.Features?.Contains(featureCode) ?? false;

            return Ok(new { hasAccess = hasFeature, licenseStatus = license.Status });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking entitlement");
            return StatusCode(500, new { error = "Failed to check entitlement" });
        }
    }

    /// <summary>
    /// Check usage limits
    /// </summary>
    [HttpGet("limits")]
    public async Task<ActionResult> CheckLimits([FromQuery] Guid tenantId)
    {
        try
        {
            var license = await _context.TenantLicenses
                .Include(l => l.LicensePackage)
                .Where(l => l.TenantId == tenantId && l.Status == "active")
                .FirstOrDefaultAsync();

            if (license == null)
                return NotFound(new { error = "No active license found" });

            // Get current usage (simplified - would query actual usage from other services)
            var response = new
            {
                limits = new
                {
                    maxUsers = license.LicensePackage?.MaxUsers ?? 0,
                    maxStudents = license.LicensePackage?.MaxStudents ?? 0,
                    maxQuestions = license.LicensePackage?.MaxQuestions ?? 0,
                    maxExams = license.LicensePackage?.MaxExams ?? 0,
                    maxStorageGB = license.LicensePackage?.MaxStorageGB ?? 0
                },
                usage = new
                {
                    users = 0, // TODO: Query from Identity service
                    students = 0,
                    questions = 0,
                    exams = 0,
                    storageGB = 0
                },
                licenseStatus = license.Status,
                expiresAt = license.EndDate
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking limits");
            return StatusCode(500, new { error = "Failed to check limits" });
        }
    }

    /// <summary>
    /// Track usage
    /// </summary>
    [HttpPost("usage")]
    public async Task<ActionResult> TrackUsage([FromBody] UsageTrackRequest request)
    {
        try
        {
            // In production, would update usage in dedicated usage_tracking table
            _logger.LogInformation("Usage tracked for tenant {TenantId}: {Metric}={Value}", 
                request.TenantId, request.Metric, request.Value);

            return Ok(new { message = "Usage tracked" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking usage");
            return StatusCode(500, new { error = "Failed to track usage" });
        }
    }
}

public record UsageTrackRequest(Guid TenantId, string Metric, int Value);

