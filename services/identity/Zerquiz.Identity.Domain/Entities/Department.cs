using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentDepartmentId { get; set; }
    public int DisplayOrder { get; set; }
    
    // Navigation
    public Department? ParentDepartment { get; set; }
    public ICollection<Department> SubDepartments { get; set; } = new List<Department>();
    public ICollection<User> Users { get; set; } = new List<User>();
}

