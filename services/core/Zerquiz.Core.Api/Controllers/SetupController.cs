using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Core.Domain.Entities;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<SetupController> _logger;

    public SetupController(CoreDbContext context, ILogger<SetupController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("initialize-menu-system")]
    public async Task<IActionResult> InitializeMenuSystem()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // 1. Create function
            await _context.Database.ExecuteSqlRawAsync(@"
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
        EXISTS(SELECT 1 FROM core_schema.menu_items child WHERE child.parent_menu_id = mi.id AND child.deleted_at IS NULL) as has_children,
        m.code as module_code
    FROM core_schema.menu_items mi
    INNER JOIN core_schema.modules m ON mi.module_id = m.id AND m.deleted_at IS NULL
    LEFT JOIN core_schema.menu_item_translations mit ON mi.id = mit.menu_item_id AND mit.language_code = p_language
    WHERE mi.is_active = true
      AND mi.deleted_at IS NULL
      AND m.is_active = true
    ORDER BY mi.display_order, mi.level;
END;
$$;
            ");

            // 2. Insert Modules
            var modules = new[]
            {
                new Module { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Code = "DASHBOARD", Name = "Dashboard", Description = "Ana Panel", IconName = "LayoutDashboard", IsActive = true, RequiresLicense = false, DisplayOrder = 1, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Code = "CONTENT", Name = "Content Management", Description = "İçerik Yönetimi", IconName = "BookOpen", IsActive = true, RequiresLicense = false, DisplayOrder = 2, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Code = "QUESTIONS", Name = "Question Bank", Description = "Soru Bankası", IconName = "HelpCircle", IsActive = true, RequiresLicense = false, DisplayOrder = 3, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Code = "EXAMS", Name = "Exams", Description = "Sınav Yönetimi", IconName = "FileText", IsActive = true, RequiresLicense = false, DisplayOrder = 4, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Code = "CURRICULUM", Name = "Curriculum", Description = "Müfredat", IconName = "BookMarked", IsActive = true, RequiresLicense = false, DisplayOrder = 5, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Code = "LESSONS", Name = "Lesson Plans", Description = "Ders Planları", IconName = "Calendar", IsActive = true, RequiresLicense = false, DisplayOrder = 6, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), Code = "GRADING", Name = "Grading", Description = "Değerlendirme", IconName = "Award", IsActive = true, RequiresLicense = false, DisplayOrder = 7, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("88888888-8888-8888-8888-888888888888"), Code = "IDENTITY", Name = "User Management", Description = "Kullanıcı Yönetimi", IconName = "Users", IsActive = true, RequiresLicense = false, DisplayOrder = 8, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new Module { Id = Guid.Parse("99999999-9999-9999-9999-999999999999"), Code = "CORE", Name = "Settings", Description = "Ayarlar", IconName = "Settings", IsActive = true, RequiresLicense = false, DisplayOrder = 9, TenantId = tenantId, CreatedAt = now, UpdatedAt = now }
            };

            foreach (var module in modules)
            {
                if (!await _context.Modules.AnyAsync(m => m.Id == module.Id))
                {
                    _context.Modules.Add(module);
                }
            }
            await _context.SaveChangesAsync();

            // 3. Insert Menu Items
            var menuItems = new[]
            {
                new MenuItem { Id = Guid.Parse("d1111111-1111-1111-1111-111111111111"), ModuleId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Code = "DASHBOARD", Label = "Dashboard", IconName = "LayoutDashboard", Path = "/dashboard", DisplayOrder = 1, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d2222222-2222-2222-2222-222222222222"), ModuleId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Code = "CONTENT_LIBRARY", Label = "İçerik Kütüphanesi", IconName = "BookOpen", Path = "/content-library", DisplayOrder = 2, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d3333333-3333-3333-3333-333333333333"), ModuleId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Code = "QUESTIONS", Label = "Soru Bankası", IconName = "HelpCircle", Path = "/questions", DisplayOrder = 3, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d4444444-4444-4444-4444-444444444444"), ModuleId = Guid.Parse("44444444-4444-4444-4444-444444444444"), Code = "EXAMS", Label = "Sınavlar", IconName = "FileText", Path = "/exams", DisplayOrder = 4, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d5555555-5555-5555-5555-555555555555"), ModuleId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Code = "CURRICULUM", Label = "Müfredat", IconName = "BookMarked", Path = "/curriculum", DisplayOrder = 5, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d6666666-6666-6666-6666-666666666666"), ModuleId = Guid.Parse("66666666-6666-6666-6666-666666666666"), Code = "LESSONS", Label = "Ders Planları", IconName = "Calendar", Path = "/lessons", DisplayOrder = 6, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d7777777-7777-7777-7777-777777777777"), ModuleId = Guid.Parse("77777777-7777-7777-7777-777777777777"), Code = "GRADING", Label = "Değerlendirme", IconName = "Award", Path = "/grading", DisplayOrder = 7, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d8888888-8888-8888-8888-888888888888"), ModuleId = Guid.Parse("88888888-8888-8888-8888-888888888888"), Code = "USERS", Label = "Kullanıcılar", IconName = "Users", Path = "/users", DisplayOrder = 8, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now },
                new MenuItem { Id = Guid.Parse("d9999999-9999-9999-9999-999999999999"), ModuleId = Guid.Parse("99999999-9999-9999-9999-999999999999"), Code = "SETTINGS", Label = "Ayarlar", IconName = "Settings", Path = "/settings", DisplayOrder = 9, Level = 0, MenuType = "link", IsActive = true, TenantId = tenantId, CreatedAt = now, UpdatedAt = now }
            };

            foreach (var menuItem in menuItems)
            {
                if (!await _context.MenuItems.AnyAsync(m => m.Id == menuItem.Id))
                {
                    _context.MenuItems.Add(menuItem);
                }
            }
            await _context.SaveChangesAsync();

            // 4. Enable modules for tenant
            foreach (var module in modules)
            {
                if (!await _context.TenantModules.AnyAsync(tm => tm.TenantId == tenantId && tm.ModuleId == module.Id))
                {
                    _context.TenantModules.Add(new TenantModule
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        ModuleId = module.Id,
                        IsEnabled = true,
                        EnabledAt = now
                    });
                }
            }
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Menu system initialized successfully",
                modules = modules.Length,
                menuItems = menuItems.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing menu system");
            return StatusCode(500, new
            {
                error = ex.Message,
                innerError = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
}

