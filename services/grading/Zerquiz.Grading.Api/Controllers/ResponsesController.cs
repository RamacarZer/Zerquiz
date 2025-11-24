using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Application.DTOs;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Grading.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResponsesController : ControllerBase
{
    private readonly GradingDbContext _context;

    public ResponsesController(GradingDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Submit([FromBody] SubmitResponseRequest request)
    {
        var response = new Response
        {
            ExamSessionId = request.ExamSessionId,
            ExamQuestionId = request.ExamQuestionId,
            QuestionId = Guid.NewGuid(), // TODO: Get from ExamQuestion
            UserAnswers = System.Text.Json.JsonSerializer.Serialize(request.UserAnswers),
            TimeSpentSeconds = request.TimeSpentSeconds,
            AnsweredAt = DateTime.UtcNow,
            TenantId = Guid.NewGuid(), // TODO: Get from context
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null
        };

        // TODO: Doğru cevapla karşılaştır ve IsCorrect, Score hesapla

        _context.Responses.Add(response);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResult(null, "Cevap kaydedildi"));
    }
}

