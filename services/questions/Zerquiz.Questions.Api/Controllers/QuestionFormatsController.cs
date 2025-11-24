using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionFormatsController : ControllerBase
{
    private readonly QuestionsDbContext _context;

    public QuestionFormatsController(QuestionsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<QuestionFormatDto>>>> GetQuestionFormats()
    {
        var formats = await _context.QuestionFormatTypes
            .OrderBy(f => f.Name)
            .ToListAsync();

        var result = formats.Select(f => new QuestionFormatDto
        {
            Id = f.Id,
            Code = f.Code,
            Name = f.Name
        }).ToList();

        return Ok(ApiResponse<List<QuestionFormatDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<QuestionFormatDto>>> GetQuestionFormat(Guid id)
    {
        var format = await _context.QuestionFormatTypes.FindAsync(id);
        if (format == null)
            return NotFound(ApiResponse<QuestionFormatDto>.ErrorResult("Question format not found"));

        var result = new QuestionFormatDto
        {
            Id = format.Id,
            Code = format.Code,
            Name = format.Name
        };

        return Ok(ApiResponse<QuestionFormatDto>.SuccessResult(result));
    }
}

public class QuestionFormatDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

