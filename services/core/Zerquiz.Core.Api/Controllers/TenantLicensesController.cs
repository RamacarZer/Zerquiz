using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantLicensesController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<TenantLicensesController> _logger;

    public TenantLicensesController(CoreDbContext context, ILogger<TenantLicensesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("tenant/{tenantId}")]
    public async Task<ActionResult<ApiResponse<List<TenantLicenseDto>>>> GetByTenant(Guid tenantId)
    {
        var licenses = await _context.TenantLicenses
            .Include(tl => tl.LicensePackage)
            .Where(tl => tl.TenantId == tenantId && tl.DeletedAt == null)
            .OrderByDescending(tl => tl.StartDate)
            .ToListAsync();

        var dtos = licenses.Select(l => new TenantLicenseDto
        {
            Id = l.Id,
            TenantId = l.TenantId,
            LicensePackageId = l.LicensePackageId,
            LicensePackageName = l.LicensePackage.Name,
            LicensePackageCode = l.LicensePackage.Code,
            StartDate = l.StartDate,
            ExpiryDate = l.ExpiryDate,
            IsActive = l.IsActive,
            CreatedAt = l.CreatedAt
        }).ToList();

        return Ok(ApiResponse<List<TenantLicenseDto>>.SuccessResult(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TenantLicenseDto>>> GetById(Guid id)
    {
        var license = await _context.TenantLicenses
            .Include(tl => tl.LicensePackage)
            .Include(tl => tl.Tenant)
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.DeletedAt == null);

        if (license == null)
            return NotFound(ApiResponse<TenantLicenseDto>.ErrorResult("Tenant license not found"));

        var dto = new TenantLicenseDto
        {
            Id = license.Id,
            TenantId = license.TenantId,
            TenantName = license.Tenant.Name,
            LicensePackageId = license.LicensePackageId,
            LicensePackageName = license.LicensePackage.Name,
            LicensePackageCode = license.LicensePackage.Code,
            StartDate = license.StartDate,
            ExpiryDate = license.ExpiryDate,
            IsActive = license.IsActive,
            CreatedAt = license.CreatedAt
        };

        return Ok(ApiResponse<TenantLicenseDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TenantLicenseDto>>> Create([FromBody] CreateTenantLicenseRequest request)
    {
        // Check if package exists
        var package = await _context.LicensePackages.FindAsync(request.LicensePackageId);
        if (package == null)
            return BadRequest(ApiResponse<TenantLicenseDto>.ErrorResult("License package not found"));

        // Check if tenant exists
        var tenant = await _context.Tenants.FindAsync(request.TenantId);
        if (tenant == null)
            return BadRequest(ApiResponse<TenantLicenseDto>.ErrorResult("Tenant not found"));

        var license = new TenantLicense
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            LicensePackageId = request.LicensePackageId,
            StartDate = request.StartDate,
            ExpiryDate = request.ExpiryDate,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.TenantLicenses.Add(license);
        await _context.SaveChangesAsync();

        // Reload with includes
        license = await _context.TenantLicenses
            .Include(tl => tl.LicensePackage)
            .Include(tl => tl.Tenant)
            .FirstAsync(tl => tl.Id == license.Id);

        var dto = new TenantLicenseDto
        {
            Id = license.Id,
            TenantId = license.TenantId,
            TenantName = license.Tenant.Name,
            LicensePackageId = license.LicensePackageId,
            LicensePackageName = license.LicensePackage.Name,
            LicensePackageCode = license.LicensePackage.Code,
            StartDate = license.StartDate,
            ExpiryDate = license.ExpiryDate,
            IsActive = license.IsActive,
            CreatedAt = license.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = license.Id }, ApiResponse<TenantLicenseDto>.SuccessResult(dto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TenantLicenseDto>>> Update(Guid id, [FromBody] UpdateTenantLicenseRequest request)
    {
        var license = await _context.TenantLicenses
            .Include(tl => tl.LicensePackage)
            .Include(tl => tl.Tenant)
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.DeletedAt == null);

        if (license == null)
            return NotFound(ApiResponse<TenantLicenseDto>.ErrorResult("Tenant license not found"));

        license.StartDate = request.StartDate;
        license.ExpiryDate = request.ExpiryDate;
        license.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var dto = new TenantLicenseDto
        {
            Id = license.Id,
            TenantId = license.TenantId,
            TenantName = license.Tenant.Name,
            LicensePackageId = license.LicensePackageId,
            LicensePackageName = license.LicensePackage.Name,
            LicensePackageCode = license.LicensePackage.Code,
            StartDate = license.StartDate,
            ExpiryDate = license.ExpiryDate,
            IsActive = license.IsActive,
            CreatedAt = license.CreatedAt
        };

        return Ok(ApiResponse<TenantLicenseDto>.SuccessResult(dto));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var license = await _context.TenantLicenses
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.DeletedAt == null);

        if (license == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Tenant license not found"));

        // Soft delete
        license.DeletedAt = DateTime.UtcNow;
        license.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }

    [HttpPut("{id}/suspend")]
    public async Task<ActionResult<ApiResponse<bool>>> Suspend(Guid id)
    {
        var license = await _context.TenantLicenses
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.DeletedAt == null);

        if (license == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Tenant license not found"));

        license.IsActive = false;
        license.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }

    [HttpPut("{id}/activate")]
    public async Task<ActionResult<ApiResponse<bool>>> Activate(Guid id)
    {
        var license = await _context.TenantLicenses
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.DeletedAt == null);

        if (license == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Tenant license not found"));

        license.IsActive = true;
        license.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }
}

// DTOs
public class TenantLicenseDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string? TenantName { get; set; }
    public Guid LicensePackageId { get; set; }
    public string LicensePackageName { get; set; } = string.Empty;
    public string LicensePackageCode { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTenantLicenseRequest
{
    public Guid TenantId { get; set; }
    public Guid LicensePackageId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime ExpiryDate { get; set; }
}

public class UpdateTenantLicenseRequest
{
    public DateTime StartDate { get; set; }
    public DateTime ExpiryDate { get; set; }
}

