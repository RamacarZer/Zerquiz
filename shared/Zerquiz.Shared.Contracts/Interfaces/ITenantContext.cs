namespace Zerquiz.Shared.Contracts.Interfaces;

/// <summary>
/// Tenant context interface for accessing current tenant information
/// </summary>
public interface ITenantContext
{
    Guid TenantId { get; }
    string TenantSlug { get; }
    bool IsResolved { get; }
}

