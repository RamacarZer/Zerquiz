using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Identity.Infrastructure.Persistence;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/seed")]
public class SeedController : ControllerBase
{
    private readonly IdentityDbContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(IdentityDbContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("roles")]
    public async Task<IActionResult> SeedRoles()
    {
        try
        {
            if (await _context.Roles.AnyAsync())
            {
                return Ok(new { message = "Roles already seeded" });
            }

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            var roles = new[]
            {
                new Role { Id = Guid.NewGuid(), TenantId = tenantId, Name = "SuperAdmin", Description = "Super Administrator", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Role { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Admin", Description = "Administrator", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Role { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Teacher", Description = "Teacher/Instructor", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Role { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Student", Description = "Student", IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.Roles.AddRangeAsync(roles);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Roles seeded successfully", count = roles.Length });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding roles");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("departments")]
    public async Task<IActionResult> SeedDepartments()
    {
        try
        {
            if (await _context.Departments.AnyAsync())
            {
                return Ok(new { message = "Departments already seeded" });
            }

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            var departments = new[]
            {
                new Department { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Matematik", Code = "MATH", DisplayOrder = 1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Department { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Fen Bilimleri", Code = "SCI", DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Department { Id = Guid.NewGuid(), TenantId = tenantId, Name = "İngilizce", Code = "ENG", DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Department { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Türkçe", Code = "TUR", DisplayOrder = 4, IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.Departments.AddRangeAsync(departments);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Departments seeded successfully", count = departments.Length });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding departments");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("positions")]
    public async Task<IActionResult> SeedPositions()
    {
        try
        {
            if (await _context.Positions.AnyAsync())
            {
                return Ok(new { message = "Positions already seeded" });
            }

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            var positions = new[]
            {
                new Position { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Müdür", Code = "DIRECTOR", Level = 1, DisplayOrder = 1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Position { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Müdür Yardımcısı", Code = "VICE_DIRECTOR", Level = 2, DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Position { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Öğretmen", Code = "TEACHER", Level = 3, DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Position { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Stajyer Öğretmen", Code = "INTERN_TEACHER", Level = 4, DisplayOrder = 4, IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.Positions.AddRangeAsync(positions);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Positions seeded successfully", count = positions.Length });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding positions");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("demo-users")]
    public async Task<IActionResult> SeedDemoUsers()
    {
        try
        {
            if (await _context.Users.AnyAsync())
            {
                return Ok(new { message = "Demo users already seeded" });
            }

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            var users = new[]
            {
                new User { Id = Guid.NewGuid(), TenantId = tenantId, Email = "admin@zerquiz.com", FirstName = "Admin", LastName = "User", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new User { Id = Guid.NewGuid(), TenantId = tenantId, Email = "teacher@zerquiz.com", FirstName = "Teacher", LastName = "User", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new User { Id = Guid.NewGuid(), TenantId = tenantId, Email = "student@zerquiz.com", FirstName = "Student", LastName = "User", IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Demo users seeded successfully", count = users.Length });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding demo users");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

