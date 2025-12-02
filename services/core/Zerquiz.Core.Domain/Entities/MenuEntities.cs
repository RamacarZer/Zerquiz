using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Module - Top-level feature module
/// </summary>
public class Module : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public int DisplayOrder { get; set; }
    // IsActive inherited from BaseEntity
    public bool RequiresLicense { get; set; } = false;
    
    // Navigation properties
    public virtual ICollection<ModuleTranslation> Translations { get; set; } = new List<ModuleTranslation>();
    public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    public virtual ICollection<TenantModule> TenantModules { get; set; } = new List<TenantModule>();
}

/// <summary>
/// ModuleTranslation - Multi-language translations for modules
/// </summary>
public class ModuleTranslation
{
    public Guid Id { get; set; }
    public Guid ModuleId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public virtual Module Module { get; set; } = null!;
}

/// <summary>
/// MenuItem - Individual menu item
/// </summary>
public class MenuItem : BaseEntity
{
    // ModuleId inherited from BaseEntity
    public string Code { get; set; } = string.Empty;
    public Guid? ParentMenuId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string? IconName { get; set; }
    public string? Path { get; set; }
    public int DisplayOrder { get; set; }
    public int Level { get; set; } = 0;
    public string MenuType { get; set; } = "link"; // link, dropdown, divider, group
    public string? BadgeText { get; set; }
    public string? BadgeColor { get; set; }
    // IsActive inherited from BaseEntity
    
    // Navigation properties
    public virtual Module Module { get; set; } = null!;
    public virtual MenuItem? ParentMenu { get; set; }
    public virtual ICollection<MenuItem> ChildMenus { get; set; } = new List<MenuItem>();
    public virtual ICollection<MenuItemTranslation> Translations { get; set; } = new List<MenuItemTranslation>();
    public virtual ICollection<MenuPermission> Permissions { get; set; } = new List<MenuPermission>();
}

/// <summary>
/// MenuItemTranslation - Multi-language translations for menu items
/// </summary>
public class MenuItemTranslation
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? BadgeText { get; set; }
    
    public virtual MenuItem MenuItem { get; set; } = null!;
}

/// <summary>
/// MenuPermission - Role-based menu access control
/// </summary>
public class MenuPermission
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public bool CanView { get; set; } = true;
    public bool CanEdit { get; set; } = false;
    public bool CanDelete { get; set; } = false;
    
    public virtual MenuItem MenuItem { get; set; } = null!;
}

/// <summary>
/// TenantModule - Tenant-specific module enablement
/// </summary>
public class TenantModule
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid ModuleId { get; set; }
    public bool IsEnabled { get; set; } = true;
    public DateTime? EnabledAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    
    // Navigation properties
    public virtual Module Module { get; set; } = null!;
}

/// <summary>
/// UserModulePermission - User-specific module overrides
/// </summary>
public class UserModulePermission
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ModuleId { get; set; }
    public bool CanAccess { get; set; } = true;
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public Guid? GrantedBy { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    public virtual Module Module { get; set; } = null!;
}
