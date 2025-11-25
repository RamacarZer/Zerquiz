using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly QuestionsDbContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(QuestionsDbContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("question-types")]
    public async Task<IActionResult> SeedQuestionTypes()
    {
        try
        {
            // Check if already seeded
            if (await _context.QuestionFormatTypes.AnyAsync())
            {
                return Ok(new { message = "Question types already seeded" });
            }

            var tenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            var now = DateTime.UtcNow;

            // Seed Question Format Types
            var formatTypes = new[]
            {
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "multiple_choice",
                    Name = "Çoktan Seçmeli",
                    Description = "Çoktan seçmeli soru formatı (A, B, C, D, E)",
                    ConfigSchema = "{\"minOptions\": 2, \"maxOptions\": 5, \"allowMultipleAnswers\": false}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 1
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "true_false",
                    Name = "Doğru/Yanlış",
                    Description = "İki seçenekli doğru/yanlış sorusu",
                    ConfigSchema = "{\"options\": [\"Doğru\", \"Yanlış\"]}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 2
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "fill_blank",
                    Name = "Boşluk Doldurma",
                    Description = "Metin içindeki boşlukları doldurma sorusu",
                    ConfigSchema = "{\"allowMultipleBlanks\": true, \"caseSensitive\": false}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 3
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "matching",
                    Name = "Eşleştirme",
                    Description = "İki liste arasında eşleştirme yapma",
                    ConfigSchema = "{\"minPairs\": 2, \"maxPairs\": 10, \"shuffleOptions\": true}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 4
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "short_answer",
                    Name = "Kısa Cevap",
                    Description = "Kısa metin cevabı gerektiren soru",
                    ConfigSchema = "{\"maxLength\": 500, \"allowMultipleAnswers\": true}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 5
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "essay",
                    Name = "Kompozisyon/Açık Uçlu",
                    Description = "Uzun metin cevabı gerektiren soru",
                    ConfigSchema = "{\"minLength\": 100, \"maxLength\": 5000}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 6
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "ordering",
                    Name = "Sıralama",
                    Description = "Öğeleri doğru sıraya dizme",
                    ConfigSchema = "{\"minItems\": 2, \"maxItems\": 10}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 7
                }
            };

            // Seed Pedagogical Types
            var pedagogicalTypes = new[]
            {
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "knowledge",
                    Name = "Bilgi",
                    Description = "Temel bilgi ve hatırlama düzeyi (Bloom's Taksonomi - Seviye 1)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 1
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "comprehension",
                    Name = "Kavrama",
                    Description = "Anlama ve yorumlama düzeyi (Bloom's Taksonomi - Seviye 2)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 2
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "application",
                    Name = "Uygulama",
                    Description = "Bilgiyi yeni durumlarda kullanma (Bloom's Taksonomi - Seviye 3)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 3
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "analysis",
                    Name = "Analiz",
                    Description = "Bilgiyi parçalara ayırma ve ilişkileri inceleme (Bloom's Taksonomi - Seviye 4)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 4
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "synthesis",
                    Name = "Sentez",
                    Description = "Farklı bilgileri birleştirerek yeni bir bütün oluşturma (Bloom's Taksonomi - Seviye 5)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 5
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "evaluation",
                    Name = "Değerlendirme",
                    Description = "Bilgiyi kriterlere göre yargılama (Bloom's Taksonomi - Seviye 6)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 6
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "reinforcement",
                    Name = "Pekiştirme",
                    Description = "Öğrenilen bilgiyi güçlendirme sorusu",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 7
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "problem_solving",
                    Name = "Problem Çözme",
                    Description = "Karmaşık problemleri çözme becerisi gerektiren soru",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 8
                }
            };

            await _context.QuestionFormatTypes.AddRangeAsync(formatTypes);
            await _context.QuestionPedagogicalTypes.AddRangeAsync(pedagogicalTypes);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully seeded {FormatCount} format types and {PedagogicalCount} pedagogical types",
                formatTypes.Length, pedagogicalTypes.Length);

            return Ok(new
            {
                message = "Successfully seeded question types",
                formatTypesCount = formatTypes.Length,
                pedagogicalTypesCount = pedagogicalTypes.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding question types");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

