using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/quick-seed")]
public class QuickSeedController : ControllerBase
{
    private readonly CoreDbContext _context;

    public QuickSeedController(CoreDbContext context)
    {
        _context = context;
    }

    [HttpPost("all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            var now = DateTime.UtcNow;

            // 1. Tenants
            if (!await _context.Tenants.AnyAsync())
            {
                var tenants = new[]
                {
                    new Tenant 
                    { 
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Name = "Demo Okulu",
                        Slug = "demo",
                        Status = "active",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new Tenant 
                    { 
                        Id = Guid.NewGuid(),
                        Name = "Örnek Lise",
                        Slug = "ornek-lise",
                        Status = "active",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };
                await _context.Tenants.AddRangeAsync(tenants);
            }

            // 2. License Packages
            if (!await _context.LicensePackages.AnyAsync())
            {
                var packages = new[]
                {
                    new LicensePackage
                    {
                        Id = Guid.NewGuid(),
                        Code = "BASIC",
                        Name = "Temel Paket",
                        Description = "Temel özellikler",
                        MaxUsers = 50,
                        MaxStorageGB = 5,
                        MonthlyPrice = 99.99m,
                        YearlyPrice = 999.99m,
                        Currency = "TRY",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new LicensePackage
                    {
                        Id = Guid.NewGuid(),
                        Code = "PRO",
                        Name = "Profesyonel Paket",
                        Description = "Gelişmiş özellikler",
                        MaxUsers = 200,
                        MaxStorageGB = 20,
                        MonthlyPrice = 299.99m,
                        YearlyPrice = 2999.99m,
                        Currency = "TRY",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new LicensePackage
                    {
                        Id = Guid.NewGuid(),
                        Code = "ENTERPRISE",
                        Name = "Kurumsal Paket",
                        Description = "Sınırsız özellikler",
                        MaxUsers = 0, // unlimited
                        MaxStorageGB = 0, // unlimited
                        MonthlyPrice = 999.99m,
                        YearlyPrice = 9999.99m,
                        Currency = "TRY",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };
                await _context.LicensePackages.AddRangeAsync(packages);
            }

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                tenants = await _context.Tenants.CountAsync(),
                licensePackages = await _context.LicensePackages.CountAsync()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
        }
    }
}

