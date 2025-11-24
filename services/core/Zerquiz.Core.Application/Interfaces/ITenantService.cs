using Zerquiz.Core.Domain.Entities;

namespace Zerquiz.Core.Application.Interfaces;

public interface ITenantService
{
    Task<Tenant?> GetBySlugAsync(string slug);
    Task<Tenant?> GetByIdAsync(Guid id);
    Task<Tenant> CreateAsync(string name, string slug, string? customDomain = null);
    Task<Tenant> UpdateAsync(Guid id, string name, bool isActive, TenantSettings? settings = null);
    Task<List<Tenant>> GetAllAsync();
}

