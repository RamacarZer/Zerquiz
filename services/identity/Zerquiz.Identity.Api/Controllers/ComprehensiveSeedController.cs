using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Identity.Infrastructure.Persistence;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComprehensiveSeedController : ControllerBase
{
    private readonly IdentityDbContext _context;
    private readonly ILogger<ComprehensiveSeedController> _logger;

    public ComprehensiveSeedController(IdentityDbContext context, ILogger<ComprehensiveSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seed complete user management system with roles, departments, positions, and users
    /// </summary>
    [HttpPost("all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // 1. Seed Roles
            var roles = new Dictionary<string, Role>();
            
            var existingRoles = await _context.Roles.ToListAsync();
            foreach (var role in existingRoles)
            {
                roles[role.Name] = role;
            }

            // Add missing roles
            var newRoles = new List<Role>();
            var roleNames = new[] { "SuperAdmin", "Müdür", "Müdür Yardımcısı", "Yayın Koordinatörü", "Editör", "Yazar", "Öğretmen", "Öğrenci", "Veli" };
            
            foreach (var roleName in roleNames)
            {
                if (!roles.ContainsKey(roleName))
                {
                    var newRole = new Role 
                    { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId, 
                        Name = roleName, 
                        Description = GetRoleDescription(roleName), 
                        IsActive = true, 
                        CreatedAt = now, 
                        UpdatedAt = now 
                    };
                    newRoles.Add(newRole);
                    roles[roleName] = newRole;
                }
            }

            if (newRoles.Any())
            {
                await _context.Roles.AddRangeAsync(newRoles);
                await _context.SaveChangesAsync();
            }

            // 2. Seed Departments
            var departments = new Dictionary<string, Department>();
            
            var existingDepts = await _context.Departments.ToListAsync();
            foreach (var dept in existingDepts)
            {
                departments[dept.Code] = dept;
            }

            // Add missing departments
            var newDepartments = new List<Department>();
            var deptData = new Dictionary<string, string>
            {
                { "MGMT", "Yönetim" },
                { "CONTENT", "İçerik Üretim" },
                { "MATH", "Matematik" },
                { "SCI", "Fen Bilimleri" },
                { "SOC", "Sosyal Bilimler" },
                { "LANG", "Dil ve Edebiyat" },
                { "STUDENTS", "Öğrenciler" },
                { "PARENTS", "Veliler" }
            };

            int displayOrder = existingDepts.Count + 1;
            foreach (var kvp in deptData)
            {
                if (!departments.ContainsKey(kvp.Key))
                {
                    var newDept = new Department 
                    { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId, 
                        Name = kvp.Value, 
                        Code = kvp.Key, 
                        DisplayOrder = displayOrder++, 
                        IsActive = true, 
                        CreatedAt = now, 
                        UpdatedAt = now 
                    };
                    newDepartments.Add(newDept);
                    departments[kvp.Key] = newDept;
                }
            }

            if (newDepartments.Any())
            {
                await _context.Departments.AddRangeAsync(newDepartments);
                await _context.SaveChangesAsync();
            }

            // 3. Seed Positions
            var positions = new Dictionary<string, Position>();
            
            var existingPos = await _context.Positions.ToListAsync();
            foreach (var pos in existingPos)
            {
                positions[pos.Code] = pos;
            }

            // Add missing positions
            var newPositions = new List<Position>();
            var posData = new Dictionary<string, (string Name, int Level)>
            {
                { "DIRECTOR", ("Müdür", 1) },
                { "VICE_DIR", ("Müdür Yardımcısı", 2) },
                { "COORD", ("Koordinatör", 3) },
                { "EDITOR", ("Editör", 4) },
                { "AUTHOR", ("Yazar", 5) },
                { "TEACHER", ("Öğretmen", 6) },
                { "STUDENT", ("Öğrenci", 7) },
                { "PARENT", ("Veli", 8) }
            };

            int posDisplayOrder = existingPos.Count + 1;
            foreach (var kvp in posData)
            {
                if (!positions.ContainsKey(kvp.Key))
                {
                    var newPos = new Position 
                    { 
                        Id = Guid.NewGuid(), 
                        TenantId = tenantId, 
                        Name = kvp.Value.Name, 
                        Code = kvp.Key, 
                        Level = kvp.Value.Level, 
                        DisplayOrder = posDisplayOrder++, 
                        IsActive = true, 
                        CreatedAt = now, 
                        UpdatedAt = now 
                    };
                    newPositions.Add(newPos);
                    positions[kvp.Key] = newPos;
                }
            }

            if (newPositions.Any())
            {
                await _context.Positions.AddRangeAsync(newPositions);
                await _context.SaveChangesAsync();
            }

            // 4. Seed Users (3 per role)
            var userCount = 0;
            
            // Check which users already exist
            var existingEmails = await _context.Users.Select(u => u.Email).ToListAsync();
            
            var users = new List<User>();

            // Define all users to add
            var userDefinitions = new List<(string Email, string FirstName, string LastName, string DeptCode, string PosCode, string RoleName)>
            {
                // Müdürler (3)
                ("ahmet.yilmaz@zerquiz.com", "Ahmet", "Yılmaz", "MGMT", "DIRECTOR", "Müdür"),
                ("mehmet.kaya@zerquiz.com", "Mehmet", "Kaya", "MGMT", "DIRECTOR", "Müdür"),
                ("ayse.demir@zerquiz.com", "Ayşe", "Demir", "MGMT", "DIRECTOR", "Müdür"),
                
                // Müdür Yardımcıları (3)
                ("fatma.celik@zerquiz.com", "Fatma", "Çelik", "MGMT", "VICE_DIR", "Müdür Yardımcısı"),
                ("ali.ozturk@zerquiz.com", "Ali", "Öztürk", "MGMT", "VICE_DIR", "Müdür Yardımcısı"),
                ("zeynep.sahin@zerquiz.com", "Zeynep", "Şahin", "MGMT", "VICE_DIR", "Müdür Yardımcısı"),
                
                // Yayın Koordinatörleri (3)
                ("can.yildirim@zerquiz.com", "Can", "Yıldırım", "CONTENT", "COORD", "Yayın Koordinatörü"),
                ("elif.arslan@zerquiz.com", "Elif", "Arslan", "CONTENT", "COORD", "Yayın Koordinatörü"),
                ("emre.dogan@zerquiz.com", "Emre", "Doğan", "CONTENT", "COORD", "Yayın Koordinatörü"),
                
                // Editörler (3)
                ("selin.kara@zerquiz.com", "Selin", "Kara", "CONTENT", "EDITOR", "Editör"),
                ("burak.yilmaz@zerquiz.com", "Burak", "Yılmaz", "CONTENT", "EDITOR", "Editör"),
                ("deniz.aydin@zerquiz.com", "Deniz", "Aydın", "CONTENT", "EDITOR", "Editör"),
                
                // Yazarlar (3)
                ("cem.ozdemir@zerquiz.com", "Cem", "Özdemir", "CONTENT", "AUTHOR", "Yazar"),
                ("irem.kilic@zerquiz.com", "İrem", "Kılıç", "CONTENT", "AUTHOR", "Yazar"),
                ("murat.tas@zerquiz.com", "Murat", "Taş", "CONTENT", "AUTHOR", "Yazar"),
                
                // Öğretmenler (6 - farklı departmanlarda)
                ("hakan.guler@zerquiz.com", "Hakan", "Güler", "MATH", "TEACHER", "Öğretmen"),
                ("ozge.kurt@zerquiz.com", "Özge", "Kurt", "MATH", "TEACHER", "Öğretmen"),
                ("kerem.acar@zerquiz.com", "Kerem", "Acar", "SCI", "TEACHER", "Öğretmen"),
                ("gizem.polat@zerquiz.com", "Gizem", "Polat", "SCI", "TEACHER", "Öğretmen"),
                ("serkan.aslan@zerquiz.com", "Serkan", "Aslan", "LANG", "TEACHER", "Öğretmen"),
                ("pelin.soylu@zerquiz.com", "Pelin", "Soylu", "LANG", "TEACHER", "Öğretmen"),
                
                // Öğrenciler (3)
                ("ogrenci1@zerquiz.com", "Ahmet", "Öğrenci", "STUDENTS", "STUDENT", "Öğrenci"),
                ("ogrenci2@zerquiz.com", "Ayşe", "Öğrenci", "STUDENTS", "STUDENT", "Öğrenci"),
                ("ogrenci3@zerquiz.com", "Mehmet", "Öğrenci", "STUDENTS", "STUDENT", "Öğrenci"),
                
                // Veliler (3)
                ("veli1@zerquiz.com", "Hasan", "Veli", "PARENTS", "PARENT", "Veli"),
                ("veli2@zerquiz.com", "Esra", "Veli", "PARENTS", "PARENT", "Veli"),
                ("veli3@zerquiz.com", "Mustafa", "Veli", "PARENTS", "PARENT", "Veli")
            };

            // Add users that don't exist yet
            foreach (var userDef in userDefinitions)
            {
                if (!existingEmails.Contains(userDef.Email) && 
                    departments.ContainsKey(userDef.DeptCode) && 
                    positions.ContainsKey(userDef.PosCode) && 
                    roles.ContainsKey(userDef.RoleName))
                {
                    users.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        Email = userDef.Email,
                        FirstName = userDef.FirstName,
                        LastName = userDef.LastName,
                        DepartmentId = departments[userDef.DeptCode].Id,
                        PositionId = positions[userDef.PosCode].Id,
                        PrimaryRoleId = roles[userDef.RoleName].Id,
                        IsActive = true,
                        EmailConfirmed = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    });
                }
            }

            if (users.Any())
            {
                await _context.Users.AddRangeAsync(users);
                await _context.SaveChangesAsync();
                userCount = users.Count;
            }

            return Ok(new
            {
                message = "Comprehensive seed completed successfully!",
                roles = await _context.Roles.CountAsync(),
                departments = await _context.Departments.CountAsync(),
                positions = await _context.Positions.CountAsync(),
                users = userCount > 0 ? userCount : await _context.Users.CountAsync(),
                details = new
                {
                    mudir = 3,
                    mudurYardimcisi = 3,
                    yayinKoordinatoru = 3,
                    editor = 3,
                    yazar = 3,
                    ogretmen = 6,
                    ogrenci = 3,
                    veli = 3,
                    total = 27
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in comprehensive seed");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    private static string GetRoleDescription(string roleName)
    {
        return roleName switch
        {
            "SuperAdmin" => "Sistem Yöneticisi",
            "Müdür" => "Okul Müdürü",
            "Müdür Yardımcısı" => "Okul Müdür Yardımcısı",
            "Yayın Koordinatörü" => "İçerik Yayın Koordinatörü",
            "Editör" => "İçerik Editörü",
            "Yazar" => "İçerik Yazarı",
            "Öğretmen" => "Öğretmen",
            "Öğrenci" => "Öğrenci",
            "Veli" => "Veli",
            _ => roleName
        };
    }

    /// <summary>
    /// Clear all users (except super admin)
    /// </summary>
    [HttpDelete("clear-users")]
    public async Task<IActionResult> ClearUsers()
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.Email != "admin@zerquiz.com")
                .ToListAsync();

            _context.Users.RemoveRange(users);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Cleared {users.Count} users" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing users");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

