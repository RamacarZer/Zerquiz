using Microsoft.AspNetCore.Mvc;
using Zerquiz.Core.Application.DTOs;
using Zerquiz.Core.Application.Interfaces;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly CoreDbContext _context;

    public TenantsController(ITenantService tenantService, CoreDbContext context)
    {
        _tenantService = tenantService;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TenantDto>>>> GetAll()
    {
        var tenants = await _tenantService.GetAllAsync();
        var dtos = tenants.Select(t => new TenantDto
        {
            Id = t.Id,
            Name = t.Name,
            Slug = t.Slug,
            CustomDomain = t.CustomDomain,
            IsActive = t.IsActive,
            Settings = t.Settings,
            CreatedAt = t.CreatedAt
        }).ToList();

        return Ok(ApiResponse<List<TenantDto>>.SuccessResult(dtos));
    }

    [HttpGet("by-id/{id}")]
    public async Task<ActionResult<ApiResponse<TenantDto>>> GetById(Guid id)
    {
        var tenant = await _tenantService.GetByIdAsync(id);
        if (tenant == null)
            return NotFound(ApiResponse<TenantDto>.ErrorResult("Tenant not found"));

        var dto = new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            CustomDomain = tenant.CustomDomain,
            CompanyName = tenant.CompanyName,
            TaxNumber = tenant.TaxNumber,
            Address = tenant.Address,
            City = tenant.City,
            Country = tenant.Country,
            Phone = tenant.Phone,
            Email = tenant.Email,
            Website = tenant.Website,
            RepresentativeFirstName = tenant.RepresentativeFirstName,
            RepresentativeLastName = tenant.RepresentativeLastName,
            RepresentativeTitle = tenant.RepresentativeTitle,
            RepresentativeEmail = tenant.RepresentativeEmail,
            RepresentativePhone = tenant.RepresentativePhone,
            TechnicalContactFirstName = tenant.TechnicalContactFirstName,
            TechnicalContactLastName = tenant.TechnicalContactLastName,
            TechnicalContactTitle = tenant.TechnicalContactTitle,
            TechnicalContactEmail = tenant.TechnicalContactEmail,
            TechnicalContactPhone = tenant.TechnicalContactPhone,
            SubscriptionStatus = tenant.SubscriptionStatus,
            SubscriptionStartDate = tenant.SubscriptionStartDate,
            SubscriptionEndDate = tenant.SubscriptionEndDate,
            IsActive = tenant.IsActive,
            Settings = tenant.Settings,
            CreatedAt = tenant.CreatedAt
        };

        return Ok(ApiResponse<TenantDto>.SuccessResult(dto));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<TenantDto>>> GetBySlug(string slug)
    {
        var tenant = await _tenantService.GetBySlugAsync(slug);
        if (tenant == null)
            return NotFound(ApiResponse<TenantDto>.ErrorResult("Tenant not found"));

        var dto = new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            CustomDomain = tenant.CustomDomain,
            CompanyName = tenant.CompanyName,
            TaxNumber = tenant.TaxNumber,
            Address = tenant.Address,
            City = tenant.City,
            Country = tenant.Country,
            Phone = tenant.Phone,
            Email = tenant.Email,
            Website = tenant.Website,
            RepresentativeFirstName = tenant.RepresentativeFirstName,
            RepresentativeLastName = tenant.RepresentativeLastName,
            RepresentativeTitle = tenant.RepresentativeTitle,
            RepresentativeEmail = tenant.RepresentativeEmail,
            RepresentativePhone = tenant.RepresentativePhone,
            TechnicalContactFirstName = tenant.TechnicalContactFirstName,
            TechnicalContactLastName = tenant.TechnicalContactLastName,
            TechnicalContactTitle = tenant.TechnicalContactTitle,
            TechnicalContactEmail = tenant.TechnicalContactEmail,
            TechnicalContactPhone = tenant.TechnicalContactPhone,
            SubscriptionStatus = tenant.SubscriptionStatus,
            SubscriptionStartDate = tenant.SubscriptionStartDate,
            SubscriptionEndDate = tenant.SubscriptionEndDate,
            IsActive = tenant.IsActive,
            Settings = tenant.Settings,
            CreatedAt = tenant.CreatedAt
        };

        return Ok(ApiResponse<TenantDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TenantDto>>> Create([FromBody] CreateTenantRequest request)
    {
        var tenant = await _tenantService.CreateAsync(request.Name, request.Slug, request.CustomDomain);

        var dto = new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            CustomDomain = tenant.CustomDomain,
            IsActive = tenant.IsActive,
            Settings = tenant.Settings,
            CreatedAt = tenant.CreatedAt
        };

        return CreatedAtAction(nameof(GetBySlug), new { slug = tenant.Slug }, ApiResponse<TenantDto>.SuccessResult(dto, "Tenant created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TenantDto>>> Update(Guid id, [FromBody] UpdateTenantRequest request)
    {
        try
        {
            var tenant = await _tenantService.GetByIdAsync(id);
            if (tenant == null)
                return NotFound(ApiResponse<TenantDto>.ErrorResult("Tenant not found"));

            // Update all fields
            tenant.Name = request.Name;
            tenant.IsActive = request.IsActive;
            tenant.CompanyName = request.CompanyName;
            tenant.TaxNumber = request.TaxNumber;
            tenant.Address = request.Address;
            tenant.City = request.City;
            tenant.Country = request.Country;
            tenant.Phone = request.Phone;
            tenant.Email = request.Email;
            tenant.Website = request.Website;
            tenant.RepresentativeFirstName = request.RepresentativeFirstName;
            tenant.RepresentativeLastName = request.RepresentativeLastName;
            tenant.RepresentativeTitle = request.RepresentativeTitle;
            tenant.RepresentativeEmail = request.RepresentativeEmail;
            tenant.RepresentativePhone = request.RepresentativePhone;
            tenant.TechnicalContactFirstName = request.TechnicalContactFirstName;
            tenant.TechnicalContactLastName = request.TechnicalContactLastName;
            tenant.TechnicalContactTitle = request.TechnicalContactTitle;
            tenant.TechnicalContactEmail = request.TechnicalContactEmail;
            tenant.TechnicalContactPhone = request.TechnicalContactPhone;
            tenant.SubscriptionStatus = request.SubscriptionStatus ?? tenant.SubscriptionStatus;
            tenant.SubscriptionStartDate = request.SubscriptionStartDate ?? tenant.SubscriptionStartDate;
            tenant.SubscriptionEndDate = request.SubscriptionEndDate ?? tenant.SubscriptionEndDate;
            if (request.Settings != null)
                tenant.Settings = request.Settings;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var dto = new TenantDto
            {
                Id = tenant.Id,
                Name = tenant.Name,
                Slug = tenant.Slug,
                CustomDomain = tenant.CustomDomain,
                CompanyName = tenant.CompanyName,
                TaxNumber = tenant.TaxNumber,
                Address = tenant.Address,
                City = tenant.City,
                Country = tenant.Country,
                Phone = tenant.Phone,
                Email = tenant.Email,
                Website = tenant.Website,
                RepresentativeFirstName = tenant.RepresentativeFirstName,
                RepresentativeLastName = tenant.RepresentativeLastName,
                RepresentativeTitle = tenant.RepresentativeTitle,
                RepresentativeEmail = tenant.RepresentativeEmail,
                RepresentativePhone = tenant.RepresentativePhone,
                TechnicalContactFirstName = tenant.TechnicalContactFirstName,
                TechnicalContactLastName = tenant.TechnicalContactLastName,
                TechnicalContactTitle = tenant.TechnicalContactTitle,
                TechnicalContactEmail = tenant.TechnicalContactEmail,
                TechnicalContactPhone = tenant.TechnicalContactPhone,
                SubscriptionStatus = tenant.SubscriptionStatus,
                SubscriptionStartDate = tenant.SubscriptionStartDate,
                SubscriptionEndDate = tenant.SubscriptionEndDate,
                IsActive = tenant.IsActive,
                Settings = tenant.Settings,
                CreatedAt = tenant.CreatedAt
            };

            return Ok(ApiResponse<TenantDto>.SuccessResult(dto, "Tenant updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<TenantDto>.ErrorResult(ex.Message));
        }
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleStatus(Guid id)
    {
        try
        {
            var tenant = await _tenantService.GetByIdAsync(id);
            if (tenant == null)
                return NotFound(ApiResponse<bool>.ErrorResult("Tenant not found"));

            tenant.IsActive = !tenant.IsActive;
            await _tenantService.UpdateAsync(id, tenant.Name, tenant.IsActive, tenant.Settings);

            return Ok(ApiResponse<bool>.SuccessResult(true, $"Tenant status changed to {(tenant.IsActive ? "Active" : "Inactive")}"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResult(ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        try
        {
            await _tenantService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.SuccessResult(true, "Tenant deleted successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<bool>.ErrorResult(ex.Message));
        }
    }
}

