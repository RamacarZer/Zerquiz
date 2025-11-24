using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Application.Interfaces;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Shared.Common.Extensions;

namespace Zerquiz.Core.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly CoreDbContext _context;

    public TenantService(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<Tenant?> GetBySlugAsync(string slug)
    {
        return await _context.Tenants
            .FirstOrDefaultAsync(t => t.Slug == slug.ToLowerInvariant());
    }

    public async Task<Tenant?> GetByIdAsync(Guid id)
    {
        return await _context.Tenants.FindAsync(id);
    }

    public async Task<Tenant> CreateAsync(string name, string slug, string? customDomain = null)
    {
        var tenant = new Tenant
        {
            Name = name,
            Slug = slug.ToSlug(),
            CustomDomain = customDomain,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        return tenant;
    }

    public async Task<Tenant> UpdateAsync(Guid id, string name, bool isActive, TenantSettings? settings = null)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null)
            throw new KeyNotFoundException($"Tenant with ID {id} not found");

        tenant.Name = name;
        tenant.IsActive = isActive;
        if (settings != null)
            tenant.Settings = settings;
        tenant.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return tenant;
    }

    public async Task<List<Tenant>> GetAllAsync()
    {
        return await _context.Tenants
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null)
            throw new KeyNotFoundException($"Tenant with ID {id} not found");

        tenant.DeletedAt = DateTime.UtcNow;
        tenant.IsActive = false;
        await _context.SaveChangesAsync();
    }
}

