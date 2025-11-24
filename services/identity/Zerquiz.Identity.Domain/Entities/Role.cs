using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Student, Teacher, Admin, etc.
    public string? Description { get; set; }
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

