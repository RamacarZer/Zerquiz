using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Domain.Entities;
using Zerquiz.Presentation.Infrastructure.Persistence;

namespace Zerquiz.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LiveSessionsController : ControllerBase
{
    private readonly PresentationDbContext _context;
    private readonly Random _random = new();

    public LiveSessionsController(PresentationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Create live session
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult> Create([FromBody] CreateSessionRequest request)
    {
        var presentation = await _context.Presentations.FindAsync(request.PresentationId);
        if (presentation == null)
            return NotFound("Presentation not found");

        var sessionCode = GenerateSessionCode();

        var session = new PresentationSession
        {
            PresentationId = request.PresentationId,
            HostId = request.HostId,
            SessionCode = sessionCode,
            SessionStatus = "waiting",
            AllowAnonymous = request.AllowAnonymous ?? false,
            ShowResults = request.ShowResults ?? true,
            AllowQuestions = request.AllowQuestions ?? true,
            ParticipantLimit = request.ParticipantLimit
        };

        _context.PresentationSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            sessionId = session.Id,
            sessionCode = session.SessionCode,
            message = "Session created successfully"
        });
    }

    /// <summary>
    /// Join session with code
    /// </summary>
    [HttpPost("join")]
    public async Task<ActionResult> Join([FromBody] JoinSessionRequest request)
    {
        var session = await _context.PresentationSessions
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.SessionCode == request.SessionCode);

        if (session == null)
            return NotFound("Session not found");

        if (session.SessionStatus == "ended")
            return BadRequest("Session has ended");

        // Check participant limit
        if (session.ParticipantLimit.HasValue && session.ParticipantCount >= session.ParticipantLimit.Value)
            return BadRequest("Session is full");

        // Check if already joined
        var existing = session.Participants
            .FirstOrDefault(p => p.UserId == request.UserId || p.DisplayName == request.DisplayName);

        if (existing != null)
        {
            existing.IsActive = true;
            existing.LastSeenAt = DateTime.UtcNow;
            existing.ConnectionId = request.ConnectionId;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                sessionId = session.Id,
                participantId = existing.Id,
                message = "Rejoined session"
            });
        }

        var participant = new SessionParticipant
        {
            SessionId = session.Id,
            UserId = request.UserId,
            DisplayName = request.DisplayName,
            JoinedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow,
            ConnectionId = request.ConnectionId
        };

        _context.SessionParticipants.Add(participant);
        session.ParticipantCount++;

        await _context.SaveChangesAsync();

        // In real implementation, broadcast to SignalR hub

        return Ok(new
        {
            sessionId = session.Id,
            participantId = participant.Id,
            currentSlideIndex = session.CurrentSlideIndex,
            message = "Joined session successfully"
        });
    }

    /// <summary>
    /// Start session
    /// </summary>
    [HttpPost("{id}/start")]
    public async Task<ActionResult> Start(Guid id)
    {
        var session = await _context.PresentationSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        if (session.SessionStatus != "waiting")
            return BadRequest($"Cannot start session with status: {session.SessionStatus}");

        session.SessionStatus = "active";
        session.StartedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Broadcast to all participants via SignalR

        return Ok(new { message = "Session started" });
    }

    /// <summary>
    /// Navigate to slide
    /// </summary>
    [HttpPost("{id}/navigate")]
    public async Task<ActionResult> Navigate(Guid id, [FromBody] NavigateRequest request)
    {
        var session = await _context.PresentationSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        session.CurrentSlideId = request.SlideId;
        session.CurrentSlideIndex = request.SlideIndex;

        await _context.SaveChangesAsync();

        // Broadcast slide change to all participants

        return Ok(new
        {
            currentSlideId = session.CurrentSlideId,
            currentSlideIndex = session.CurrentSlideIndex
        });
    }

    /// <summary>
    /// Submit response
    /// </summary>
    [HttpPost("{id}/respond")]
    public async Task<ActionResult> Respond(Guid id, [FromBody] RespondRequest request)
    {
        var session = await _context.PresentationSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        var response = new SessionResponse
        {
            SessionId = id,
            SlideId = request.SlideId,
            ParticipantId = request.ParticipantId,
            ResponseData = request.ResponseData,
            RespondedAt = DateTime.UtcNow,
            ResponseTimeMs = request.ResponseTimeMs,
            IsCorrect = request.IsCorrect ?? false,
            Points = request.Points
        };

        _context.SessionResponses.Add(response);
        session.TotalResponses++;

        await _context.SaveChangesAsync();

        // Broadcast response count update

        return Ok(new { message = "Response recorded" });
    }

    /// <summary>
    /// Get live results for slide
    /// </summary>
    [HttpGet("{id}/results/{slideId}")]
    public async Task<ActionResult> GetResults(Guid id, Guid slideId)
    {
        var responses = await _context.SessionResponses
            .Where(r => r.SessionId == id && r.SlideId == slideId)
            .Include(r => r.Participant)
            .ToListAsync();

        var results = new
        {
            totalResponses = responses.Count,
            correctCount = responses.Count(r => r.IsCorrect),
            averageResponseTime = responses.Any() ? responses.Average(r => r.ResponseTimeMs) : 0,
            responses = responses.Select(r => new
            {
                participantName = r.Participant.DisplayName,
                responseData = r.ResponseData,
                isCorrect = r.IsCorrect,
                responseTimeMs = r.ResponseTimeMs,
                respondedAt = r.RespondedAt
            }).ToList()
        };

        return Ok(results);
    }

    /// <summary>
    /// Get session statistics
    /// </summary>
    [HttpGet("{id}/stats")]
    public async Task<ActionResult> GetStats(Guid id)
    {
        var session = await _context.PresentationSessions
            .Include(s => s.Participants)
            .Include(s => s.Responses)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound();

        var stats = new
        {
            session.SessionCode,
            session.SessionStatus,
            session.ParticipantCount,
            activeParticipants = session.Participants.Count(p => p.IsActive),
            session.TotalResponses,
            session.CurrentSlideIndex,
            session.StartedAt,
            duration = session.StartedAt.HasValue
                ? (DateTime.UtcNow - session.StartedAt.Value).TotalMinutes
                : 0
        };

        return Ok(stats);
    }

    /// <summary>
    /// End session
    /// </summary>
    [HttpPost("{id}/end")]
    public async Task<ActionResult> End(Guid id)
    {
        var session = await _context.PresentationSessions.FindAsync(id);
        if (session == null)
            return NotFound();

        session.SessionStatus = "ended";
        session.EndedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Broadcast session end to all participants

        return Ok(new { message = "Session ended" });
    }

    /// <summary>
    /// Update participant heartbeat
    /// </summary>
    [HttpPost("{id}/heartbeat")]
    public async Task<ActionResult> Heartbeat(Guid id, [FromBody] HeartbeatRequest request)
    {
        var participant = await _context.SessionParticipants.FindAsync(request.ParticipantId);
        if (participant == null)
            return NotFound();

        participant.LastSeenAt = DateTime.UtcNow;
        participant.IsActive = true;

        await _context.SaveChangesAsync();

        return Ok(new { status = "ok" });
    }

    /// <summary>
    /// Get active sessions for host
    /// </summary>
    [HttpGet("host/{hostId}")]
    public async Task<ActionResult> GetByHostId(Guid hostId)
    {
        var sessions = await _context.PresentationSessions
            .Where(s => s.HostId == hostId && (s.SessionStatus == "waiting" || s.SessionStatus == "active"))
            .Include(s => s.Presentation)
            .Select(s => new
            {
                s.Id,
                s.SessionCode,
                s.SessionStatus,
                PresentationTitle = s.Presentation.Title,
                s.ParticipantCount,
                s.TotalResponses,
                s.StartedAt
            })
            .ToListAsync();

        return Ok(sessions);
    }

    private string GenerateSessionCode()
    {
        return _random.Next(100000, 999999).ToString();
    }
}

public record CreateSessionRequest(Guid PresentationId, Guid HostId, bool? AllowAnonymous, bool? ShowResults, bool? AllowQuestions, int? ParticipantLimit);
public record JoinSessionRequest(string SessionCode, Guid? UserId, string DisplayName, string? ConnectionId);
public record NavigateRequest(Guid SlideId, int SlideIndex);
public record RespondRequest(Guid SlideId, Guid ParticipantId, string ResponseData, int ResponseTimeMs, bool? IsCorrect, int? Points);
public record HeartbeatRequest(Guid ParticipantId);

