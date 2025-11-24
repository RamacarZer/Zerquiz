using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? IdentityNumber { get; set; } // TC Kimlik No
    
    // Departman ve Pozisyon
    public Guid? DepartmentId { get; set; }
    public Guid? PositionId { get; set; }
    public Guid? PrimaryRoleId { get; set; } // Ana rol (dropdown'dan seçilecek)
    
    // IsActive inherited from BaseEntity
    public bool EmailConfirmed { get; set; } = false;
    public string? ProfileJson { get; set; } // JSONB - UserProfile serialized
    
    // Navigation Properties
    public Department? Department { get; set; }
    public Position? Position { get; set; }
    public Role? PrimaryRole { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class UserProfile
{
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public Dictionary<string, object> CustomFields { get; set; } = new();
}


