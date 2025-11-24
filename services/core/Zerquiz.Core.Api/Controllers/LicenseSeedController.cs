using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/license-seed")]
public class LicenseSeedController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<LicenseSeedController> _logger;

    public LicenseSeedController(CoreDbContext context, ILogger<LicenseSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // POST: api/license-seed/packages
    [HttpPost("packages")]
    public async Task<ActionResult<object>> SeedLicensePackages()
    {
        try
        {
            // Check if packages already exist
            var existingCount = await _context.LicensePackages.CountAsync();
            if (existingCount > 0)
            {
                return Ok(new
                {
                    isSuccess = true,
                    message = $"License packages already seeded ({existingCount} packages exist)",
                    data = new { existingPackages = existingCount }
                });
            }

            var packages = new List<LicensePackage>
            {
                // FREE Package
                new LicensePackage
                {
                    Id = Guid.NewGuid(),
                    TenantId = Guid.Empty,
                    Code = "free",
                    Name = "Ücretsiz Deneme",
                    Description = "Sistemi test etmek için 14 günlük ücretsiz deneme",
                    MonthlyPrice = 0,
                    YearlyPrice = 0,
                    Currency = "TRY",
                    TrialDays = 14,
                    MaxUsers = 5,
                    MaxStudents = 50,
                    MaxQuestions = 100,
                    MaxExams = 10,
                    MaxStorageGB = 1,
                    MaxApiCallsPerMonth = 1000,
                    MaxModules = 3,
                    MaxCases = 0,
                    MaxDocuments = 100,
                    Features = new[] { "basic_features", "online_exams", "auto_grading" },
                    IsActive = true,
                    IsPublic = true,
                    IsHighlighted = false,
                    DisplayOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },

                // BASIC Package
                new LicensePackage
                {
                    Id = Guid.NewGuid(),
                    TenantId = Guid.Empty,
                    Code = "basic",
                    Name = "Temel Paket",
                    Description = "Küçük eğitim kurumları için başlangıç paketi",
                    MonthlyPrice = 499,
                    YearlyPrice = 4990,
                    Currency = "TRY",
                    TrialDays = 14,
                    MaxUsers = 25,
                    MaxStudents = 500,
                    MaxQuestions = 1000,
                    MaxExams = 50,
                    MaxStorageGB = 10,
                    MaxApiCallsPerMonth = 10000,
                    MaxModules = 5,
                    MaxCases = 0,
                    MaxDocuments = 1000,
                    Features = new[]
                    {
                        "all_question_types",
                        "online_exams",
                        "printed_exams",
                        "auto_grading",
                        "basic_analytics",
                        "email_branding",
                        "subdomain"
                    },
                    IsActive = true,
                    IsPublic = true,
                    IsHighlighted = false,
                    DisplayOrder = 2,
                    CreatedAt = DateTime.UtcNow
                },

                // PROFESSIONAL Package (Most Popular)
                new LicensePackage
                {
                    Id = Guid.NewGuid(),
                    TenantId = Guid.Empty,
                    Code = "professional",
                    Name = "Profesyonel Paket",
                    Description = "Orta ölçekli kurumlar için tam özellikli paket",
                    MonthlyPrice = 1499,
                    YearlyPrice = 14990,
                    Currency = "TRY",
                    TrialDays = 14,
                    MaxUsers = 100,
                    MaxStudents = 2000,
                    MaxQuestions = 5000,
                    MaxExams = 200,
                    MaxStorageGB = 50,
                    MaxApiCallsPerMonth = 100000,
                    MaxModules = 10,
                    MaxCases = 1000,
                    MaxDocuments = 10000,
                    Features = new[]
                    {
                        "all_question_types",
                        "online_exams",
                        "printed_exams",
                        "auto_grading",
                        "manual_grading",
                        "advanced_analytics",
                        "export_reports",
                        "certificates",
                        "custom_domain",
                        "custom_logo",
                        "custom_colors",
                        "email_branding",
                        "subdomain",
                        "api_access",
                        "webhooks",
                        "priority_support"
                    },
                    IsActive = true,
                    IsPublic = true,
                    IsHighlighted = true,
                    HighlightText = "En Popüler",
                    DisplayOrder = 3,
                    CreatedAt = DateTime.UtcNow
                },

                // ENTERPRISE Package
                new LicensePackage
                {
                    Id = Guid.NewGuid(),
                    TenantId = Guid.Empty,
                    Code = "enterprise",
                    Name = "Kurumsal Paket",
                    Description = "Büyük kurumlar için sınırsız özellikler",
                    MonthlyPrice = 4999,
                    YearlyPrice = 49990,
                    Currency = "TRY",
                    TrialDays = 30,
                    MaxUsers = 0, // 0 = unlimited
                    MaxStudents = 0,
                    MaxQuestions = 0,
                    MaxExams = 0,
                    MaxStorageGB = 500,
                    MaxApiCallsPerMonth = 0,
                    MaxModules = 0,
                    MaxCases = 0,
                    MaxDocuments = 0,
                    Features = new[]
                    {
                        "all_question_types",
                        "online_exams",
                        "printed_exams",
                        "auto_grading",
                        "manual_grading",
                        "advanced_analytics",
                        "export_reports",
                        "certificates",
                        "custom_domain",
                        "custom_logo",
                        "custom_colors",
                        "white_label",
                        "custom_css",
                        "custom_js",
                        "email_branding",
                        "subdomain",
                        "api_access",
                        "webhooks",
                        "sso",
                        "ldap_integration",
                        "priority_support",
                        "dedicated_support",
                        "custom_integrations",
                        "custom_sla"
                    },
                    IsActive = true,
                    IsPublic = true,
                    IsHighlighted = false,
                    HighlightText = "Kurumsal",
                    DisplayOrder = 4,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.LicensePackages.AddRangeAsync(packages);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                isSuccess = true,
                message = "License packages seeded successfully",
                data = new
                {
                    packagesCreated = packages.Count,
                    packages = packages.Select(p => new { p.Code, p.Name, p.MonthlyPrice, p.YearlyPrice })
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding license packages");
            return StatusCode(500, new
            {
                isSuccess = false,
                message = "Error seeding license packages",
                error = ex.Message
            });
        }
    }

    // POST: api/license-seed/assign-demo
    [HttpPost("assign-demo")]
    public async Task<ActionResult<object>> AssignDemoLicense([FromQuery] Guid tenantId)
    {
        try
        {
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null)
                return NotFound(new { isSuccess = false, message = "Tenant not found" });

            // Find FREE package
            var freePackage = await _context.LicensePackages
                .FirstOrDefaultAsync(p => p.Code == "free");

            if (freePackage == null)
                return NotFound(new { isSuccess = false, message = "FREE package not found. Please seed packages first." });

            // Check if tenant already has a license
            var existingLicense = await _context.TenantLicenses
                .FirstOrDefaultAsync(l => l.TenantId == tenantId && l.Status == "active");

            if (existingLicense != null)
            {
                return Ok(new
                {
                    isSuccess = true,
                    message = "Tenant already has an active license",
                    data = new { licenseId = existingLicense.Id, package = existingLicense.LicensePackageId }
                });
            }

            // Create new license
            var license = new TenantLicense
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                LicensePackageId = freePackage.Id,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(freePackage.TrialDays),
                TrialEndDate = DateTime.UtcNow.AddDays(freePackage.TrialDays),
                Status = "trial",
                AutoRenew = false,
                Amount = 0,
                Currency = "TRY",
                BillingPeriod = "monthly",
                NextBillingDate = DateTime.UtcNow.AddDays(freePackage.TrialDays),
                CreatedAt = DateTime.UtcNow
            };

            await _context.TenantLicenses.AddAsync(license);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                isSuccess = true,
                message = "Demo license assigned successfully",
                data = new
                {
                    licenseId = license.Id,
                    package = freePackage.Name,
                    status = license.Status,
                    endDate = license.EndDate
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning demo license");
            return StatusCode(500, new
            {
                isSuccess = false,
                message = "Error assigning demo license",
                error = ex.Message
            });
        }
    }
}

