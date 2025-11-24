using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Application.DTOs;
using Zerquiz.Grading.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResultsController : ControllerBase
{
    private readonly GradingDbContext _context;

    public ResultsController(GradingDbContext context)
    {
        _context = context;
    }

    [HttpGet("session/{sessionId}")]
    public async Task<ActionResult<ApiResponse<ExamResultDto>>> GetBySession(Guid sessionId)
    {
        var result = await _context.ExamResults
            .FirstOrDefaultAsync(r => r.ExamSessionId == sessionId);

        if (result == null)
            return NotFound(ApiResponse<ExamResultDto>.ErrorResult("Sonuç bulunamadı"));

        var dto = new ExamResultDto
        {
            Id = result.Id,
            ExamId = result.ExamId,
            TotalScore = result.TotalScore,
            MaxScore = result.MaxScore,
            Percentage = result.Percentage,
            CorrectCount = result.CorrectCount,
            WrongCount = result.WrongCount,
            EmptyCount = result.EmptyCount,
            EvaluatedAt = result.EvaluatedAt
        };

        return Ok(ApiResponse<ExamResultDto>.SuccessResult(dto));
    }
}

