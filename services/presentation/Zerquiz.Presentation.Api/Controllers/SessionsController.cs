using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Application.DTOs;
using Zerquiz.Presentation.Domain.Entities;
using Zerquiz.Presentation.Infrastructure.Persistence;

namespace Zerquiz.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly PresentationDbContext _context;

    public SessionsController(PresentationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{sessionId}")]
    public async Task<ActionResult<SessionDto>> GetSession(Guid sessionId)
    {
        var session = await _context.PresentationSessions
            .Include(s => s.Presentation)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            return NotFound(new { message = "Session not found" });
        }

        var dto = new SessionDto
        {
            Id = session.Id,
            PresentationId = session.PresentationId,
            PresentationTitle = session.Presentation.Title,
            SessionCode = session.SessionCode ?? string.Empty,
            CurrentSlideIndex = session.CurrentSlideIndex,
            IsActive = session.IsActive,
            TotalAttendees = session.TotalAttendees,
            CurrentOnlineCount = session.CurrentOnlineCount,
            StartTime = session.StartTime
        };

        return Ok(dto);
    }

    [HttpGet("code/{code}")]
    public async Task<ActionResult<SessionDto>> GetSessionByCode(string code)
    {
        var session = await _context.PresentationSessions
            .Include(s => s.Presentation)
            .FirstOrDefaultAsync(s => s.SessionCode == code.ToUpper() && s.IsActive);

        if (session == null)
        {
            return NotFound(new { message = "Session not found or inactive" });
        }

        var dto = new SessionDto
        {
            Id = session.Id,
            PresentationId = session.PresentationId,
            PresentationTitle = session.Presentation.Title,
            SessionCode = session.SessionCode ?? string.Empty,
            CurrentSlideIndex = session.CurrentSlideIndex,
            IsActive = session.IsActive,
            TotalAttendees = session.TotalAttendees,
            CurrentOnlineCount = session.CurrentOnlineCount,
            StartTime = session.StartTime
        };

        return Ok(dto);
    }

    [HttpPost("{sessionId}/join")]
    public async Task<ActionResult<object>> JoinSession(Guid sessionId, [FromBody] JoinSessionRequest request)
    {
        var session = await _context.PresentationSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.IsActive);

        if (session == null)
        {
            return NotFound(new { message = "Session not found or inactive" });
        }

        // Check if already joined
        var existingAttendee = await _context.SessionAttendees
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.UserId == request.UserId);

        if (existingAttendee != null)
        {
            // Rejoin - mark as online
            existingAttendee.IsOnline = true;
            existingAttendee.LastActiveAt = DateTime.UtcNow;
        }
        else
        {
            // New attendee
            var attendee = new SessionAttendee
            {
                SessionId = sessionId,
                UserId = request.UserId,
                UserName = request.UserName ?? "Anonymous",
                JoinedAt = DateTime.UtcNow,
                IsOnline = true,
                LastActiveAt = DateTime.UtcNow,
                TenantId = session.TenantId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SessionAttendees.Add(attendee);
            session.TotalAttendees++;
        }

        session.CurrentOnlineCount = await _context.SessionAttendees
            .CountAsync(a => a.SessionId == sessionId && a.IsOnline);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            sessionId,
            currentSlideIndex = session.CurrentSlideIndex,
            message = "Joined session successfully"
        });
    }

    [HttpPost("{sessionId}/leave")]
    public async Task<IActionResult> LeaveSession(Guid sessionId, [FromBody] LeaveSessionRequest request)
    {
        var attendee = await _context.SessionAttendees
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.UserId == request.UserId);

        if (attendee != null)
        {
            attendee.IsOnline = false;
            attendee.LeftAt = DateTime.UtcNow;

            var session = await _context.PresentationSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session != null)
            {
                session.CurrentOnlineCount = await _context.SessionAttendees
                    .CountAsync(a => a.SessionId == sessionId && a.IsOnline);
            }

            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true });
    }

    [HttpPost("{sessionId}/change-slide")]
    public async Task<IActionResult> ChangeSlide(Guid sessionId, [FromBody] ChangeSlideRequest request)
    {
        var session = await _context.PresentationSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.IsActive);

        if (session == null)
        {
            return NotFound(new { message = "Session not found or inactive" });
        }

        session.CurrentSlideIndex = request.SlideIndex;
        session.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            currentSlideIndex = session.CurrentSlideIndex
        });
    }

    [HttpGet("{sessionId}/attendees")]
    public async Task<ActionResult<List<object>>> GetAttendees(Guid sessionId)
    {
        var attendees = await _context.SessionAttendees
            .Where(a => a.SessionId == sessionId && a.IsOnline)
            .Select(a => new
            {
                a.Id,
                a.UserId,
                a.UserName,
                a.JoinedAt,
                a.IsOnline,
                a.LastActiveAt
            })
            .ToListAsync();

        return Ok(attendees);
    }

    [HttpPost("{sessionId}/end")]
    public async Task<IActionResult> EndSession(Guid sessionId)
    {
        var session = await _context.PresentationSessions
            .Include(s => s.Presentation)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            return NotFound(new { message = "Session not found" });
        }

        session.IsActive = false;
        session.EndTime = DateTime.UtcNow;

        // End presentation live mode
        session.Presentation.IsLive = false;
        session.Presentation.LiveEndTime = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Session ended" });
    }
}

public class JoinSessionRequest
{
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
}

public class LeaveSessionRequest
{
    public Guid UserId { get; set; }
}

public class ChangeSlideRequest
{
    public int SlideIndex { get; set; }
}

