using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LicensePackagesController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<LicensePackagesController> _logger;

    public LicensePackagesController(CoreDbContext context, ILogger<LicensePackagesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/licensepackages
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var packages = await _context.LicensePackages
            .Where(p => p.DeletedAt == null)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.Description,
                p.MonthlyPrice,
                p.YearlyPrice,
                p.Currency,
                p.TrialDays,
                p.MaxUsers,
                p.MaxStudents,
                p.MaxQuestions,
                p.MaxExams,
                p.MaxStorageGB,
                p.MaxApiCallsPerMonth,
                p.MaxModules,
                p.MaxCases,
                p.MaxDocuments,
                p.Features,
                p.IsActive,
                p.IsPublic,
                p.IsHighlighted,
                p.HighlightText,
                p.DisplayOrder,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(new { isSuccess = true, data = packages });
    }

    // GET: api/licensepackages/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetById(Guid id)
    {
        var package = await _context.LicensePackages
            .Where(p => p.Id == id && p.DeletedAt == null)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.Description,
                p.MonthlyPrice,
                p.YearlyPrice,
                p.Currency,
                p.TrialDays,
                p.MaxUsers,
                p.MaxStudents,
                p.MaxQuestions,
                p.MaxExams,
                p.MaxStorageGB,
                p.MaxApiCallsPerMonth,
                p.MaxModules,
                p.MaxCases,
                p.MaxDocuments,
                p.Features,
                p.IsActive,
                p.IsPublic,
                p.IsHighlighted,
                p.HighlightText,
                p.DisplayOrder,
                p.CreatedAt,
                p.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (package == null)
            return NotFound(new { isSuccess = false, message = "License package not found" });

        return Ok(new { isSuccess = true, data = package });
    }

    // POST: api/licensepackages
    [HttpPost]
    public async Task<ActionResult<object>> Create([FromBody] CreateLicensePackageRequest request)
    {
        var package = new LicensePackage
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Empty, // Global package
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            MonthlyPrice = request.MonthlyPrice,
            YearlyPrice = request.YearlyPrice,
            Currency = request.Currency ?? "TRY",
            TrialDays = request.TrialDays,
            MaxUsers = request.MaxUsers,
            MaxStudents = request.MaxStudents,
            MaxQuestions = request.MaxQuestions,
            MaxExams = request.MaxExams,
            MaxStorageGB = request.MaxStorageGB,
            MaxApiCallsPerMonth = request.MaxApiCallsPerMonth,
            MaxModules = request.MaxModules,
            MaxCases = request.MaxCases,
            MaxDocuments = request.MaxDocuments,
            Features = request.Features,
            IsActive = true,
            IsPublic = request.IsPublic,
            IsHighlighted = request.IsHighlighted,
            HighlightText = request.HighlightText,
            DisplayOrder = request.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null // TODO: Get from authenticated user (Guid)
        };

        _context.LicensePackages.Add(package);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = package.Id }, 
            new { isSuccess = true, message = "License package created successfully", data = package.Id });
    }

    // PUT: api/licensepackages/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<object>> Update(Guid id, [FromBody] UpdateLicensePackageRequest request)
    {
        var package = await _context.LicensePackages.FindAsync(id);
        if (package == null || package.DeletedAt != null)
            return NotFound(new { isSuccess = false, message = "License package not found" });

        package.Name = request.Name;
        package.Description = request.Description;
        package.MonthlyPrice = request.MonthlyPrice;
        package.YearlyPrice = request.YearlyPrice;
        package.Currency = request.Currency ?? "TRY";
        package.TrialDays = request.TrialDays;
        package.MaxUsers = request.MaxUsers;
        package.MaxStudents = request.MaxStudents;
        package.MaxQuestions = request.MaxQuestions;
        package.MaxExams = request.MaxExams;
        package.MaxStorageGB = request.MaxStorageGB;
        package.MaxApiCallsPerMonth = request.MaxApiCallsPerMonth;
        package.MaxModules = request.MaxModules;
        package.MaxCases = request.MaxCases;
        package.MaxDocuments = request.MaxDocuments;
        package.Features = request.Features;
        package.IsActive = request.IsActive;
        package.IsPublic = request.IsPublic;
        package.IsHighlighted = request.IsHighlighted;
        package.HighlightText = request.HighlightText;
        package.DisplayOrder = request.DisplayOrder;
        package.UpdatedAt = DateTime.UtcNow;
        package.UpdatedBy = null; // TODO: Get from authenticated user (Guid)

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License package updated successfully" });
    }

    // DELETE: api/licensepackages/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult<object>> Delete(Guid id)
    {
        var package = await _context.LicensePackages.FindAsync(id);
        if (package == null || package.DeletedAt != null)
            return NotFound(new { isSuccess = false, message = "License package not found" });

        // Soft delete
        package.DeletedAt = DateTime.UtcNow;
        package.DeletedBy = null; // TODO: Get from authenticated user (Guid)
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "License package deleted successfully" });
    }
}

// DTOs
public record CreateLicensePackageRequest
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal MonthlyPrice { get; init; }
    public decimal YearlyPrice { get; init; }
    public string? Currency { get; init; }
    public int TrialDays { get; init; }
    public int MaxUsers { get; init; }
    public int MaxStudents { get; init; }
    public int MaxQuestions { get; init; }
    public int MaxExams { get; init; }
    public int MaxStorageGB { get; init; }
    public int MaxApiCallsPerMonth { get; init; }
    public int MaxModules { get; init; }
    public int MaxCases { get; init; }
    public int MaxDocuments { get; init; }
    public string[]? Features { get; init; }
    public bool IsPublic { get; init; } = true;
    public bool IsHighlighted { get; init; }
    public string? HighlightText { get; init; }
    public int DisplayOrder { get; init; }
}

public record UpdateLicensePackageRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal MonthlyPrice { get; init; }
    public decimal YearlyPrice { get; init; }
    public string? Currency { get; init; }
    public int TrialDays { get; init; }
    public int MaxUsers { get; init; }
    public int MaxStudents { get; init; }
    public int MaxQuestions { get; init; }
    public int MaxExams { get; init; }
    public int MaxStorageGB { get; init; }
    public int MaxApiCallsPerMonth { get; init; }
    public int MaxModules { get; init; }
    public int MaxCases { get; init; }
    public int MaxDocuments { get; init; }
    public string[]? Features { get; init; }
    public bool IsActive { get; init; }
    public bool IsPublic { get; init; }
    public bool IsHighlighted { get; init; }
    public string? HighlightText { get; init; }
    public int DisplayOrder { get; init; }
}
