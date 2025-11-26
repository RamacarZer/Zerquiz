using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

            // Clear existing to avoid duplicates
            _context.QuestionDifficultyLevels.RemoveRange(await _context.QuestionDifficultyLevels.ToListAsync());
            _context.QuestionPresentationTypes.RemoveRange(await _context.QuestionPresentationTypes.ToListAsync());
            await _context.SaveChangesAsync();

            // Difficulty Levels
            var difficulties = new[]
            {
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "very_easy", Name = "Çok Kolay", Level = 1, Color = "#10b981", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "easy", Name = "Kolay", Level = 2, Color = "#22c55e", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "medium", Name = "Orta", Level = 3, Color = "#f59e0b", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "hard", Name = "Zor", Level = 4, Color = "#ef4444", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionDifficultyLevel { Id = Guid.NewGuid(), TenantId = tenantId, Code = "very_hard", Name = "Çok Zor", Level = 5, Color = "#dc2626", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now }
            };

            // Presentation Types
            var presentations = new[]
            {
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Sadece Metin", Code = "text-only", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Metin + Görsel", Code = "text-image", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Görsel", Code = "image-only", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Video", Code = "video", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Ses", Code = "audio", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now },
                new QuestionPresentationType { Id = Guid.NewGuid(), TenantId = tenantId, Name = "İnteraktif", Code = "interactive", IsActive = true, IsSystem = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.QuestionDifficultyLevels.AddRangeAsync(difficulties);
            await _context.QuestionPresentationTypes.AddRangeAsync(presentations);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                difficultyLevels = difficulties.Length,
                presentationTypes = presentations.Length
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
        }
    }
}
