using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Exams.Domain.Entities;
using Zerquiz.Exams.Infrastructure.Persistence;

namespace Zerquiz.Exams.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamSessionsController : ControllerBase
{
    private readonly ExamsDbContext _context;

    public ExamSessionsController(ExamsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Start new exam session
    /// </summary>
    [HttpPost("start")]
    public async Task<ActionResult> Start([FromBody] StartSessionRequest request)
    {
        // Check if exam exists
        var exam = await _context.Exams.FindAsync(request.ExamId);
        if (exam == null)
            return NotFound("Exam not found");

        // Check if user already has active session
        var existingSession = await _context.ExamSessions
            .FirstOrDefaultAsync(s => s.ExamId == request.ExamId
                && s.UserId == request.UserId
                && (s.SessionStatus == "in_progress" || s.SessionStatus == "paused"));

        if (existingSession != null)
        {
            return BadRequest(new
            {
                message = "Active session already exists",
                sessionId = existingSession.Id
            });
        }

        // Get booklet if specified
        Guid? bookletId = request.BookletId;
        if (!bookletId.HasValue && exam.Settings != null)
        {
            // Auto-assign random booklet
            var booklets = await _context.Booklets
                .Where(b => b.ExamId == request.ExamId)
                .ToListAsync();

            if (booklets.Any())
            {
                var random = new Random();
                bookletId = booklets[random.Next(booklets.Count)].Id;
            }
        }

        var session = new ExamSession
        {
            ExamId = request.ExamId,
            UserId = request.UserId,
            BookletId = bookletId,
            SessionStatus = "in_progress",
            StartedAt = DateTime.UtcNow,
            RemainingSeconds = exam.DurationMinutes * 60,
            TotalQuestions = await GetTotalQuestions(request.ExamId, bookletId),
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent,
            DeviceInfo = request.DeviceInfo,
            LastActivityAt = DateTime.UtcNow
        };

        _context.ExamSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            sessionId = session.Id,
            bookletId = session.BookletId,
            totalQuestions = session.TotalQuestions,
            remainingSeconds = session.RemainingSeconds,
            startedAt = session.StartedAt
        });
    }

    /// <summary>
    /// Get session by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var session = await _context.ExamSessions
            .Include(s => s.Exam)
            .Include(s => s.Booklet)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound();

        return Ok(session);
    }

    /// <summary>
    /// Update session activity (heartbeat)
    /// </summary>
    [HttpPost("{id}/heartbeat")]
    public async Task<ActionResult> Heartbeat(Guid id, [FromBody] HeartbeatRequest request)
    {
        var session = await _context.ExamSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        if (session.SessionStatus != "in_progress")
            return BadRequest($"Session is {session.SessionStatus}");

        // Update time spent
        var now = DateTime.UtcNow;
        if (session.LastActivityAt.HasValue)
        {
            var elapsed = (int)(now - session.LastActivityAt.Value).TotalSeconds;
            session.TimeSpentSeconds += elapsed;
            session.RemainingSeconds = Math.Max(0, session.RemainingSeconds - elapsed);
        }

        session.LastActivityAt = now;
        session.CurrentQuestionIndex = request.CurrentQuestionIndex;
        session.AnsweredCount = request.AnsweredCount;
        session.MarkedForReviewCount = request.MarkedForReviewCount;

        // Check integrity violations
        if (request.TabSwitched)
            session.TabSwitchCount++;

        if (request.FullscreenExited)
            session.FullscreenExitCount++;

        session.LastIntegrityCheckAt = now;

        // Auto-timeout if time expired
        if (session.RemainingSeconds <= 0)
        {
            session.SessionStatus = "timed_out";
            session.CompletedAt = now;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            remainingSeconds = session.RemainingSeconds,
            sessionStatus = session.SessionStatus,
            tabSwitchCount = session.TabSwitchCount,
            fullscreenExitCount = session.FullscreenExitCount
        });
    }

    /// <summary>
    /// Pause session
    /// </summary>
    [HttpPost("{id}/pause")]
    public async Task<ActionResult> Pause(Guid id)
    {
        var session = await _context.ExamSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        if (session.SessionStatus != "in_progress")
            return BadRequest($"Cannot pause session with status: {session.SessionStatus}");

        session.SessionStatus = "paused";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Session paused" });
    }

    /// <summary>
    /// Resume session
    /// </summary>
    [HttpPost("{id}/resume")]
    public async Task<ActionResult> Resume(Guid id)
    {
        var session = await _context.ExamSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        if (session.SessionStatus != "paused")
            return BadRequest($"Cannot resume session with status: {session.SessionStatus}");

        session.SessionStatus = "in_progress";
        session.LastActivityAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Session resumed" });
    }

    /// <summary>
    /// Submit session (complete)
    /// </summary>
    [HttpPost("{id}/submit")]
    public async Task<ActionResult> Submit(Guid id)
    {
        var session = await _context.ExamSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        if (session.SessionStatus == "submitted")
            return BadRequest("Session already submitted");

        var now = DateTime.UtcNow;
        session.SessionStatus = "submitted";
        session.CompletedAt = now;
        session.SubmittedAt = now;

        // Final time calculation
        if (session.LastActivityAt.HasValue)
        {
            var elapsed = (int)(now - session.LastActivityAt.Value).TotalSeconds;
            session.TimeSpentSeconds += elapsed;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Session submitted successfully",
            timeSpentSeconds = session.TimeSpentSeconds,
            completedAt = session.CompletedAt
        });
    }

    /// <summary>
    /// Get user's sessions
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult> GetByUserId(Guid userId, [FromQuery] string? status = null)
    {
        var query = _context.ExamSessions
            .Where(s => s.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.SessionStatus == status);

        var sessions = await query
            .Include(s => s.Exam)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id,
                s.ExamId,
                ExamTitle = s.Exam.Title,
                s.SessionStatus,
                s.StartedAt,
                s.CompletedAt,
                s.TimeSpentSeconds,
                s.TotalScore,
                s.SuccessRate
            })
            .ToListAsync();

        return Ok(sessions);
    }

    /// <summary>
    /// Get session statistics
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<ActionResult> GetStatistics(Guid id)
    {
        var session = await _context.ExamSessions
            .Include(s => s.Exam)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound();

        var stats = new
        {
            session.TimeSpentSeconds,
            session.RemainingSeconds,
            TimeSpentMinutes = session.TimeSpentSeconds / 60,
            session.AnsweredCount,
            session.MarkedForReviewCount,
            UnansweredCount = session.TotalQuestions - session.AnsweredCount,
            ProgressPercentage = session.TotalQuestions > 0
                ? (int)((session.AnsweredCount / (double)session.TotalQuestions) * 100)
                : 0,
            session.TabSwitchCount,
            session.FullscreenExitCount,
            session.IsIntegrityViolated
        };

        return Ok(stats);
    }

    /// <summary>
    /// Mark integrity violation
    /// </summary>
    [HttpPost("{id}/mark-violation")]
    public async Task<ActionResult> MarkViolation(Guid id, [FromBody] ViolationRequest request)
    {
        var session = await _context.ExamSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        session.IsIntegrityViolated = true;
        // In real implementation, log violation details

        await _context.SaveChangesAsync();

        return Ok(new { message = "Violation marked", reason = request.Reason });
    }

    // Helper methods
    private async Task<int> GetTotalQuestions(Guid examId, Guid? bookletId)
    {
        if (bookletId.HasValue)
        {
            return await _context.BookletQuestions
                .Where(bq => bq.BookletId == bookletId.Value)
                .CountAsync();
        }

        return await _context.ExamQuestions
            .Where(eq => eq.Section.ExamId == examId)
            .CountAsync();
    }
}

public record StartSessionRequest(
    Guid ExamId,
    Guid UserId,
    Guid? BookletId,
    string? IpAddress,
    string? UserAgent,
    string? DeviceInfo
);

public record HeartbeatRequest(
    int CurrentQuestionIndex,
    int AnsweredCount,
    int MarkedForReviewCount,
    bool TabSwitched,
    bool FullscreenExited
);

public record ViolationRequest(string Reason);

