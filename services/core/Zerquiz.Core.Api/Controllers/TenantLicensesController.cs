using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/tenants/{tenantId}/license")]
public class TenantLicensesController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<TenantLicensesController> _logger;

    public TenantLicensesController(CoreDbContext context, ILogger<TenantLicensesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/tenants/{tenantId}/license
    [HttpGet]
    public async Task<ActionResult<object>> GetTenantLicense(Guid tenantId)
    {
        var license = await _context.TenantLicenses
            .Include(l => l.LicensePackage)
            .Where(l => l.TenantId == tenantId && l.DeletedAt == null)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new
            {
                l.Id,
                l.TenantId,
                Package = new
                {
                    l.LicensePackage!.Id,
                    l.LicensePackage.Code,
                    l.LicensePackage.Name,
                    l.LicensePackage.MonthlyPrice,
                    l.LicensePackage.YearlyPrice,
                    l.LicensePackage.Currency
                },
                l.StartDate,
                l.EndDate,
                l.TrialEndDate,
                l.Status,
                l.AutoRenew,
                l.Amount,
                l.Currency,
                l.BillingPeriod,
                l.CustomLimitsJson,
                l.CustomFeaturesJson,
                l.CurrentUsageJson,
                l.NextBillingDate,
                l.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (license == null)
            return NotFound(new { isSuccess = false, message = "No license found for this tenant" });

        return Ok(new { isSuccess = true, data = license });
    }

    // POST: api/tenants/{tenantId}/license/assign
    [HttpPost("assign")]
    public async Task<ActionResult<object>> AssignLicense(Guid tenantId, [FromBody] AssignLicenseRequest request)
    {
        // Check if tenant exists
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound(new { isSuccess = false, message = "Tenant not found" });

        // Check if package exists
        var package = await _context.LicensePackages.FindAsync(request.PackageId);
        if (package == null)
            return NotFound(new { isSuccess = false, message = "License package not found" });

        // Deactivate existing licenses
        var existingLicenses = await _context.TenantLicenses
            .Where(l => l.TenantId == tenantId && l.Status == "active")
            .ToListAsync();

        foreach (var existingLicense in existingLicenses)
        {
            existingLicense.Status = "cancelled";
            existingLicense.CancelledAt = DateTime.UtcNow;
        }

        // Create new license
        var license = new TenantLicense
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            LicensePackageId = request.PackageId,
            StartDate = request.StartDate ?? DateTime.UtcNow,
            EndDate = request.EndDate ?? DateTime.UtcNow.AddYears(1),
            TrialEndDate = package.TrialDays > 0 ? DateTime.UtcNow.AddDays(package.TrialDays) : null,
            Status = package.TrialDays > 0 ? "trial" : "active",
            AutoRenew = request.AutoRenew,
            Amount = request.BillingPeriod == "yearly" ? package.YearlyPrice : package.MonthlyPrice,
            Currency = package.Currency,
            BillingPeriod = request.BillingPeriod ?? "monthly",
            CustomLimitsJson = request.CustomLimitsJson,
            CustomFeaturesJson = request.CustomFeaturesJson,
            NextBillingDate = request.BillingPeriod == "yearly" 
                ? DateTime.UtcNow.AddYears(1) 
                : DateTime.UtcNow.AddMonths(1),
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null // TODO: Get from authenticated user (Guid)
        };

        _context.TenantLicenses.Add(license);
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License assigned successfully", data = license.Id });
    }

    // PUT: api/tenants/{tenantId}/license/upgrade
    [HttpPut("upgrade")]
    public async Task<ActionResult<object>> UpgradeLicense(Guid tenantId, [FromBody] UpgradeLicenseRequest request)
    {
        var currentLicense = await _context.TenantLicenses
            .Where(l => l.TenantId == tenantId && l.Status == "active")
            .FirstOrDefaultAsync();

        if (currentLicense == null)
            return NotFound(new { isSuccess = false, message = "No active license found" });

        var newPackage = await _context.LicensePackages.FindAsync(request.NewPackageId);
        if (newPackage == null)
            return NotFound(new { isSuccess = false, message = "License package not found" });

        // Cancel current license
        currentLicense.Status = "cancelled";
        currentLicense.CancelledAt = DateTime.UtcNow;

        // Create upgraded license
        var upgradedLicense = new TenantLicense
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            LicensePackageId = request.NewPackageId,
            StartDate = DateTime.UtcNow,
            EndDate = currentLicense.EndDate, // Keep same end date
            Status = "active",
            AutoRenew = currentLicense.AutoRenew,
            Amount = request.BillingPeriod == "yearly" ? newPackage.YearlyPrice : newPackage.MonthlyPrice,
            Currency = newPackage.Currency,
            BillingPeriod = request.BillingPeriod ?? currentLicense.BillingPeriod,
            NextBillingDate = currentLicense.NextBillingDate,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        _context.TenantLicenses.Add(upgradedLicense);
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License upgraded successfully" });
    }

    // PUT: api/tenants/{tenantId}/license/suspend
    [HttpPut("suspend")]
    public async Task<ActionResult<object>> SuspendLicense(Guid tenantId)
    {
        var license = await _context.TenantLicenses
            .Where(l => l.TenantId == tenantId && l.Status == "active")
            .FirstOrDefaultAsync();

        if (license == null)
            return NotFound(new { isSuccess = false, message = "No active license found" });

        license.Status = "suspended";
        license.SuspendedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License suspended successfully" });
    }

    // PUT: api/tenants/{tenantId}/license/activate
    [HttpPut("activate")]
    public async Task<ActionResult<object>> ActivateLicense(Guid tenantId)
    {
        var license = await _context.TenantLicenses
            .Where(l => l.TenantId == tenantId && l.Status == "suspended")
            .FirstOrDefaultAsync();

        if (license == null)
            return NotFound(new { isSuccess = false, message = "No suspended license found" });

        license.Status = "active";
        license.SuspendedAt = null;
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License activated successfully" });
    }

    // GET: api/tenants/{tenantId}/license/usage
    [HttpGet("usage")]
    public async Task<ActionResult<object>> GetUsage(Guid tenantId)
    {
        var license = await _context.TenantLicenses
            .Include(l => l.LicensePackage)
            .Where(l => l.TenantId == tenantId && l.Status == "active")
            .FirstOrDefaultAsync();

        if (license == null)
            return NotFound(new { isSuccess = false, message = "No active license found" });

        // TODO: Calculate actual usage from other services
        var usage = new
        {
            limits = new
            {
                maxUsers = license.LicensePackage!.MaxUsers,
                maxQuestions = license.LicensePackage.MaxQuestions,
                maxExams = license.LicensePackage.MaxExams,
                maxStorageGB = license.LicensePackage.MaxStorageGB
            },
            current = new
            {
                users = 0, // TODO: Get from Identity service
                questions = 0, // TODO: Get from Questions service
                exams = 0, // TODO: Get from Exams service
                storageGB = 0.0 // TODO: Calculate
            },
            percentage = new
            {
                users = 0.0,
                questions = 0.0,
                exams = 0.0,
                storage = 0.0
            }
        };

        return Ok(new { isSuccess = true, data = usage });
    }
}

// DTOs
public record AssignLicenseRequest
{
    public Guid PackageId { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public bool AutoRenew { get; init; } = true;
    public string? BillingPeriod { get; init; } // monthly, yearly
    public string? CustomLimitsJson { get; init; }
    public string? CustomFeaturesJson { get; init; }
}

public record UpgradeLicenseRequest
{
    public Guid NewPackageId { get; init; }
    public string? BillingPeriod { get; init; }
}
