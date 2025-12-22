using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuSeedController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<MenuSeedController> _logger;

    public MenuSeedController(CoreDbContext context, ILogger<MenuSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("seed-basic-menu")]
    public async Task<IActionResult> SeedBasicMenu()
    {
        try
        {
            var now = DateTime.UtcNow;

            // 1. Create Module
            var dashboardModule = await _context.Modules.FirstOrDefaultAsync(m => m.Code == "DASHBOARD");
            if (dashboardModule == null)
            {
                dashboardModule = new Module
                {
                    Id = Guid.NewGuid(),
                    Code = "DASHBOARD",
                    Name = "Dashboard",
                    Description = "Main Dashboard Module",
                    IconName = "LayoutDashboard",
                    IsActive = true,
                    RequiresLicense = false,
                    DisplayOrder = 1,
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await _context.Modules.AddAsync(dashboardModule);
                await _context.SaveChangesAsync();
            }

            // 2. Create Menu Items
            if (!await _context.MenuItems.AnyAsync())
            {
                var menuItems = new List<MenuItem>
                {
                    new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Code = "DASHBOARD",
                        Label = "Dashboard",
                        IconName = "LayoutDashboard",
                        Path = "/dashboard",
                        DisplayOrder = 1,
                        Level = 0,
                        MenuType = "link",
                        IsActive = true,
                        ModuleId = dashboardModule.Id,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Code = "CONTENT",
                        Label = "İçerik Kütüphanesi",
                        IconName = "BookOpen",
                        Path = "/content-library",
                        DisplayOrder = 2,
                        Level = 0,
                        MenuType = "link",
                        IsActive = true,
                        ModuleId = dashboardModule.Id,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Code = "QUESTIONS",
                        Label = "Soru Bankası",
                        IconName = "HelpCircle",
                        Path = "/questions",
                        DisplayOrder = 3,
                        Level = 0,
                        MenuType = "link",
                        IsActive = true,
                        ModuleId = dashboardModule.Id,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Code = "EXAMS",
                        Label = "Sınavlar",
                        IconName = "FileText",
                        Path = "/exams",
                        DisplayOrder = 4,
                        Level = 0,
                        MenuType = "link",
                        IsActive = true,
                        ModuleId = dashboardModule.Id,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Code = "CURRICULUM",
                        Label = "Müfredat",
                        IconName = "BookMarked",
                        Path = "/curriculum",
                        DisplayOrder = 5,
                        Level = 0,
                        MenuType = "link",
                        IsActive = true,
                        ModuleId = dashboardModule.Id,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };

                await _context.MenuItems.AddRangeAsync(menuItems);
            }

            // 3. TenantModule is optional - skip for now since we want global menu

            // 4. Create Database Function (if not exists)
            await CreateGetUserMenuFunction();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Menu seed completed successfully!",
                modules = await _context.Modules.CountAsync(),
                menuItems = await _context.MenuItems.CountAsync(),
                tenantModules = await _context.TenantModules.CountAsync()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding menu");
            return StatusCode(500, new
            {
                error = ex.Message,
                innerError = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    private async Task CreateGetUserMenuFunction()
    {
        try
        {
            var sql = @"
CREATE OR REPLACE FUNCTION core_schema.get_user_menu(
    p_user_id uuid,
    p_language text DEFAULT 'tr'
)
RETURNS TABLE (
    menu_id uuid,
    menu_code text,
    parent_menu_id uuid,
    label text,
    icon_name text,
    path text,
    display_order integer,
    level integer,
    menu_type text,
    badge_text text,
    badge_color text,
    has_children boolean,
    module_code text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id as menu_id,
        mi.code as menu_code,
        mi.parent_menu_id,
        COALESCE(mit.label, mi.label) as label,
        mi.icon_name,
        mi.path,
        mi.display_order,
        mi.level,
        mi.menu_type,
        COALESCE(mit.badge_text, mi.badge_text) as badge_text,
        mi.badge_color,
        EXISTS(SELECT 1 FROM core_schema.menu_items child WHERE child.parent_menu_id = mi.id) as has_children,
        m.code as module_code
    FROM core_schema.menu_items mi
    INNER JOIN core_schema.modules m ON mi.module_id = m.id
    LEFT JOIN core_schema.menu_item_translations mit ON mi.id = mit.menu_item_id AND mit.language_code = p_language
    WHERE mi.is_active = true
      AND mi.deleted_at IS NULL
      AND m.is_active = true
    ORDER BY mi.display_order, mi.level;
END;
$$;
";
            await _context.Database.ExecuteSqlRawAsync(sql);
            _logger.LogInformation("Created get_user_menu function successfully");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Function might already exist or error creating it");
        }
    }
}

