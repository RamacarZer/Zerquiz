using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<SubmissionsController> _logger;

    public SubmissionsController(LessonsDbContext context, ILogger<SubmissionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetTenantId() => User.FindFirst("tenantId")?.Value ?? "";
    private string GetUserId() => User.FindFirst("sub")?.Value ?? User.FindFirst("userId")?.Value ?? "";
    private bool IsTeacher() => User.IsInRole("Teacher") || User.IsInRole("TenantAdmin") || User.IsInRole("SuperAdmin");

    // GET: api/Submissions/my-submissions
    [HttpGet("my-submissions")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetMySubmissions()
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        var submissions = await _context.AssignmentSubmissions
            .Include(s => s.Assignment)
            .Where(s => s.StudentId == userId && s.Assignment!.TenantId == tenantId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        return Ok(submissions);
    }

    // POST: api/Submissions/submit
    [HttpPost("submit")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<AssignmentSubmission>> Submit([FromBody] AssignmentSubmission submission)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();

        // Verify assignment exists and is published
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == submission.AssignmentId && a.TenantId == tenantId && a.Status == "published");

        if (assignment == null)
            return NotFound("Assignment not found or not available");

        // Check if already submitted
        var existingSubmission = await _context.AssignmentSubmissions
            .FirstOrDefaultAsync(s => s.AssignmentId == submission.AssignmentId && s.StudentId == userId);

        if (existingSubmission != null)
            return BadRequest("You have already submitted this assignment");

        submission.Id = Guid.NewGuid();
        submission.StudentId = userId;
        submission.SubmittedAt = DateTime.UtcNow;
        
        // Check if late
        if (assignment.DueDate.HasValue && DateTime.UtcNow > assignment.DueDate.Value)
        {
            submission.Status = "late";
        }
        else
        {
            submission.Status = "pending";
        }

        _context.AssignmentSubmissions.Add(submission);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Student {StudentId} submitted assignment {AssignmentId}", userId, submission.AssignmentId);

        return CreatedAtAction(nameof(GetById), new { id = submission.Id }, submission);
    }

    // GET: api/Submissions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<AssignmentSubmission>> GetById(Guid id)
    {
        var tenantId = GetTenantId();
        var userId = GetUserId();
        var isTeacher = IsTeacher();

        var submission = await _context.AssignmentSubmissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id && s.Assignment!.TenantId == tenantId);

        if (submission == null)
            return NotFound();

        // Students can only view their own submissions
        // Teachers can view all submissions
        if (!isTeacher && submission.StudentId != userId)
            return Forbid();

        return Ok(submission);
    }

    // POST: api/Submissions/{id}/grade
    [HttpPost("{id}/grade")]
    [Authorize(Roles = "Teacher,TenantAdmin,SuperAdmin")]
    public async Task<IActionResult> Grade(Guid id, [FromBody] GradeSubmissionRequest request)
    {
        var tenantId = GetTenantId();
        
        var submission = await _context.AssignmentSubmissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id && s.Assignment!.TenantId == tenantId);

        if (submission == null)
            return NotFound();

        submission.Score = request.Score;
        submission.Feedback = request.Feedback;
        submission.RubricScores = request.RubricScores;
        submission.Status = "graded";
        submission.GradedAt = DateTime.UtcNow;
        submission.GradedBy = GetUserId();

        await _context.SaveChangesAsync();

        _logger.LogInformation("Graded submission {Id} with score {Score}", id, request.Score);

        return Ok(new { message = "Submission graded successfully" });
    }

    // PUT: api/Submissions/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AssignmentSubmission submission)
    {
        var userId = GetUserId();
        
        var existing = await _context.AssignmentSubmissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id && s.StudentId == userId);

        if (existing == null)
            return NotFound();

        // Only allow updates if not graded yet
        if (existing.Status == "graded")
            return BadRequest("Cannot update graded submission");

        // Check if past due date
        if (existing.Assignment!.DueDate.HasValue && DateTime.UtcNow > existing.Assignment.DueDate.Value)
            return BadRequest("Cannot update submission past due date");

        existing.SubmissionText = submission.SubmissionText;
        existing.SubmissionFiles = submission.SubmissionFiles;
        existing.SubmittedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class GradeSubmissionRequest
{
    public decimal? Score { get; set; }
    public string? Feedback { get; set; }
    public string? RubricScores { get; set; } // JSON
}

