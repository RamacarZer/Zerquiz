using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Core.Domain.Entities;
using System.Security.Claims;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MenuController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<MenuController> _logger;

    public MenuController(CoreDbContext context, ILogger<MenuController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get user's menu - 100% dynamic from database with role-based filtering
    /// </summary>
    [HttpGet("user-menu")]
    public async Task<ActionResult<UserMenuResponse>> GetUserMenu([FromQuery] string language = "en")
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized("User ID not found");
            }

            var tenantId = GetTenantId();
            var userRoles = GetUserRoles();

            _logger.LogInformation("Getting menu for user {UserId} with roles: {Roles}", userId, string.Join(", ", userRoles));

            // SuperAdmin sees everything, no filtering needed
            bool isSuperAdmin = userRoles.Contains("SuperAdmin", StringComparer.OrdinalIgnoreCase);

            // Get menu items with role-based filtering
            var query = _context.MenuItems
                .Include(m => m.Module)
                .Include(m => m.Translations)
                .Include(m => m.Permissions)
                .Where(m => m.IsActive && m.IsVisible)
                .AsQueryable();

            // Apply role-based filtering (SuperAdmin bypasses this)
            if (!isSuperAdmin)
            {
                query = query.Where(m =>
                    // Either no permissions defined (public menu) or user has matching role
                    !m.Permissions.Any() ||
                    m.Permissions.Any(p => 
                        userRoles.Contains(GetRoleName(p.RoleId)) && 
                        p.CanView == true
                    )
                );
            }

            // Apply tenant module filtering
            if (tenantId.HasValue && !isSuperAdmin)
            {
                query = query.Where(m =>
                    m.ModuleId == null || // System menus without module
                    _context.Set<TenantModule>().Any(tm =>
                        tm.TenantId == tenantId &&
                        tm.ModuleId == m.ModuleId &&
                        tm.IsEnabled &&
                        (tm.ExpiresAt == null || tm.ExpiresAt > DateTime.UtcNow)
                    )
                );
            }

            var menuItems = await query
                .OrderBy(m => m.DisplayOrder)
                .ThenBy(m => m.Level)
                .Select(m => new MenuItemDto
                {
                    menu_id = m.Id,
                    menu_code = m.Code,
                    parent_menu_id = m.ParentMenuId,
                    label = m.Translations.FirstOrDefault(t => t.LanguageCode == language) != null 
                        ? m.Translations.First(t => t.LanguageCode == language).Label 
                        : m.Label,
                    icon_name = m.IconName,
                    path = m.Path,
                    display_order = m.DisplayOrder,
                    level = m.Level,
                    menu_type = m.MenuType,
                    badge_text = m.BadgeText,
                    badge_color = m.BadgeColor,
                    has_children = _context.MenuItems.Any(child => child.ParentMenuId == m.Id),
                    module_code = m.Module != null ? m.Module.Code : null
                })
                .ToListAsync();

            _logger.LogInformation("Found {Count} menu items for user", menuItems.Count);

            // Build hierarchical structure
            var rootItems = menuItems.Where(m => m.parent_menu_id == null).ToList();
            var menuTree = BuildMenuTree(rootItems, menuItems);

            // Filter out parent items with no accessible children
            menuTree = FilterEmptyParents(menuTree);

            var response = new UserMenuResponse
            {
                Items = menuTree,
                TotalCount = menuTree.Count,
                Language = language,
                UserRoles = userRoles
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user menu");
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    /// <summary>
    /// Check if user can access a specific module
    /// </summary>
    [HttpGet("can-access-module/{moduleCode}")]
    public async Task<ActionResult<ModuleAccessResponse>> CanAccessModule(string moduleCode)
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var canAccess = await _context.Database
                .SqlQueryRaw<bool>(@"
                    SELECT core_schema.can_user_access_module({0}, {1})",
                    userId, moduleCode)
                .FirstOrDefaultAsync();

            return Ok(new ModuleAccessResponse
            {
                ModuleCode = moduleCode,
                CanAccess = canAccess,
                UserId = userId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking module access for {ModuleCode}", moduleCode);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get all available modules (SuperAdmin only)
    /// </summary>
    [HttpGet("modules")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<List<ModuleDto>>> GetModules()
    {
        try
        {
            var modules = await _context.Set<Module>()
                .OrderBy(m => m.DisplayOrder)
                .Select(m => new ModuleDto
                {
                    Id = m.Id,
                    Code = m.Code,
                    Name = m.Name,
                    Description = m.Description,
                    IconName = m.IconName,
                    IsActive = m.IsActive,
                    RequiresLicense = m.RequiresLicense,
                    DisplayOrder = m.DisplayOrder
                })
                .ToListAsync();

            return Ok(modules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting modules");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get tenant's enabled modules
    /// </summary>
    [HttpGet("tenant-modules")]
    public async Task<ActionResult<List<TenantModuleDto>>> GetTenantModules()
    {
        try
        {
            var tenantId = GetTenantId();
            if (tenantId == null)
            {
                return BadRequest("Tenant ID not found");
            }

            var tenantModules = await _context.Set<TenantModule>()
                .Include(tm => tm.Module)
                .Where(tm => tm.TenantId == tenantId)
                .Select(tm => new TenantModuleDto
                {
                    ModuleCode = tm.Module.Code,
                    ModuleName = tm.Module.Name,
                    IsEnabled = tm.IsEnabled,
                    ExpiresAt = tm.ExpiresAt,
                    EnabledAt = tm.EnabledAt
                })
                .ToListAsync();

            return Ok(tenantModules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tenant modules");
            return StatusCode(500, "Internal server error");
        }
    }

    // Helper methods
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value 
                          ?? User.FindFirst("userId")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private Guid? GetTenantId()
    {
        var tenantIdClaim = User.FindFirst("tenantId")?.Value;
        return Guid.TryParse(tenantIdClaim, out var tenantId) ? tenantId : null;
    }

    private List<string> GetUserRoles()
    {
        var roles = User.FindAll(ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        // Also check for "role" claim (some JWT tokens use this)
        var rolesClaim = User.FindAll("role")
            .Select(c => c.Value)
            .ToList();

        return roles.Concat(rolesClaim).Distinct().ToList();
    }

    private string GetRoleName(Guid? roleId)
    {
        if (!roleId.HasValue) return string.Empty;
        
        // Cache role names to avoid repeated DB queries
        var roleName = _context.Database
            .SqlQuery<string>($"SELECT \"Name\" FROM identity_schema.roles WHERE \"Id\" = {roleId}")
            .FirstOrDefault();
        
        return roleName ?? string.Empty;
    }

    private List<MenuItemDto> BuildMenuTree(List<MenuItemDto> items, List<MenuItemDto> allItems)
    {
        foreach (var item in items)
        {
            item.children = BuildMenuTree(
                allItems.Where(m => m.parent_menu_id == item.menu_id).ToList(),
                allItems
            );
        }
        return items;
    }

    private List<MenuItemDto> FilterEmptyParents(List<MenuItemDto> items)
    {
        var result = new List<MenuItemDto>();
        
        foreach (var item in items)
        {
            // Recursively filter children
            if (item.children.Any())
            {
                item.children = FilterEmptyParents(item.children);
            }

            // Include if: it's a leaf node, or it has accessible children
            if (!item.has_children || item.children.Any())
            {
                result.Add(item);
            }
        }
        
        return result;
    }
}

// ============================================
// DTOs
// ============================================

public class UserMenuResponse
{
    public List<MenuItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public string Language { get; set; } = "en";
    public List<string> UserRoles { get; set; } = new();
}

public class MenuItemDto
{
    public Guid menu_id { get; set; }
    public string menu_code { get; set; } = string.Empty;
    public Guid? parent_menu_id { get; set; }
    public string label { get; set; } = string.Empty;
    public string? icon_name { get; set; }
    public string? path { get; set; }
    public int display_order { get; set; }
    public int level { get; set; }
    public string menu_type { get; set; } = "link";
    public string? badge_text { get; set; }
    public string? badge_color { get; set; }
    public bool has_children { get; set; }
    public string? module_code { get; set; }
    public List<MenuItemDto> children { get; set; } = new();
}

public class ModuleAccessResponse
{
    public string ModuleCode { get; set; } = string.Empty;
    public bool CanAccess { get; set; }
    public Guid UserId { get; set; }
}

public class ModuleDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public bool IsActive { get; set; }
    public bool RequiresLicense { get; set; }
    public int DisplayOrder { get; set; }
}

public class TenantModuleDto
{
    public string ModuleCode { get; set; } = string.Empty;
    public string ModuleName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime? EnabledAt { get; set; }
}

