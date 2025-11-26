using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
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
            if (!await _context.Roles.AnyAsync())
            {
                var roles = new[]
                {
                    new Role { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Name = "SuperAdmin", 
                        Description = "Super Administrator",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new Role { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Name = "Admin", 
                        Description = "Administrator",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new Role { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Name = "Teacher", 
                        Description = "Teacher/Instructor",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new Role { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Name = "Student", 
                        Description = "Student",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };
                await _context.Roles.AddRangeAsync(roles);
            }

            // Users (simplified - without password hashing for demo)
            if (!await _context.Users.AnyAsync())
            {
                var users = new[]
                {
                    new User { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Email = "admin@zerquiz.com",
                        FirstName = "Admin",
                        LastName = "User",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new User { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Email = "teacher@zerquiz.com",
                        FirstName = "Teacher",
                        LastName = "User",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new User { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId,
                        Email = "student@zerquiz.com",
                        FirstName = "Student",
                        LastName = "User",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };
                await _context.Users.AddRangeAsync(users);
            }

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                roles = await _context.Roles.CountAsync(),
                users = await _context.Users.CountAsync()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
        }
    }
}

