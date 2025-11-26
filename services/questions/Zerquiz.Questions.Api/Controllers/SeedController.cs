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

    [HttpPost("clear-question-types")]
    public async Task<IActionResult> ClearQuestionTypes()
    {
        try
        {
            _context.QuestionFormatTypes.RemoveRange(_context.QuestionFormatTypes);
            _context.QuestionPedagogicalTypes.RemoveRange(_context.QuestionPedagogicalTypes);
            _context.QuestionDifficultyLevels.RemoveRange(_context.QuestionDifficultyLevels);
            _context.QuestionPresentationTypes.RemoveRange(_context.QuestionPresentationTypes);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Question types cleared successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing question types");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("question-types")]
    public async Task<IActionResult> SeedQuestionTypes()
    {
        try
        {
            // Clear existing data to avoid duplicates
            _context.QuestionFormatTypes.RemoveRange(_context.QuestionFormatTypes);
            _context.QuestionPedagogicalTypes.RemoveRange(_context.QuestionPedagogicalTypes);
            _context.QuestionDifficultyLevels.RemoveRange(_context.QuestionDifficultyLevels);
            _context.QuestionPresentationTypes.RemoveRange(_context.QuestionPresentationTypes);
            await _context.SaveChangesAsync();

            var tenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            var now = DateTime.UtcNow;

            // Seed Question Format Types
            var formatTypes = new[]
            {
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "reading_comprehension",
                    Name = "Okumalı Sorular",
                    Description = "Metin okuma ve anlama soruları",
                    ConfigSchema = "{\"requiresReadingText\": true, \"minOptions\": 2, \"maxOptions\": 5}",
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
                    Code = "listening_comprehension",
                    Name = "Dinlemeli Sorular",
                    Description = "Ses kaydı dinleme ve anlama soruları",
                    ConfigSchema = "{\"requiresAudio\": true, \"allowReplay\": true, \"maxReplays\": 3}",
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
                    Code = "video_based",
                    Name = "Video İzlemeli Sorular",
                    Description = "Video izleme ve anlama soruları",
                    ConfigSchema = "{\"requiresVideo\": true, \"allowReplay\": true, \"trackWatchTime\": true}",
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
                    Code = "visual_analysis",
                    Name = "Görsel İncelemeli Sorular",
                    Description = "Görsel (resim, grafik, şema) analiz soruları",
                    ConfigSchema = "{\"requiresImage\": true, \"allowZoom\": true, \"imageTypes\": [\"chart\", \"diagram\", \"photo\"]}",
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
                    Code = "document_review",
                    Name = "Dosya İncelemeli Sorular",
                    Description = "Belge/doküman inceleme soruları (PDF, Word vb.)",
                    ConfigSchema = "{\"requiresDocument\": true, \"allowedFormats\": [\"pdf\", \"doc\", \"xlsx\"]}",
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
                    Code = "subjective",
                    Name = "Öznel Sorular",
                    Description = "Kişisel görüş ve yorum gerektiren sorular",
                    ConfigSchema = "{\"requiresManualGrading\": true, \"allowMultiplePerspectives\": true}",
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
                    Code = "objective",
                    Name = "Nesnel Sorular",
                    Description = "Tek doğru cevaplı objektif sorular (Çoktan seçmeli, Doğru/Yanlış vb.)",
                    ConfigSchema = "{\"singleCorrectAnswer\": true, \"autoGradable\": true}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 7
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "open_ended",
                    Name = "Açık Uçlu Sorular",
                    Description = "Uzun yazılı cevap gerektiren sorular",
                    ConfigSchema = "{\"minLength\": 50, \"maxLength\": 5000, \"requiresManualGrading\": true}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 8
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "mind_map",
                    Name = "Zihin Haritası Soruları",
                    Description = "Zihin haritası oluşturma ve tamamlama soruları",
                    ConfigSchema = "{\"requiresDrawing\": true, \"allowDigitalTools\": true, \"evaluationCriteria\": [\"structure\", \"connections\", \"content\"]}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 9
                },
                new QuestionFormatType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "intuitive",
                    Name = "Sezgisel Sorular",
                    Description = "Sezgi ve tahmin yeteneği ölçen sorular",
                    ConfigSchema = "{\"noDefinitiveAnswer\": true, \"allowMultipleValidAnswers\": true, \"evaluateReasoning\": true}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 10
                }
            };

            // Seed Pedagogical Types
            var pedagogicalTypes = new[]
            {
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "general",
                    Name = "Genel Sorular",
                    Description = "Genel amaçlı sorular",
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
                    Code = "learning",
                    Name = "Öğrenme Soruları",
                    Description = "Yeni bilgi edinme ve öğrenme sürecine yönelik sorular",
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
                    Code = "practice",
                    Name = "Alıştırma Soruları",
                    Description = "Beceri geliştirme ve pratik yapma soruları",
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
                    Code = "remedial",
                    Name = "Yetiştirme Soruları",
                    Description = "Eksik öğrenmeleri tamamlama ve telafi etme soruları",
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
                    Code = "reinforcement",
                    Name = "Pekiştirme Soruları",
                    Description = "Öğrenilen bilgiyi güçlendirme ve kalıcılık sağlama soruları",
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
                    Code = "development",
                    Name = "Geliştirme Soruları",
                    Description = "Üst düzey düşünme becerilerini geliştirme soruları",
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
                    Code = "comprehension",
                    Name = "Kavrama Soruları",
                    Description = "Anlama ve yorumlama düzeyi soruları",
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
                    Code = "outcome_measurement",
                    Name = "Kazanım Ölçme Soruları",
                    Description = "Öğrenme kazanımlarını ölçme ve değerlendirme soruları",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 8
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "instructional",
                    Name = "Konu Anlatımlı Sorular",
                    Description = "Konu anlatımı içeren eğitsel sorular",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 9
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "knowledge",
                    Name = "Bilgi Soruları",
                    Description = "Temel bilgi ve hatırlama düzeyi soruları (Bloom - Seviye 1)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 10
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "application",
                    Name = "Uygulama Soruları",
                    Description = "Bilgiyi yeni durumlarda kullanma soruları (Bloom - Seviye 3)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 11
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "analysis",
                    Name = "Analiz Soruları",
                    Description = "Bilgiyi parçalara ayırma ve ilişkileri inceleme soruları (Bloom - Seviye 4)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 12
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "synthesis",
                    Name = "Sentez Soruları",
                    Description = "Bilgileri birleştirerek yeni bütün oluşturma soruları (Bloom - Seviye 5)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 13
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "evaluation",
                    Name = "Değerlendirme Soruları",
                    Description = "Bilgiyi kriterlere göre yargılama soruları (Bloom - Seviye 6)",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 14
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "unit_assessment",
                    Name = "Ünite Değerlendirme",
                    Description = "Ünite sonunda genel değerlendirme soruları",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 15
                },
                new QuestionPedagogicalType
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "undefined",
                    Name = "Tanımsızlar",
                    Description = "Henüz kategorilendirilmemiş veya özel durumlar",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 16
                }
            };

            // Seed Difficulty Levels
            var difficultyLevels = new[]
            {
                new QuestionDifficultyLevel
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "very_easy",
                    Name = "Çok Kolay",
                    Description = "Temel düzey, kolayca çözülebilir sorular",
                    Level = 1,
                    Color = "#4ade80",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 1
                },
                new QuestionDifficultyLevel
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "easy",
                    Name = "Kolay",
                    Description = "Kolay seviye sorular",
                    Level = 2,
                    Color = "#86efac",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 2
                },
                new QuestionDifficultyLevel
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "medium",
                    Name = "Orta",
                    Description = "Orta zorluk seviyesi sorular",
                    Level = 3,
                    Color = "#fbbf24",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 3
                },
                new QuestionDifficultyLevel
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "hard",
                    Name = "Zor",
                    Description = "Zor seviye sorular",
                    Level = 4,
                    Color = "#fb923c",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 4
                },
                new QuestionDifficultyLevel
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "very_hard",
                    Name = "Çok Zor",
                    Description = "İleri düzey, karmaşık sorular",
                    Level = 5,
                    Color = "#ef4444",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true,
                    IsSystem = true,
                    DisplayOrder = 5
                }
            };

            // Seed Presentation Types - 65+ COMPREHENSIVE QUESTION TYPES
            var presentationTypes = PresentationTypesSeedData.GetAllPresentationTypes(tenantId, now);

            await _context.QuestionFormatTypes.AddRangeAsync(formatTypes);
            await _context.QuestionPedagogicalTypes.AddRangeAsync(pedagogicalTypes);
            await _context.QuestionDifficultyLevels.AddRangeAsync(difficultyLevels);
            await _context.QuestionPresentationTypes.AddRangeAsync(presentationTypes);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully seeded {FormatCount} format types, {PedagogicalCount} pedagogical types, {DifficultyCount} difficulty levels, and {PresentationCount} presentation types",
                formatTypes.Length, pedagogicalTypes.Length, difficultyLevels.Length, presentationTypes.Length);

            return Ok(new
            {
                message = "Successfully seeded question types",
                formatTypesCount = formatTypes.Length,
                pedagogicalTypesCount = pedagogicalTypes.Length,
                difficultyLevelsCount = difficultyLevels.Length,
                presentationTypesCount = presentationTypes.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding question types");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}


