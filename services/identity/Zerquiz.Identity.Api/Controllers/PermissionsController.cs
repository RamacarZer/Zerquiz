using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Identity.Infrastructure.Persistence;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PermissionsController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public PermissionsController(IdentityDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all permissions
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string? module = null, [FromQuery] string? category = null)
    {
        var query = _context.Permissions.AsQueryable();

        if (!string.IsNullOrEmpty(module))
            query = query.Where(p => p.Module == module);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category == category);

        var permissions = await query
            .OrderBy(p => p.Module)
            .ThenBy(p => p.DisplayOrder)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.Description,
                p.Module,
                p.Action,
                p.Category
            })
            .ToListAsync();

        return Ok(permissions);
    }

    /// <summary>
    /// Get permission by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var permission = await _context.Permissions.FindAsync(id);
        if (permission == null)
            return NotFound();

        return Ok(permission);
    }

    /// <summary>
    /// Create permission
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreatePermissionRequest request)
    {
        var permission = new Permission
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            Module = request.Module,
            Action = request.Action,
            Resource = request.Resource,
            Category = request.Category ?? "general",
            DisplayOrder = request.DisplayOrder ?? 0
        };

        _context.Permissions.Add(permission);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = permission.Id }, permission);
    }

    /// <summary>
    /// Update permission
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdatePermissionRequest request)
    {
        var permission = await _context.Permissions.FindAsync(id);
        if (permission == null)
            return NotFound();

        permission.Name = request.Name ?? permission.Name;
        permission.Description = request.Description ?? permission.Description;
        permission.Category = request.Category ?? permission.Category;
        permission.DisplayOrder = request.DisplayOrder ?? permission.DisplayOrder;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Delete permission
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var permission = await _context.Permissions.FindAsync(id);
        if (permission == null)
            return NotFound();

        _context.Permissions.Remove(permission);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Assign permission to role
    /// </summary>
    [HttpPost("assign-to-role")]
    public async Task<ActionResult> AssignToRole([FromBody] AssignPermissionRequest request)
    {
        var role = await _context.Roles.FindAsync(request.RoleId);
        if (role == null)
            return NotFound("Role not found");

        var permission = await _context.Permissions.FindAsync(request.PermissionId);
        if (permission == null)
            return NotFound("Permission not found");

        // Check if already assigned
        var existing = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == request.RoleId && rp.PermissionId == request.PermissionId);

        if (existing != null)
            return BadRequest("Permission already assigned to role");

        var rolePermission = new RolePermission
        {
            RoleId = request.RoleId,
            PermissionId = request.PermissionId,
            IsGranted = request.IsGranted ?? true,
            ValidFrom = request.ValidFrom,
            ValidTo = request.ValidTo
        };

        _context.RolePermissions.Add(rolePermission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Permission assigned to role" });
    }

    /// <summary>
    /// Revoke permission from role
    /// </summary>
    [HttpPost("revoke-from-role")]
    public async Task<ActionResult> RevokeFromRole([FromBody] RevokePermissionRequest request)
    {
        var rolePermission = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == request.RoleId && rp.PermissionId == request.PermissionId);

        if (rolePermission == null)
            return NotFound("Permission not assigned to role");

        _context.RolePermissions.Remove(rolePermission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Permission revoked from role" });
    }

    /// <summary>
    /// Get permissions for role
    /// </summary>
    [HttpGet("role/{roleId}")]
    public async Task<ActionResult> GetByRoleId(Guid roleId)
    {
        var permissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == roleId && rp.IsGranted)
            .Include(rp => rp.Permission)
            .Select(rp => new
            {
                rp.Permission.Id,
                rp.Permission.Code,
                rp.Permission.Name,
                rp.Permission.Module,
                rp.Permission.Action,
                rp.ValidFrom,
                rp.ValidTo
            })
            .ToListAsync();

        return Ok(permissions);
    }

    /// <summary>
    /// Check if user has permission
    /// </summary>
    [HttpGet("check")]
    public async Task<ActionResult> CheckPermission([FromQuery] Guid userId, [FromQuery] string permissionCode)
    {
        // Get user's roles
        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        if (!userRoles.Any())
            return Ok(new { hasPermission = false });

        // Check if any role has the permission
        var hasPermission = await _context.RolePermissions
            .Include(rp => rp.Permission)
            .AnyAsync(rp => userRoles.Contains(rp.RoleId)
                && rp.Permission.Code == permissionCode
                && rp.IsGranted
                && (!rp.ValidFrom.HasValue || rp.ValidFrom.Value <= DateTime.UtcNow)
                && (!rp.ValidTo.HasValue || rp.ValidTo.Value >= DateTime.UtcNow));

        return Ok(new { hasPermission });
    }

    /// <summary>
    /// Get all permissions for user (aggregated from roles)
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult> GetByUserId(Guid userId)
    {
        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        if (!userRoles.Any())
            return Ok(new List<object>());

        var permissions = await _context.RolePermissions
            .Where(rp => userRoles.Contains(rp.RoleId) && rp.IsGranted)
            .Include(rp => rp.Permission)
            .Include(rp => rp.Role)
            .Select(rp => new
            {
                rp.Permission.Id,
                rp.Permission.Code,
                rp.Permission.Name,
                rp.Permission.Module,
                rp.Permission.Action,
                rp.Permission.Category,
                RoleName = rp.Role.Name
            })
            .Distinct()
            .ToListAsync();

        return Ok(permissions);
    }

    /// <summary>
    /// Seed default permissions
    /// </summary>
    [HttpPost("seed")]
    public async Task<ActionResult> SeedPermissions()
    {
        if (await _context.Permissions.AnyAsync())
            return BadRequest("Permissions already seeded");

        var permissions = GetDefaultPermissions();

        _context.Permissions.AddRange(permissions);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Permissions seeded", count = permissions.Count });
    }

    private List<Permission> GetDefaultPermissions()
    {
        var permissions = new List<Permission>();
        var order = 1;

        // Questions module
        permissions.AddRange(new[]
        {
            new Permission { Code = "questions.create", Name = "Create Questions", Module = "questions", Action = "create", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "questions.read", Name = "Read Questions", Module = "questions", Action = "read", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "questions.update", Name = "Update Questions", Module = "questions", Action = "update", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "questions.delete", Name = "Delete Questions", Module = "questions", Action = "delete", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "questions.review", Name = "Review Questions", Module = "questions", Action = "review", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "questions.approve", Name = "Approve Questions", Module = "questions", Action = "approve", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "questions.publish", Name = "Publish Questions", Module = "questions", Action = "publish", Category = "admin", DisplayOrder = order++ },
        });

        // Exams module
        permissions.AddRange(new[]
        {
            new Permission { Code = "exams.create", Name = "Create Exams", Module = "exams", Action = "create", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "exams.read", Name = "Read Exams", Module = "exams", Action = "read", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "exams.update", Name = "Update Exams", Module = "exams", Action = "update", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "exams.delete", Name = "Delete Exams", Module = "exams", Action = "delete", Category = "content", DisplayOrder = order++ },
            new Permission { Code = "exams.publish", Name = "Publish Exams", Module = "exams", Action = "publish", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "exams.take", Name = "Take Exams", Module = "exams", Action = "take", Category = "general", DisplayOrder = order++ },
        });

        // Grading module
        permissions.AddRange(new[]
        {
            new Permission { Code = "grading.grade", Name = "Grade Exams", Module = "grading", Action = "grade", Category = "grading", DisplayOrder = order++ },
            new Permission { Code = "grading.view_results", Name = "View Results", Module = "grading", Action = "read", Category = "grading", DisplayOrder = order++ },
            new Permission { Code = "grading.regrade", Name = "Regrade Exams", Module = "grading", Action = "regrade", Category = "admin", DisplayOrder = order++ },
        });

        // Users & Roles
        permissions.AddRange(new[]
        {
            new Permission { Code = "users.create", Name = "Create Users", Module = "identity", Action = "create", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "users.update", Name = "Update Users", Module = "identity", Action = "update", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "users.delete", Name = "Delete Users", Module = "identity", Action = "delete", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "roles.manage", Name = "Manage Roles", Module = "identity", Action = "manage", Category = "admin", DisplayOrder = order++ },
            new Permission { Code = "permissions.manage", Name = "Manage Permissions", Module = "identity", Action = "manage", Category = "admin", DisplayOrder = order++ },
        });

        return permissions;
    }
}

public record CreatePermissionRequest(string Code, string Name, string? Description, string Module, string Action, string? Resource, string? Category, int? DisplayOrder);
public record UpdatePermissionRequest(string? Name, string? Description, string? Category, int? DisplayOrder);
public record AssignPermissionRequest(Guid RoleId, Guid PermissionId, bool? IsGranted, DateTime? ValidFrom, DateTime? ValidTo);
public record RevokePermissionRequest(Guid RoleId, Guid PermissionId);

