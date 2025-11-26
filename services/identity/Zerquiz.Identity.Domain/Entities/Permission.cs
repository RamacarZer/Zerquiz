using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

/// <summary>
/// Permission for granular access control
/// </summary>
public class Permission : BaseEntity
{
    public string Code { get; set; } = string.Empty; // e.g., "questions.create", "exams.publish"
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Module { get; set; } = string.Empty; // questions, exams, grading, etc.
    public string Action { get; set; } = string.Empty; // create, read, update, delete, publish, approve
    public string? Resource { get; set; } // Optional specific resource
    
    // Grouping
    public string Category { get; set; } = "general"; // admin, content, grading, reporting
    public int DisplayOrder { get; set; }
    
    // Relations
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

