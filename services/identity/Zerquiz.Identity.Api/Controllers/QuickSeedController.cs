using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Zerquiz.Identity.Infrastructure.Persistence;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/quick-seed")]
public class QuickSeedController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public QuickSeedController(IdentityDbContext context)
    {
        _context = context;
    }

    [HttpPost("all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // Roles
            if (!_context.Roles.Any())
            {
                var roles = new[]
                {
                    new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "SuperAdmin", NormalizedName = "SUPERADMIN" },
                    new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Admin", NormalizedName = "ADMIN" },
                    new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Teacher", NormalizedName = "TEACHER" },
                    new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Student", NormalizedName = "STUDENT" }
                };
                _context.Roles.AddRange(roles);
            }

            // Users (simplified - without password hashing for demo)
            if (!_context.Users.Any())
            {
                var users = new[]
                {
                    new IdentityUser { 
                        Id = Guid.NewGuid().ToString(), 
                        UserName = "admin@zerquiz.com", 
                        NormalizedUserName = "ADMIN@ZERQUIZ.COM",
                        Email = "admin@zerquiz.com",
                        NormalizedEmail = "ADMIN@ZERQUIZ.COM",
                        EmailConfirmed = true
                    },
                    new IdentityUser { 
                        Id = Guid.NewGuid().ToString(), 
                        UserName = "teacher@zerquiz.com", 
                        NormalizedUserName = "TEACHER@ZERQUIZ.COM",
                        Email = "teacher@zerquiz.com",
                        NormalizedEmail = "TEACHER@ZERQUIZ.COM",
                        EmailConfirmed = true
                    },
                    new IdentityUser { 
                        Id = Guid.NewGuid().ToString(), 
                        UserName = "student@zerquiz.com", 
                        NormalizedUserName = "STUDENT@ZERQUIZ.COM",
                        Email = "student@zerquiz.com",
                        NormalizedEmail = "STUDENT@ZERQUIZ.COM",
                        EmailConfirmed = true
                    }
                };
                _context.Users.AddRange(users);
            }

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                roles = _context.Roles.Count(),
                users = _context.Users.Count()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
        }
    }
}

