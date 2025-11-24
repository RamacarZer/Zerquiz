using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Curriculum.Domain.Entities;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly CurriculumDbContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(CurriculumDbContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("demo-data")]
    public async Task<IActionResult> SeedDemoData()
    {
        try
        {
            _logger.LogInformation("Starting curriculum demo data seeding...");

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

            // 1. Education Models
            var eduModel1 = Guid.Parse("70000000-0000-0000-0000-000000000001");
            if (!await _context.EducationModels.AnyAsync(e => e.Id == eduModel1))
            {
                _context.EducationModels.Add(new EducationModel
                {
                    Id = eduModel1,
                    TenantId = tenantId,
                    Code = "TR_MEB",
                    Name = "MEB Müfredatı",
                    Country = "Türkiye",
                    Description = "T.C. Milli Eğitim Bakanlığı Müfredatı",
                    IsActive = true
                });
            }

            // 2. Subjects
            var mathSubject = Guid.Parse("80000000-0000-0000-0000-000000000001");
            if (!await _context.Subjects.AnyAsync(s => s.Id == mathSubject))
            {
                var subjects = new[]
                {
                    new Subject { Id = mathSubject, TenantId = tenantId, Code = "MATH", Name = "Matematik", DisplayOrder = 1, IsActive = true },
                    new Subject { Id = Guid.Parse("80000000-0000-0000-0000-000000000002"), TenantId = tenantId, Code = "PHYSICS", Name = "Fizik", DisplayOrder = 2, IsActive = true },
                    new Subject { Id = Guid.Parse("80000000-0000-0000-0000-000000000003"), TenantId = tenantId, Code = "CHEMISTRY", Name = "Kimya", DisplayOrder = 3, IsActive = true },
                    new Subject { Id = Guid.Parse("80000000-0000-0000-0000-000000000004"), TenantId = tenantId, Code = "BIOLOGY", Name = "Biyoloji", DisplayOrder = 4, IsActive = true },
                    new Subject { Id = Guid.Parse("80000000-0000-0000-0000-000000000005"), TenantId = tenantId, Code = "TURKISH", Name = "Türkçe", DisplayOrder = 5, IsActive = true }
                };
                _context.Subjects.AddRange(subjects);
            }

            // 3. Topics (Hierarchical)
            var topic1 = Guid.Parse("90000000-0000-0000-0000-000000000001");
            if (!await _context.Topics.AnyAsync(t => t.Id == topic1))
            {
                // Main topics
                _context.Topics.AddRange(new[]
                {
                    new Topic { Id = topic1, TenantId = tenantId, SubjectId = mathSubject, Code = "01", Name = "Sayılar ve İşlemler", Level = 1, DisplayOrder = 1 },
                    new Topic { Id = Guid.Parse("90000000-0000-0000-0000-000000000002"), TenantId = tenantId, SubjectId = mathSubject, Code = "02", Name = "Cebir", Level = 1, DisplayOrder = 2 },
                    new Topic { Id = Guid.Parse("90000000-0000-0000-0000-000000000003"), TenantId = tenantId, SubjectId = mathSubject, Code = "03", Name = "Geometri", Level = 1, DisplayOrder = 3 }
                });

                await _context.SaveChangesAsync();

                // Subtopics
                _context.Topics.AddRange(new[]
                {
                    new Topic { Id = Guid.Parse("90000000-0000-0000-0000-000000000011"), TenantId = tenantId, SubjectId = mathSubject, ParentTopicId = topic1, Code = "01.01", Name = "Doğal Sayılar", Level = 2, DisplayOrder = 1 },
                    new Topic { Id = Guid.Parse("90000000-0000-0000-0000-000000000012"), TenantId = tenantId, SubjectId = mathSubject, ParentTopicId = topic1, Code = "01.02", Name = "Tam Sayılar", Level = 2, DisplayOrder = 2 }
                });
            }

            // 4. Curricula
            var curriculum1 = Guid.Parse("71000000-0000-0000-0000-000000000001");
            if (!await _context.Curricula.AnyAsync(c => c.Id == curriculum1))
            {
                _context.Curricula.Add(new Zerquiz.Curriculum.Domain.Entities.Curriculum
                {
                    Id = curriculum1,
                    TenantId = tenantId,
                    EducationModelId = eduModel1,
                    Name = "MEB 2024-2025 Güz",
                    Year = 2024,
                    Term = "Fall",
                    CurriculumVersion = "1.0",
                    IsActive = true
                });
            }

            // 5. Learning Outcomes
            var outcome1 = Guid.Parse("A0000000-0000-0000-0000-000000000001");
            if (!await _context.LearningOutcomes.AnyAsync(lo => lo.Id == outcome1))
            {
                _context.LearningOutcomes.AddRange(new[]
                {
                    new LearningOutcome
                    {
                        Id = outcome1,
                        TenantId = tenantId,
                        CurriculumId = curriculum1,
                        SubjectId = mathSubject,
                        TopicId = Guid.Parse("90000000-0000-0000-0000-000000000011"),
                        Code = "MATH.09.NS.01",
                        Description = "Öğrenci, doğal sayıları tanır ve işlemler yapar.",
                        Details = "Doğal sayıların tanımı, özellikleri ve dört işlem"
                    },
                    new LearningOutcome
                    {
                        Id = Guid.Parse("A0000000-0000-0000-0000-000000000002"),
                        TenantId = tenantId,
                        CurriculumId = curriculum1,
                        SubjectId = mathSubject,
                        TopicId = Guid.Parse("90000000-0000-0000-0000-000000000012"),
                        Code = "MATH.09.IS.01",
                        Description = "Öğrenci, tam sayıları tanır ve işlemler yapar.",
                        Details = "Tam sayıların tanımı, özellikleri ve işlemler"
                    }
                });
            }

            await _context.SaveChangesAsync();

            var counts = new
            {
                educationModels = await _context.EducationModels.CountAsync(),
                subjects = await _context.Subjects.CountAsync(),
                topics = await _context.Topics.CountAsync(),
                curricula = await _context.Curricula.CountAsync(),
                learningOutcomes = await _context.LearningOutcomes.CountAsync()
            };

            return Ok(new { message = "Curriculum demo data seeded successfully!", counts });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding curriculum demo data");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            var counts = new
            {
                educationModels = await _context.EducationModels.CountAsync(),
                subjects = await _context.Subjects.CountAsync(),
                topics = await _context.Topics.CountAsync(),
                curricula = await _context.Curricula.CountAsync(),
                learningOutcomes = await _context.LearningOutcomes.CountAsync()
            };

            return Ok(new { database = "connected", counts });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

