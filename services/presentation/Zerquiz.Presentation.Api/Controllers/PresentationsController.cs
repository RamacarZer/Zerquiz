using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Application.DTOs;
using Zerquiz.Presentation.Infrastructure.Persistence;
using PresentationEntity = Zerquiz.Presentation.Domain.Entities.Presentation;

namespace Zerquiz.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PresentationsController : ControllerBase
{
    private readonly PresentationDbContext _context;
    private readonly ILogger<PresentationsController> _logger;

    public PresentationsController(PresentationDbContext context, ILogger<PresentationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<PresentationDto>>> GetAll(
        [FromQuery] bool? isLive,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Presentations
            .Where(p => p.DeletedAt == null);

        if (isLive.HasValue)
        {
            query = query.Where(p => p.IsLive == isLive.Value);
        }

        var presentations = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PresentationDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Theme = p.Theme,
                IsLive = p.IsLive,
                LiveCode = p.LiveCode,
                SlideCount = p.Slides.Count,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();

        return Ok(presentations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PresentationDetailDto>> GetById(Guid id)
    {
        var presentation = await _context.Presentations
            .Include(p => p.Slides.OrderBy(s => s.Order))
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (presentation == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        var dto = new PresentationDetailDto
        {
            Id = presentation.Id,
            Title = presentation.Title,
            Description = presentation.Description,
            Theme = presentation.Theme,
            IsLive = presentation.IsLive,
            LiveCode = presentation.LiveCode,
            AllowStudentQuestions = presentation.AllowStudentQuestions,
            ShowProgressBar = presentation.ShowProgressBar,
            ShowSlideNumbers = presentation.ShowSlideNumbers,
            SlideCount = presentation.Slides.Count,
            CreatedAt = presentation.CreatedAt,
            UpdatedAt = presentation.UpdatedAt,
            Slides = presentation.Slides.Select(s => new SlideDto
            {
                Id = s.Id,
                PresentationId = s.PresentationId,
                Order = s.Order,
                Type = s.Type.ToString(),
                Title = s.Title,
                Content = s.Content,
                ImageUrl = s.ImageUrl,
                SpeakerNotes = s.SpeakerNotes
            }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<PresentationDto>> Create([FromBody] CreatePresentationRequest request)
    {
        var presentation = new PresentationEntity
        {
            Title = request.Title,
            Description = request.Description,
            SubjectId = request.SubjectId,
            Theme = request.Theme,
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // TODO: Get from auth
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Presentations.Add(presentation);
        await _context.SaveChangesAsync();

        var dto = new PresentationDto
        {
            Id = presentation.Id,
            Title = presentation.Title,
            Description = presentation.Description,
            Theme = presentation.Theme,
            IsLive = presentation.IsLive,
            LiveCode = presentation.LiveCode,
            SlideCount = 0,
            CreatedAt = presentation.CreatedAt,
            UpdatedAt = presentation.UpdatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = presentation.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PresentationDto>> Update(Guid id, [FromBody] UpdatePresentationRequest request)
    {
        var presentation = await _context.Presentations
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (presentation == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        if (request.Title != null) presentation.Title = request.Title;
        if (request.Description != null) presentation.Description = request.Description;
        if (request.Theme != null) presentation.Theme = request.Theme;
        if (request.AllowStudentQuestions.HasValue) presentation.AllowStudentQuestions = request.AllowStudentQuestions.Value;
        if (request.ShowProgressBar.HasValue) presentation.ShowProgressBar = request.ShowProgressBar.Value;

        presentation.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var dto = new PresentationDto
        {
            Id = presentation.Id,
            Title = presentation.Title,
            Description = presentation.Description,
            Theme = presentation.Theme,
            IsLive = presentation.IsLive,
            LiveCode = presentation.LiveCode,
            SlideCount = presentation.Slides.Count,
            CreatedAt = presentation.CreatedAt,
            UpdatedAt = presentation.UpdatedAt
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var presentation = await _context.Presentations
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (presentation == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        presentation.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<PresentationDto>> Duplicate(Guid id)
    {
        var original = await _context.Presentations
            .Include(p => p.Slides)
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (original == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        var duplicate = new PresentationEntity
        {
            Title = $"{original.Title} (Copy)",
            Description = original.Description,
            SubjectId = original.SubjectId,
            Theme = original.Theme,
            AllowStudentQuestions = original.AllowStudentQuestions,
            ShowProgressBar = original.ShowProgressBar,
            ShowSlideNumbers = original.ShowSlideNumbers,
            TenantId = original.TenantId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Presentations.Add(duplicate);
        await _context.SaveChangesAsync();

        // Copy slides
        foreach (var slide in original.Slides.OrderBy(s => s.Order))
        {
            var newSlide = new Domain.Entities.Slide
            {
                PresentationId = duplicate.Id,
                Order = slide.Order,
                Type = slide.Type,
                Title = slide.Title,
                Content = slide.Content,
                ImageUrl = slide.ImageUrl,
                ImageCaption = slide.ImageCaption,
                LeftColumn = slide.LeftColumn,
                RightColumn = slide.RightColumn,
                QuestionId = slide.QuestionId,
                PollQuestion = slide.PollQuestion,
                PollOptions = slide.PollOptions,
                Transition = slide.Transition,
                Duration = slide.Duration,
                SpeakerNotes = slide.SpeakerNotes,
                BackgroundColor = slide.BackgroundColor,
                TextColor = slide.TextColor,
                TenantId = slide.TenantId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Slides.Add(newSlide);
        }

        await _context.SaveChangesAsync();

        var dto = new PresentationDto
        {
            Id = duplicate.Id,
            Title = duplicate.Title,
            Description = duplicate.Description,
            Theme = duplicate.Theme,
            IsLive = false,
            SlideCount = original.Slides.Count,
            CreatedAt = duplicate.CreatedAt,
            UpdatedAt = duplicate.UpdatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = duplicate.Id }, dto);
    }

    [HttpPost("{id}/go-live")]
    public async Task<ActionResult<object>> GoLive(Guid id)
    {
        var presentation = await _context.Presentations
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (presentation == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        // Generate 6-digit code
        var liveCode = GenerateLiveCode();
        presentation.IsLive = true;
        presentation.LiveCode = liveCode;
        presentation.LiveStartTime = DateTime.UtcNow;
        presentation.UpdatedAt = DateTime.UtcNow;

        // Create session
        var session = new Domain.Entities.PresentationSession
        {
            PresentationId = presentation.Id,
            PresenterUserId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // TODO: Get from auth
            StartTime = DateTime.UtcNow,
            CurrentSlideIndex = 0,
            IsActive = true,
            SessionCode = liveCode,
            TenantId = presentation.TenantId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.PresentationSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            liveCode,
            sessionId = session.Id,
            message = "Presentation is now live!"
        });
    }

    private string GenerateLiveCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous characters
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}

