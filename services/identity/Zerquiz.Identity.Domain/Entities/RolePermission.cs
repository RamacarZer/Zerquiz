using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

/// <summary>
/// Role-Permission mapping (many-to-many)
/// </summary>
public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
    
    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
    
    // Optional constraints
    public bool IsGranted { get; set; } = true; // Can explicitly deny
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
}

