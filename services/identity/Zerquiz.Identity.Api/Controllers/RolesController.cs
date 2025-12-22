using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public RolesController(IdentityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<RoleDto>>>> GetRoles()
    {
        var roles = await _context.Roles
            .OrderBy(r => r.Name)
            .ToListAsync();

        var result = roles.Select(r => new RoleDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Permissions = r.Permissions.ToList(),
            IsActive = r.IsActive,
            CreatedAt = r.CreatedAt
        }).ToList();

        return Ok(ApiResponse<List<RoleDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RoleDto>>> GetRole(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound(ApiResponse<RoleDto>.ErrorResult("Role not found"));

        var result = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            Permissions = role.Permissions.ToList(),
            IsActive = role.IsActive,
            CreatedAt = role.CreatedAt
        };

        return Ok(ApiResponse<RoleDto>.SuccessResult(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<RoleDto>>> CreateRole([FromBody] CreateRoleRequest request)
    {
        // Check if role already exists
        if (await _context.Roles.AnyAsync(r => r.Name == request.Name))
            return BadRequest(ApiResponse<RoleDto>.ErrorResult("Role with this name already exists"));

        var role = new Zerquiz.Identity.Domain.Entities.Role
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Permissions = request.Permissions.ToArray(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        var result = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            Permissions = role.Permissions.ToList(),
            IsActive = role.IsActive,
            CreatedAt = role.CreatedAt
        };

        return CreatedAtAction(nameof(GetRole), new { id = role.Id }, ApiResponse<RoleDto>.SuccessResult(result));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<RoleDto>>> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound(ApiResponse<RoleDto>.ErrorResult("Role not found"));

        // Check if name is being changed to an existing name
        if (role.Name != request.Name && await _context.Roles.AnyAsync(r => r.Name == request.Name && r.Id != id))
            return BadRequest(ApiResponse<RoleDto>.ErrorResult("Role with this name already exists"));

        role.Name = request.Name;
        role.Description = request.Description;
        role.Permissions = request.Permissions.ToArray();
        role.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var result = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            Permissions = role.Permissions.ToList(),
            IsActive = role.IsActive,
            CreatedAt = role.CreatedAt
        };

        return Ok(ApiResponse<RoleDto>.SuccessResult(result));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteRole(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Role not found"));

        // Check if role is assigned to any users
        var usersWithRole = await _context.Users.CountAsync(u => u.PrimaryRoleId == id);
        if (usersWithRole > 0)
            return BadRequest(ApiResponse<bool>.ErrorResult($"Cannot delete role. It is assigned to {usersWithRole} users."));

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true, "Role deleted successfully"));
    }
}

public class RoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Permissions { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Permissions { get; set; } = new();
}

public class UpdateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Permissions { get; set; } = new();
}

