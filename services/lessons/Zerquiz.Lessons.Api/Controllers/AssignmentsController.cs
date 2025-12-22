using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<AssignmentsController> _logger;

    public AssignmentsController(LessonsDbContext context, ILogger<AssignmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";
    private bool IsTeacher() => User.IsInRole("Teacher") || User.IsInRole("TenantAdmin") || User.IsInRole("SuperAdmin");

    // GET: api/Assignments/list
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<Assignment>>> GetAll([FromQuery] string? status = null)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        var isTeacher = IsTeacher();

        var query = _context.Assignments
            .Include(a => a.Submissions)
            .Where(a => a.TenantId == tenantId);

        // Teachers see all assignments they created
        // Students see published assignments
        if (!isTeacher)
        {
            query = query.Where(a => a.Status == "published");
        }
        else
        {
            query = query.Where(a => a.CreatedBy == userId);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }

        var assignments = await query
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(assignments);
    }

    // GET: api/Assignments/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Assignment>> GetById(Guid id)
    {
        var tenantId = GetTenantId();
        var assignment = await _context.Assignments
            .Include(a => a.Submissions)
            .FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId);

        if (assignment == null)
            return NotFound();

        return Ok(assignment);
    }

    // POST: api/Assignments/create
    [HttpPost("create")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<ActionResult<Assignment>> Create([FromBody] Assignment assignment)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        assignment.Id = Guid.NewGuid();
        assignment.TenantId = tenantId;
        assignment.CreatedBy = userId;
        assignment.CreatedAt = DateTime.UtcNow;
        assignment.UpdatedAt = DateTime.UtcNow;
        assignment.Status = "draft"; // New assignments start as draft

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created assignment {Id} for tenant {TenantId}", assignment.Id, tenantId);

        return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, assignment);
    }

    // PUT: api/Assignments/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Assignment assignment)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        
        var existing = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId && a.CreatedBy == userId);

        if (existing == null)
            return NotFound();

        // Update properties
        existing.Title = assignment.Title;
        existing.Description = assignment.Description;
        existing.Instructions = assignment.Instructions;
        existing.DueDate = assignment.DueDate;
        existing.Points = assignment.Points;
        existing.AssignmentType = assignment.AssignmentType;
        existing.RubricId = assignment.RubricId;
        existing.AttachedResources = assignment.AttachedResources;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Assignments/{id}/publish
    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Publish(Guid id)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId && a.CreatedBy == userId);

        if (assignment == null)
            return NotFound();

        assignment.Status = "published";
        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Published assignment {Id} for tenant {TenantId}", id, tenantId);

        return Ok(new { message = "Assignment published successfully" });
    }

    // GET: api/Assignments/{id}/submissions
    [HttpGet("{id}/submissions")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetSubmissions(Guid id)
    {
        var tenantId = GetTenantId();
        
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId);

        if (assignment == null)
            return NotFound();

        var submissions = await _context.AssignmentSubmissions
            .Where(s => s.AssignmentId == id)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        return Ok(submissions);
    }

    // DELETE: api/Assignments/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId && a.CreatedBy == userId);

        if (assignment == null)
            return NotFound();

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted assignment {Id} for tenant {TenantId}", id, tenantId);

        return NoContent();
    }
}




