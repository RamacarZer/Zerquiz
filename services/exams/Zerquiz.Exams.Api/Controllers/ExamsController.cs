using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Exams.Application.DTOs;
using Zerquiz.Exams.Domain.Entities;
using Zerquiz.Exams.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Exams.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController : ControllerBase
{
    private readonly ExamsDbContext _context;

    public ExamsController(ExamsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ExamDto>>>> GetAll()
    {
        var exams = await _context.Exams
            .Include(e => e.Sections)
            .ThenInclude(s => s.Questions)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new ExamDto
            {
                Id = e.Id,
                Name = e.Name,
                Mode = e.Mode,
                DurationMinutes = e.DurationMinutes,
                Status = e.Status,
                ScheduledAt = e.ScheduledAt,
                QuestionCount = e.Sections.Sum(s => s.Questions.Count)
            })
            .ToListAsync();

        return Ok(ApiResponse<List<ExamDto>>.SuccessResult(exams));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExamDto>>> Create([FromBody] CreateExamRequest request)
    {
        var exam = new Exam
        {
            Name = request.Name,
            Description = request.Description,
            Mode = request.Mode,
            DurationMinutes = request.DurationMinutes,
            CurriculumId = request.CurriculumId,
            Status = "draft",
            TenantId = Guid.NewGuid(), // TODO: Get from context
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        var dto = new ExamDto
        {
            Id = exam.Id,
            Name = exam.Name,
            Mode = exam.Mode,
            DurationMinutes = exam.DurationMinutes,
            Status = exam.Status
        };

        return CreatedAtAction(nameof(GetAll), new { id = exam.Id }, 
            ApiResponse<ExamDto>.SuccessResult(dto, "Sınav başarıyla oluşturuldu"));
    }

    [HttpPost("sessions/start")]
    public async Task<ActionResult<ApiResponse<ExamSessionDto>>> StartSession([FromBody] StartExamRequest request)
    {
        var exam = await _context.Exams.FindAsync(request.ExamId);
        if (exam == null)
            return NotFound(ApiResponse<ExamSessionDto>.ErrorResult("Sınav bulunamadı"));

        var session = new ExamSession
        {
            ExamId = request.ExamId,
            UserId = Guid.NewGuid(), // TODO: Get from current user
            BookletId = request.BookletId,
            StartedAt = DateTime.UtcNow,
            Status = "in_progress",
            TenantId = exam.TenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        _context.ExamSessions.Add(session);
        await _context.SaveChangesAsync();

        var dto = new ExamSessionDto
        {
            Id = session.Id,
            ExamId = exam.Id,
            ExamName = exam.Name,
            StartedAt = session.StartedAt,
            Status = session.Status,
            DurationMinutes = exam.DurationMinutes,
            ExpiresAt = session.StartedAt.AddMinutes(exam.DurationMinutes)
        };

        return Ok(ApiResponse<ExamSessionDto>.SuccessResult(dto, "Sınav başlatıldı"));
    }
}

