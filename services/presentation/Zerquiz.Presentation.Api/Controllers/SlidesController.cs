using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Application.DTOs;
using Zerquiz.Presentation.Domain.Entities;
using Zerquiz.Presentation.Infrastructure.Persistence;

namespace Zerquiz.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlidesController : ControllerBase
{
    private readonly PresentationDbContext _context;

    public SlidesController(PresentationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Route("/api/presentations/{presentationId}/slides")]
    public async Task<ActionResult<List<SlideDto>>> GetSlides(Guid presentationId)
    {
        var slides = await _context.Slides
            .Where(s => s.PresentationId == presentationId && s.DeletedAt == null)
            .OrderBy(s => s.Order)
            .Select(s => new SlideDto
            {
                Id = s.Id,
                PresentationId = s.PresentationId,
                Order = s.Order,
                Type = s.Type.ToString(),
                Title = s.Title,
                Content = s.Content,
                ImageUrl = s.ImageUrl,
                SpeakerNotes = s.SpeakerNotes
            })
            .ToListAsync();

        return Ok(slides);
    }

    [HttpPost]
    [Route("/api/presentations/{presentationId}/slides")]
    public async Task<ActionResult<SlideDto>> Create(Guid presentationId, [FromBody] CreateSlideRequest request)
    {
        var presentation = await _context.Presentations
            .FirstOrDefaultAsync(p => p.Id == presentationId && p.DeletedAt == null);

        if (presentation == null)
        {
            return NotFound(new { message = "Presentation not found" });
        }

        // Get next order if not specified
        var order = request.Order ?? await _context.Slides
            .Where(s => s.PresentationId == presentationId && s.DeletedAt == null)
            .Select(s => s.Order)
            .DefaultIfEmpty(-1)
            .MaxAsync() + 1;

        var slideType = Enum.Parse<SlideType>(request.Type);

        var slide = new Slide
        {
            PresentationId = presentationId,
            Order = order,
            Type = slideType,
            Title = request.Title,
            Content = request.Content,
            TenantId = presentation.TenantId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Slides.Add(slide);
        await _context.SaveChangesAsync();

        var dto = new SlideDto
        {
            Id = slide.Id,
            PresentationId = slide.PresentationId,
            Order = slide.Order,
            Type = slide.Type.ToString(),
            Title = slide.Title,
            Content = slide.Content,
            ImageUrl = slide.ImageUrl,
            SpeakerNotes = slide.SpeakerNotes
        };

        return CreatedAtAction(nameof(GetSlides), new { presentationId }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SlideDto>> Update(Guid id, [FromBody] UpdateSlideRequest request)
    {
        var slide = await _context.Slides
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

        if (slide == null)
        {
            return NotFound(new { message = "Slide not found" });
        }

        if (request.Type != null) slide.Type = Enum.Parse<SlideType>(request.Type);
        if (request.Title != null) slide.Title = request.Title;
        if (request.Content != null) slide.Content = request.Content;
        if (request.ImageUrl != null) slide.ImageUrl = request.ImageUrl;
        if (request.SpeakerNotes != null) slide.SpeakerNotes = request.SpeakerNotes;
        if (request.Order.HasValue) slide.Order = request.Order.Value;

        slide.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var dto = new SlideDto
        {
            Id = slide.Id,
            PresentationId = slide.PresentationId,
            Order = slide.Order,
            Type = slide.Type.ToString(),
            Title = slide.Title,
            Content = slide.Content,
            ImageUrl = slide.ImageUrl,
            SpeakerNotes = slide.SpeakerNotes
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var slide = await _context.Slides
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

        if (slide == null)
        {
            return NotFound(new { message = "Slide not found" });
        }

        slide.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/reorder")]
    public async Task<IActionResult> Reorder(Guid id, [FromBody] ReorderRequest request)
    {
        var slide = await _context.Slides
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

        if (slide == null)
        {
            return NotFound(new { message = "Slide not found" });
        }

        var allSlides = await _context.Slides
            .Where(s => s.PresentationId == slide.PresentationId && s.DeletedAt == null)
            .OrderBy(s => s.Order)
            .ToListAsync();

        // Remove from old position
        allSlides.Remove(slide);

        // Insert at new position
        allSlides.Insert(request.NewOrder, slide);

        // Update all orders
        for (int i = 0; i < allSlides.Count; i++)
        {
            allSlides[i].Order = i;
            allSlides[i].UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }
}

public class ReorderRequest
{
    public int NewOrder { get; set; }
}

