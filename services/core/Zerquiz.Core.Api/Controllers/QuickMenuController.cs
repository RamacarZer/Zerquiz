using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuickMenuController : ControllerBase
{
    private readonly ILogger<QuickMenuController> _logger;

    public QuickMenuController(ILogger<QuickMenuController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get hardcoded menu for admin - Quick fix
    /// </summary>
    [HttpGet("admin-menu")]
    [AllowAnonymous] // Temporarily allow anonymous for testing
    public IActionResult GetAdminMenu([FromQuery] string language = "tr")
    {
        var menuItems = new[]
        {
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "DASHBOARD",
                parent_menu_id = (Guid?)null,
                label = "Dashboard",
                icon_name = "LayoutDashboard",
                path = "/dashboard",
                display_order = 1,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "DASHBOARD"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "CONTENT",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "İçerik Kütüphanesi" : "Content Library",
                icon_name = "BookOpen",
                path = "/content-library",
                display_order = 2,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "CONTENT"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "QUESTIONS",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Soru Bankası" : "Questions",
                icon_name = "HelpCircle",
                path = "/questions",
                display_order = 3,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "QUESTIONS"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "EXAMS",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Sınavlar" : "Exams",
                icon_name = "FileText",
                path = "/exams",
                display_order = 4,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "EXAMS"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "CURRICULUM",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Müfredat" : "Curriculum",
                icon_name = "BookMarked",
                path = "/curriculum",
                display_order = 5,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "CURRICULUM"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "LESSONS",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Ders Planları" : "Lesson Plans",
                icon_name = "Calendar",
                path = "/lessons",
                display_order = 6,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "LESSONS"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "GRADING",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Değerlendirme" : "Grading",
                icon_name = "Award",
                path = "/grading",
                display_order = 7,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "GRADING"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "USERS",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Kullanıcılar" : "Users",
                icon_name = "Users",
                path = "/users",
                display_order = 8,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "IDENTITY"
            },
            new
            {
                menu_id = Guid.NewGuid(),
                menu_code = "SETTINGS",
                parent_menu_id = (Guid?)null,
                label = language == "tr" ? "Ayarlar" : "Settings",
                icon_name = "Settings",
                path = "/settings",
                display_order = 9,
                level = 0,
                menu_type = "link",
                badge_text = (string?)null,
                badge_color = (string?)null,
                has_children = false,
                module_code = "CORE"
            }
        };

        var response = new
        {
            Items = menuItems,
            TotalCount = menuItems.Length,
            Language = language
        };

        return Ok(response);
    }
}

