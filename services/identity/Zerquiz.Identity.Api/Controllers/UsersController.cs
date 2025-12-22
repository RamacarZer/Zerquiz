using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Identity.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;
using Zerquiz.Identity.Api.DTOs;

namespace Zerquiz.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public UsersController(IdentityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Api.DTOs.UserDto>>>> GetUsers(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        var query = _context.Users
            .Include(u => u.Department)
            .Include(u => u.Position)
            .Include(u => u.PrimaryRole)
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => 
                u.Email.Contains(search) || 
                u.FirstName.Contains(search) || 
                u.LastName.Contains(search));
        }

        var total = await query.CountAsync();
        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = users.Select(u => new Api.DTOs.UserDto
        {
            Id = u.Id,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Phone = u.Phone,
            IsActive = u.IsActive,
            EmailConfirmed = u.EmailConfirmed,
            Department = u.Department != null ? new Api.DTOs.DepartmentDto 
            { 
                Id = u.Department.Id, 
                Name = u.Department.Name, 
                Code = u.Department.Code 
            } : null,
            Position = u.Position != null ? new Api.DTOs.PositionDto 
            { 
                Id = u.Position.Id, 
                Name = u.Position.Name, 
                Code = u.Position.Code,
                Level = u.Position.Level,
                DisplayOrder = u.Position.DisplayOrder
            } : null,
            PrimaryRole = u.PrimaryRole != null ? new Api.DTOs.RoleDto 
            { 
                Id = u.PrimaryRole.Id, 
                Name = u.PrimaryRole.Name, 
                Description = u.PrimaryRole.Description 
            } : null,
            Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
            CreatedAt = u.CreatedAt
        }).ToList();

        return Ok(ApiResponse<List<Api.DTOs.UserDto>>.SuccessResult(result, $"Found {total} users"));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Api.DTOs.UserDto>>> GetUser(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(ApiResponse<Api.DTOs.UserDto>.ErrorResult("User not found"));

        var result = new Api.DTOs.UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.Phone,
            IsActive = user.IsActive,
            EmailConfirmed = user.EmailConfirmed,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
            Permissions = user.UserRoles.SelectMany(ur => ur.Role.Permissions).Distinct().ToList(),
            CreatedAt = user.CreatedAt
        };

        return Ok(ApiResponse<Api.DTOs.UserDto>.SuccessResult(result));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Api.DTOs.UserDto>>> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<UserDto>.ErrorResult("User not found"));

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Phone = request.Phone;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = null; // TODO: Get from current user

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<UserDto>.SuccessResult(null, "User updated successfully"));
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleUserStatus(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<bool>.ErrorResult("User not found"));

        user.IsActive = !user.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(user.IsActive, 
            $"User {(user.IsActive ? "activated" : "deactivated")} successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<bool>.ErrorResult("User not found"));

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true, "User deleted successfully"));
    }

    [HttpPut("{id}/roles")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateUserRoles(Guid id, [FromBody] UpdateUserRolesRequest request)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(ApiResponse<bool>.ErrorResult("User not found"));

        // Remove existing roles
        _context.UserRoles.RemoveRange(user.UserRoles);

        // Add new roles
        foreach (var roleId in request.RoleIds)
        {
            var role = await _context.Roles.FindAsync(roleId);
            if (role != null)
            {
                user.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = roleId,
                    TenantId = user.TenantId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = null // Admin user
                });
            }
        }

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true, "User roles updated successfully"));
    }
}

public class UpdateUserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class UpdateUserRolesRequest
{
    public List<Guid> RoleIds { get; set; } = new();
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
    public bool EmailConfirmed { get; set; }
    public List<string> Roles { get; set; } = new();
    public List<string> Permissions { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

