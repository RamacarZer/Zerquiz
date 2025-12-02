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
    /// Get user's menu - 100% dynamic from database
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

            // Call database function to get user's menu
            var menuItems = await _context.Database
                .SqlQueryRaw<MenuItemDto>(@"
                    SELECT * FROM core_schema.get_user_menu({0}, {1})",
                    userId, language)
                .ToListAsync();

            // Build hierarchical structure
            var rootItems = menuItems.Where(m => m.parent_menu_id == null).ToList();
            var response = new UserMenuResponse
            {
                Items = BuildMenuTree(rootItems, menuItems),
                TotalCount = menuItems.Count,
                Language = language
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user menu");
            return StatusCode(500, "Internal server error");
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
}

// ============================================
// DTOs
// ============================================

public class UserMenuResponse
{
    public List<MenuItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public string Language { get; set; } = "en";
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

