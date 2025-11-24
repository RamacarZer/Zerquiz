using Microsoft.AspNetCore.Mvc;
using Zerquiz.Core.Application.DTOs;
using Zerquiz.Core.Application.Interfaces;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly ITenantService _tenantService;

    public TenantsController(ITenantService tenantService)
    {
        _tenantService = tenantService;
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
            var tenant = await _tenantService.UpdateAsync(id, request.Name, request.IsActive, request.Settings);

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

            return Ok(ApiResponse<TenantDto>.SuccessResult(dto, "Tenant updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<TenantDto>.ErrorResult(ex.Message));
        }
    }
}

