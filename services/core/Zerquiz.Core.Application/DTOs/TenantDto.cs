using Zerquiz.Core.Domain.Entities;

namespace Zerquiz.Core.Application.DTOs;

public class TenantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
    public bool IsActive { get; set; }
    public TenantSettings Settings { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
}

public class UpdateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public TenantSettings? Settings { get; set; }
}

