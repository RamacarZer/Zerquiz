using Microsoft.AspNetCore.Mvc;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/quick-seed")]
public class QuickSeedController : ControllerBase
{
    private readonly QuestionsDbContext _context;

    public QuickSeedController(QuestionsDbContext context)
    {
        _context = context;
    }

    [HttpPost("all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // Clear existing
            _context.QuestionDifficultyLevels.RemoveRange(_context.QuestionDifficultyLevels);
            _context.QuestionPresentationTypes.RemoveRange(_context.QuestionPresentationTypes);
            await _context.SaveChangesAsync();

            // Difficulty Levels
            var difficulties = new[]
            {
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "very_easy", Name = "Çok Kolay", Level = 1, Color = "#4ade80", IsActive = true, IsSystem = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "easy", Name = "Kolay", Level = 2, Color = "#86efac", IsActive = true, IsSystem = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "medium", Name = "Orta", Level = 3, Color = "#fbbf24", IsActive = true, IsSystem = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "hard", Name = "Zor", Level = 4, Color = "#fb923c", IsActive = true, IsSystem = true, DisplayOrder = 4, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "very_hard", Name = "Çok Zor", Level = 5, Color = "#ef4444", IsActive = true, IsSystem = true, DisplayOrder = 5, CreatedAt = now, UpdatedAt = now }
            };

            // Presentation Types
            var presentations = new[]
            {
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Code = "multiple_choice", Name = "Çoktan Seçmeli", AnswerType = "single", MinOptions = 2, MaxOptions = 5, IsActive = true, IsSystem = true, DisplayOrder = 1, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Code = "multiple_answer", Name = "Çoklu Cevap", AnswerType = "multiple", MinOptions = 2, MaxOptions = 8, IsActive = true, IsSystem = true, DisplayOrder = 2, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Code = "true_false", Name = "Doğru/Yanlış", AnswerType = "single", MinOptions = 2, MaxOptions = 2, IsActive = true, IsSystem = true, DisplayOrder = 3, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Code = "fill_blank", Name = "Boşluk Doldurma", AnswerType = "text", MinOptions = 0, MaxOptions = 0, IsActive = true, IsSystem = true, DisplayOrder = 4, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Code = "matching", Name = "Eşleştirme", AnswerType = "matching", MinOptions = 2, MaxOptions = 10, IsActive = true, IsSystem = true, DisplayOrder = 5, CreatedAt = now, UpdatedAt = now }
            };

            await _context.QuestionDifficultyLevels.AddRangeAsync(difficulties);
            await _context.QuestionPresentationTypes.AddRangeAsync(presentations);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                difficulties = difficulties.Length,
                presentations = presentations.Length
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace, inner = ex.InnerException?.Message });
        }
    }
}

