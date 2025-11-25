using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Application.DTOs;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuestionsDbContext _context;

    public QuestionsController(QuestionsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<QuestionDto>>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] Guid? subjectId = null)
    {
        var query = _context.Questions.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(q => q.QuestionStatus == status);

        if (subjectId.HasValue)
            query = query.Where(q => q.SubjectId == subjectId.Value);

        var totalCount = await query.CountAsync();

        var questions = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new QuestionDto
            {
                Id = q.Id,
                Code = q.Code,
                FormatType = q.FormatType.Name,
                Difficulty = q.Difficulty,
                Status = q.QuestionStatus,
                CreatedAt = q.CreatedAt
            })
            .ToListAsync();

        var result = new PagedResult<QuestionDto>
        {
            Items = questions,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        return Ok(ApiResponse<PagedResult<QuestionDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<QuestionDetailDto>>> GetById(Guid id)
    {
        var question = await _context.Questions
            .Include(q => q.Versions)
            .Include(q => q.Solutions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            return NotFound(ApiResponse<QuestionDetailDto>.ErrorResult("Soru bulunamadı"));

        var currentVersion = question.Versions.FirstOrDefault(v => v.Id == question.CurrentVersionId);

        var dto = new QuestionDetailDto
        {
            Id = question.Id,
            Code = question.Code,
            FormatTypeId = question.FormatTypeId,
            PedagogicalTypeId = question.PedagogicalTypeId,
            SubjectId = question.SubjectId,
            TopicId = question.TopicId,
            Difficulty = question.Difficulty,
            Weight = question.Weight,
            Status = question.QuestionStatus,
            CurrentVersion = currentVersion != null ? new QuestionVersionDto
            {
                Id = currentVersion.Id,
                VersionNumber = currentVersion.VersionNumber,
                Content = currentVersion.Content,
                CreatedAt = currentVersion.CreatedAt
            } : null,
            Solutions = question.Solutions.Select(s => new QuestionSolutionDto
            {
                Id = s.Id,
                Type = s.Type,
                Content = s.Content,
                Language = s.Language
            }).ToList()
        };

        return Ok(ApiResponse<QuestionDetailDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<QuestionDto>>> Create([FromBody] CreateQuestionRequest request)
    {
        var question = new Question
        {
            Code = $"Q-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            FormatTypeId = request.FormatTypeId,
            PedagogicalTypeId = request.PedagogicalTypeId,
            SubjectId = request.SubjectId,
            TopicId = request.TopicId,
            Difficulty = request.Difficulty,
            Weight = request.Weight,
            QuestionStatus = "draft",
            TenantId = Guid.NewGuid(), // TODO: Get from context
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null // TODO: Get from current user (system user)
        };

        var version = new QuestionVersion
        {
            QuestionId = question.Id,
            TenantId = question.TenantId ?? Guid.Empty, // Handle nullable TenantId
            VersionNumber = 1,
            Content = request.Content,
            CreatedBy = question.CreatedBy, // Now both are Guid?
            CreatedAt = DateTime.UtcNow
        };

        question.CurrentVersionId = version.Id;

        _context.Questions.Add(question);
        _context.QuestionVersions.Add(version);
        await _context.SaveChangesAsync();

        var dto = new QuestionDto
        {
            Id = question.Id,
            Code = question.Code,
            Difficulty = question.Difficulty,
            Status = question.QuestionStatus,
            CreatedAt = question.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = question.Id }, 
            ApiResponse<QuestionDto>.SuccessResult(dto, "Soru başarıyla oluşturuldu"));
    }
}

