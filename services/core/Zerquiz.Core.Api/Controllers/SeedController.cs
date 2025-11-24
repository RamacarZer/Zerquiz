using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Core.Domain.Entities;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(CoreDbContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("demo-data")]
    public async Task<IActionResult> SeedDemoData()
    {
        try
        {
            _logger.LogInformation("Starting demo data seeding...");

            // 1. Tenants
            var tenant1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
            if (!await _context.Tenants.AnyAsync(t => t.Id == tenant1Id))
            {
                _context.Tenants.Add(new Tenant
                {
                    Id = tenant1Id,
                    Name = "Demo School",
                    Slug = "demo",
                    CompanyName = "Demo Eğitim Kurumları A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
                _logger.LogInformation("Added tenant: Demo School");
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Demo data seeded successfully!", tenant = "Demo School created" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding demo data");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            var tenantCount = await _context.Tenants.CountAsync();
            var licenseCount = await _context.LicensePackages.CountAsync();
            // var featureCount = await _context.SystemFeatures.CountAsync(); // TODO: Add when SystemFeatures is implemented

            return Ok(new
            {
                database = "connected",
                tenants = tenantCount,
                licensePackages = licenseCount
                // systemFeatures = featureCount // TODO: Add when implemented
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

