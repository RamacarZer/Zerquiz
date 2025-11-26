using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Grading.Infrastructure.Persistence;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AutoGradeController : ControllerBase
{
    private readonly GradingDbContext _context;
    private readonly ILogger<AutoGradeController> _logger;

    public AutoGradeController(GradingDbContext context, ILogger<AutoGradeController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Auto-grade exam session responses
    /// </summary>
    [HttpPost("grade-session")]
    public async Task<ActionResult> GradeSession([FromBody] GradeSessionRequest request)
    {
        // Get all responses for the session
        var responses = await _context.Responses
            .Where(r => r.ExamSessionId == request.ExamSessionId)
            .ToListAsync();

        if (!responses.Any())
            return NotFound("No responses found for this session");

        int totalScore = 0;
        int correctCount = 0;
        int wrongCount = 0;
        int emptyCount = 0;
        int totalQuestions = responses.Count;

        // Grade each response
        foreach (var response in responses)
        {
            var gradeResult = await GradeResponse(response, request.QuestionAnswers);
            
            if (gradeResult.IsCorrect)
            {
                correctCount++;
                totalScore += gradeResult.Points;
            }
            else if (gradeResult.IsEmpty)
            {
                emptyCount++;
            }
            else
            {
                wrongCount++;
                // Apply wrong answer penalty if configured
                if (request.WrongAnswerPenalty > 0)
                {
                    totalScore -= (int)(gradeResult.Points * request.WrongAnswerPenalty);
                }
            }

            // Update response
            response.IsCorrect = gradeResult.IsCorrect;
            response.Points = gradeResult.Points;
            response.GradedAt = DateTime.UtcNow;
        }

        // Create or update ExamResult
        var examResult = await _context.ExamResults
            .FirstOrDefaultAsync(er => er.ExamSessionId == request.ExamSessionId && er.UserId == request.UserId);

        if (examResult == null)
        {
            examResult = new ExamResult
            {
                ExamId = request.ExamId,
                ExamSessionId = request.ExamSessionId,
                UserId = request.UserId,
                ExamName = request.ExamName,
                StartedAt = request.StartedAt,
                CompletedAt = DateTime.UtcNow,
                TimeSpentSeconds = request.TimeSpentSeconds
            };
            _context.ExamResults.Add(examResult);
        }

        examResult.TotalScore = totalScore;
        examResult.CorrectCount = correctCount;
        examResult.WrongCount = wrongCount;
        examResult.EmptyCount = emptyCount;
        examResult.TotalQuestions = totalQuestions;
        examResult.SuccessRate = totalQuestions > 0 ? (correctCount / (decimal)totalQuestions) * 100 : 0;
        examResult.Status = "graded";
        examResult.GradedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            examResultId = examResult.Id,
            totalScore,
            correctCount,
            wrongCount,
            emptyCount,
            totalQuestions,
            successRate = examResult.SuccessRate,
            message = "Session graded successfully"
        });
    }

    /// <summary>
    /// Grade single response
    /// </summary>
    [HttpPost("grade-response")]
    public async Task<ActionResult> GradeSingleResponse([FromBody] GradeResponseRequest request)
    {
        var response = await _context.Responses.FindAsync(request.ResponseId);
        if (response == null)
            return NotFound();

        var gradeResult = await GradeResponse(response, new Dictionary<Guid, QuestionAnswer>
        {
            [request.QuestionId] = new QuestionAnswer
            {
                CorrectAnswer = request.CorrectAnswer,
                QuestionType = request.QuestionType,
                Points = request.Points
            }
        });

        response.IsCorrect = gradeResult.IsCorrect;
        response.Points = gradeResult.Points;
        response.GradedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            responseId = response.Id,
            isCorrect = response.IsCorrect,
            points = response.Points,
            feedback = GenerateFeedback(response.IsCorrect, request.QuestionType)
        });
    }

    /// <summary>
    /// Re-grade exam result (for corrections)
    /// </summary>
    [HttpPost("regrade/{examResultId}")]
    public async Task<ActionResult> Regrade(Guid examResultId, [FromBody] GradeSessionRequest request)
    {
        var examResult = await _context.ExamResults.FindAsync(examResultId);
        if (examResult == null)
            return NotFound();

        // Re-fetch and regrade all responses
        var responses = await _context.Responses
            .Where(r => r.ExamSessionId == examResult.ExamSessionId)
            .ToListAsync();

        int totalScore = 0;
        int correctCount = 0;
        int wrongCount = 0;
        int emptyCount = 0;

        foreach (var response in responses)
        {
            var gradeResult = await GradeResponse(response, request.QuestionAnswers);
            
            response.IsCorrect = gradeResult.IsCorrect;
            response.Points = gradeResult.Points;
            response.GradedAt = DateTime.UtcNow;

            if (gradeResult.IsCorrect)
            {
                correctCount++;
                totalScore += gradeResult.Points;
            }
            else if (gradeResult.IsEmpty)
            {
                emptyCount++;
            }
            else
            {
                wrongCount++;
                if (request.WrongAnswerPenalty > 0)
                {
                    totalScore -= (int)(gradeResult.Points * request.WrongAnswerPenalty);
                }
            }
        }

        // Update exam result
        var oldScore = examResult.TotalScore;
        examResult.TotalScore = totalScore;
        examResult.CorrectCount = correctCount;
        examResult.WrongCount = wrongCount;
        examResult.EmptyCount = emptyCount;
        examResult.SuccessRate = responses.Count > 0 ? (correctCount / (decimal)responses.Count) * 100 : 0;
        examResult.GradedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Exam regraded successfully",
            oldScore,
            newScore = totalScore,
            scoreDifference = totalScore - oldScore
        });
    }

    // Helper methods
    private async Task<GradeResult> GradeResponse(Response response, Dictionary<Guid, QuestionAnswer> questionAnswers)
    {
        if (!questionAnswers.TryGetValue(response.QuestionId, out var questionAnswer))
        {
            _logger.LogWarning("Question answer not found for QuestionId: {QuestionId}", response.QuestionId);
            return new GradeResult { IsCorrect = false, Points = 0, IsEmpty = true };
        }

        // Check if response is empty
        if (string.IsNullOrWhiteSpace(response.AnswerText))
        {
            return new GradeResult { IsCorrect = false, Points = 0, IsEmpty = true };
        }

        bool isCorrect = false;

        switch (questionAnswer.QuestionType.ToLower())
        {
            case "multiple_choice_single":
            case "single_choice":
                isCorrect = CheckSingleChoice(response.AnswerText, questionAnswer.CorrectAnswer);
                break;

            case "multiple_choice_multiple":
            case "multiple_select":
                isCorrect = CheckMultipleChoice(response.AnswerText, questionAnswer.CorrectAnswer);
                break;

            case "true_false":
            case "boolean":
                isCorrect = CheckTrueFalse(response.AnswerText, questionAnswer.CorrectAnswer);
                break;

            case "short_answer":
            case "text_input":
                isCorrect = CheckShortAnswer(response.AnswerText, questionAnswer.CorrectAnswer);
                break;

            case "numeric":
            case "number":
                isCorrect = CheckNumeric(response.AnswerText, questionAnswer.CorrectAnswer, questionAnswer.Tolerance);
                break;

            case "matching":
                isCorrect = CheckMatching(response.AnswerText, questionAnswer.CorrectAnswer);
                break;

            default:
                _logger.LogWarning("Unsupported question type for auto-grading: {Type}", questionAnswer.QuestionType);
                return new GradeResult { IsCorrect = false, Points = 0, RequiresManualGrading = true };
        }

        return new GradeResult
        {
            IsCorrect = isCorrect,
            Points = isCorrect ? questionAnswer.Points : 0,
            IsEmpty = false
        };
    }

    private bool CheckSingleChoice(string userAnswer, string correctAnswer)
    {
        return string.Equals(userAnswer.Trim(), correctAnswer.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    private bool CheckMultipleChoice(string userAnswer, string correctAnswer)
    {
        var userAnswers = userAnswer.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(a => a.Trim().ToLower())
            .OrderBy(a => a)
            .ToList();

        var correctAnswers = correctAnswer.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(a => a.Trim().ToLower())
            .OrderBy(a => a)
            .ToList();

        return userAnswers.SequenceEqual(correctAnswers);
    }

    private bool CheckTrueFalse(string userAnswer, string correctAnswer)
    {
        var normalized = userAnswer.Trim().ToLower();
        var correct = correctAnswer.Trim().ToLower();

        // Handle various formats: true/false, yes/no, 1/0, doğru/yanlış
        var trueValues = new[] { "true", "yes", "1", "doğru", "dogru", "t", "y" };
        var falseValues = new[] { "false", "no", "0", "yanlış", "yanlis", "f", "n" };

        bool userIsTrue = trueValues.Contains(normalized);
        bool userIsFalse = falseValues.Contains(normalized);
        bool correctIsTrue = trueValues.Contains(correct);

        if (!userIsTrue && !userIsFalse)
            return false;

        return (userIsTrue && correctIsTrue) || (userIsFalse && !correctIsTrue);
    }

    private bool CheckShortAnswer(string userAnswer, string correctAnswer)
    {
        // Simple exact match (case-insensitive, trimmed)
        // In real implementation, use fuzzy matching, stemming, etc.
        var normalized = userAnswer.Trim().ToLower();
        var correct = correctAnswer.Trim().ToLower();

        // Try exact match first
        if (normalized == correct)
            return true;

        // Try comma-separated alternatives
        var alternatives = correct.Split('|', StringSplitOptions.RemoveEmptyEntries)
            .Select(a => a.Trim());

        return alternatives.Any(alt => normalized == alt);
    }

    private bool CheckNumeric(string userAnswer, string correctAnswer, decimal tolerance = 0.01m)
    {
        if (!decimal.TryParse(userAnswer.Trim(), out var userValue))
            return false;

        if (!decimal.TryParse(correctAnswer.Trim(), out var correctValue))
            return false;

        return Math.Abs(userValue - correctValue) <= tolerance;
    }

    private bool CheckMatching(string userAnswer, string correctAnswer)
    {
        try
        {
            var userPairs = JsonSerializer.Deserialize<Dictionary<string, string>>(userAnswer);
            var correctPairs = JsonSerializer.Deserialize<Dictionary<string, string>>(correctAnswer);

            if (userPairs == null || correctPairs == null)
                return false;

            return userPairs.OrderBy(p => p.Key).SequenceEqual(correctPairs.OrderBy(p => p.Key));
        }
        catch
        {
            return false;
        }
    }

    private string GenerateFeedback(bool isCorrect, string questionType)
    {
        if (isCorrect)
            return "Doğru cevap! ✓";

        return questionType switch
        {
            "multiple_choice_single" => "Yanlış cevap. Lütfen şıkları tekrar inceleyin.",
            "true_false" => "Yanlış cevap. Doğru/Yanlış seçeneğini kontrol edin.",
            "numeric" => "Yanlış cevap. Sayısal değeri kontrol edin.",
            _ => "Yanlış cevap."
        };
    }
}

public record GradeSessionRequest(
    Guid ExamSessionId,
    Guid ExamId,
    Guid UserId,
    string ExamName,
    DateTime StartedAt,
    int TimeSpentSeconds,
    Dictionary<Guid, QuestionAnswer> QuestionAnswers,
    decimal WrongAnswerPenalty = 0
);

public record GradeResponseRequest(
    Guid ResponseId,
    Guid QuestionId,
    string CorrectAnswer,
    string QuestionType,
    int Points
);

public record QuestionAnswer(
    string CorrectAnswer,
    string QuestionType,
    int Points,
    decimal Tolerance = 0.01m
);

public record GradeResult
{
    public bool IsCorrect { get; set; }
    public int Points { get; set; }
    public bool IsEmpty { get; set; }
    public bool RequiresManualGrading { get; set; }
}

