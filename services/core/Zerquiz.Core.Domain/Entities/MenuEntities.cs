namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Module - Top-level feature module (matches core_schema.modules exactly)
/// </summary>
public class Module
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public int DisplayOrder { get; set; }
    public Guid? ParentModuleId { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsSystemReserved { get; set; } = false;
    public bool RequiresLicense { get; set; } = false;
    public string? LicenseFeatureCode { get; set; }
    public string? Version { get; set; } = "1.0";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    public Guid? TenantId { get; set; }
    
    // Navigation properties
    public virtual Module? ParentModule { get; set; }
    public virtual ICollection<Module> ChildModules { get; set; } = new List<Module>();
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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual Module Module { get; set; } = null!;
}

/// <summary>
/// MenuItem - Individual menu item (matches core_schema.menu_items exactly)
/// </summary>
public class MenuItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public Guid? ModuleId { get; set; }
    public Guid? ParentMenuId { get; set; }
    public string Label { get; set; } = string.Empty; // LabelKey from DB
    public string? IconName { get; set; }
    public string? Path { get; set; }
    public int DisplayOrder { get; set; }
    public int Level { get; set; } = 0;
    public string MenuType { get; set; } = "link"; // link, dropdown, divider, group
    public string? BadgeText { get; set; }
    public string? BadgeColor { get; set; }
    public bool IsVisible { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public bool IsSystemReserved { get; set; } = false;
    public bool OpenInNewTab { get; set; } = false;
    public string? CssClass { get; set; }
    public string? Metadata { get; set; } // JSONB as string
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    public Guid? TenantId { get; set; }
    
    // Navigation properties
    public virtual Module? Module { get; set; }
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
    public string? Description { get; set; }
    public string? Tooltip { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual MenuItem MenuItem { get; set; } = null!;
}

/// <summary>
/// MenuPermission - Role-based menu access control
/// </summary>
public class MenuPermission
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public Guid? RoleId { get; set; }
    public bool CanView { get; set; } = true;
    public bool CanAccess { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    
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
