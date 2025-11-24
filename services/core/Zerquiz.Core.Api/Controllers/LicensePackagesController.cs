using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<LicensePackageDto>>>> GetAll()
    {
        var packages = await _context.LicensePackages
            .Where(lp => lp.DeletedAt == null)
            .OrderBy(lp => lp.DisplayOrder)
            .ToListAsync();

        var dtos = packages.Select(p => new LicensePackageDto
        {
            Id = p.Id,
            Name = p.Name,
            Code = p.Code,
            Description = p.Description,
            MonthlyPrice = p.MonthlyPrice,
            YearlyPrice = p.YearlyPrice,
            Currency = p.Currency,
            MaxUsers = p.MaxUsers,
            MaxStudents = p.MaxStudents,
            MaxQuestions = p.MaxQuestions,
            MaxExams = p.MaxExams,
            MaxStorage = p.MaxStorage,
            IsActive = p.IsActive,
            DisplayOrder = p.DisplayOrder
        }).ToList();

        return Ok(ApiResponse<List<LicensePackageDto>>.SuccessResult(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<LicensePackageDto>>> GetById(Guid id)
    {
        var package = await _context.LicensePackages
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.DeletedAt == null);

        if (package == null)
            return NotFound(ApiResponse<LicensePackageDto>.ErrorResult("License package not found"));

        var dto = new LicensePackageDto
        {
            Id = package.Id,
            Name = package.Name,
            Code = package.Code,
            Description = package.Description,
            MonthlyPrice = package.MonthlyPrice,
            YearlyPrice = package.YearlyPrice,
            Currency = package.Currency,
            MaxUsers = package.MaxUsers,
            MaxStudents = package.MaxStudents,
            MaxQuestions = package.MaxQuestions,
            MaxExams = package.MaxExams,
            MaxStorage = package.MaxStorage,
            IsActive = package.IsActive,
            DisplayOrder = package.DisplayOrder
        };

        return Ok(ApiResponse<LicensePackageDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<LicensePackageDto>>> Create([FromBody] CreateLicensePackageRequest request)
    {
        var exists = await _context.LicensePackages
            .AnyAsync(lp => lp.Code == request.Code && lp.DeletedAt == null);

        if (exists)
            return BadRequest(ApiResponse<LicensePackageDto>.ErrorResult("Package with this code already exists"));

        var package = new LicensePackage
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // System level
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            MonthlyPrice = request.MonthlyPrice,
            YearlyPrice = request.YearlyPrice,
            Currency = request.Currency,
            MaxUsers = request.MaxUsers,
            MaxStudents = request.MaxStudents,
            MaxQuestions = request.MaxQuestions,
            MaxExams = request.MaxExams,
            MaxStorage = request.MaxStorage,
            DisplayOrder = request.DisplayOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Version = 1
        };

        _context.LicensePackages.Add(package);
        await _context.SaveChangesAsync();

        var dto = new LicensePackageDto
        {
            Id = package.Id,
            Name = package.Name,
            Code = package.Code,
            Description = package.Description,
            MonthlyPrice = package.MonthlyPrice,
            YearlyPrice = package.YearlyPrice,
            Currency = package.Currency,
            MaxUsers = package.MaxUsers,
            MaxStudents = package.MaxStudents,
            MaxQuestions = package.MaxQuestions,
            MaxExams = package.MaxExams,
            MaxStorage = package.MaxStorage,
            IsActive = package.IsActive,
            DisplayOrder = package.DisplayOrder
        };

        return CreatedAtAction(nameof(GetById), new { id = package.Id }, ApiResponse<LicensePackageDto>.SuccessResult(dto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<LicensePackageDto>>> Update(Guid id, [FromBody] UpdateLicensePackageRequest request)
    {
        var package = await _context.LicensePackages
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.DeletedAt == null);

        if (package == null)
            return NotFound(ApiResponse<LicensePackageDto>.ErrorResult("License package not found"));

        package.Name = request.Name;
        package.Description = request.Description;
        package.MonthlyPrice = request.MonthlyPrice;
        package.YearlyPrice = request.YearlyPrice;
        package.Currency = request.Currency;
        package.MaxUsers = request.MaxUsers;
        package.MaxStudents = request.MaxStudents;
        package.MaxQuestions = request.MaxQuestions;
        package.MaxExams = request.MaxExams;
        package.MaxStorage = request.MaxStorage;
        package.DisplayOrder = request.DisplayOrder;
        package.UpdatedAt = DateTime.UtcNow;
        package.Version++;

        await _context.SaveChangesAsync();

        var dto = new LicensePackageDto
        {
            Id = package.Id,
            Name = package.Name,
            Code = package.Code,
            Description = package.Description,
            MonthlyPrice = package.MonthlyPrice,
            YearlyPrice = package.YearlyPrice,
            Currency = package.Currency,
            MaxUsers = package.MaxUsers,
            MaxStudents = package.MaxStudents,
            MaxQuestions = package.MaxQuestions,
            MaxExams = package.MaxExams,
            MaxStorage = package.MaxStorage,
            IsActive = package.IsActive,
            DisplayOrder = package.DisplayOrder
        };

        return Ok(ApiResponse<LicensePackageDto>.SuccessResult(dto));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var package = await _context.LicensePackages
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.DeletedAt == null);

        if (package == null)
            return NotFound(ApiResponse<bool>.ErrorResult("License package not found"));

        // Soft delete
        package.DeletedAt = DateTime.UtcNow;
        package.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleStatus(Guid id)
    {
        var package = await _context.LicensePackages
            .FirstOrDefaultAsync(lp => lp.Id == id && lp.DeletedAt == null);

        if (package == null)
            return NotFound(ApiResponse<bool>.ErrorResult("License package not found"));

        package.IsActive = !package.IsActive;
        package.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }
}

// DTOs
public class LicensePackageDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public int MaxUsers { get; set; }
    public int MaxStudents { get; set; }
    public int MaxQuestions { get; set; }
    public int MaxExams { get; set; }
    public int MaxStorage { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateLicensePackageRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public int MaxUsers { get; set; }
    public int MaxStudents { get; set; }
    public int MaxQuestions { get; set; }
    public int MaxExams { get; set; }
    public int MaxStorage { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateLicensePackageRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public int MaxUsers { get; set; }
    public int MaxStudents { get; set; }
    public int MaxQuestions { get; set; }
    public int MaxExams { get; set; }
    public int MaxStorage { get; set; }
    public int DisplayOrder { get; set; }
}

