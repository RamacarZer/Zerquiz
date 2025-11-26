using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/curriculum-seed")]
public class CurriculumSeedController : ControllerBase
{
    private readonly CurriculumDbContext _context;
    private readonly ILogger<CurriculumSeedController> _logger;

    public CurriculumSeedController(CurriculumDbContext context, ILogger<CurriculumSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("all-subjects")]
    public async Task<IActionResult> SeedAllSubjects()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // Demo tenant
            var now = DateTime.UtcNow;

            // Check if already seeded
            if (await _context.Subjects.AnyAsync())
            {
                return Ok(new { message = "Subjects already seeded", count = await _context.Subjects.CountAsync() });
            }

            var subjects = new List<Subject>
            {
                // Dil ve Edebiyat
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "ENG", Name = "İngilizce", DisplayOrder = 1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "TRK", Name = "Türkçe", DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "TRK_LIT", Name = "Türk Dili ve Edebiyatı", DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now },

                // Fen Bilimleri
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "MATH", Name = "Matematik", DisplayOrder = 10, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "PHYS", Name = "Fizik", DisplayOrder = 11, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "CHEM", Name = "Kimya", DisplayOrder = 12, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "BIO", Name = "Biyoloji", DisplayOrder = 13, IsActive = true, CreatedAt = now, UpdatedAt = now },

                // Sosyal Bilimler
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "HIST", Name = "Tarih", DisplayOrder = 20, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "GEO", Name = "Coğrafya", DisplayOrder = 21, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "PHIL", Name = "Felsefe", DisplayOrder = 22, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "REL", Name = "Din Kültürü ve Ahlak Bilgisi", DisplayOrder = 23, IsActive = true, CreatedAt = now, UpdatedAt = now },

                // Diğer
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "ART", Name = "Görsel Sanatlar", DisplayOrder = 30, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "MUSIC", Name = "Müzik", DisplayOrder = 31, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "PE", Name = "Beden Eğitimi", DisplayOrder = 32, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Code = "IT", Name = "Bilişim Teknolojileri", DisplayOrder = 33, IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await _context.Subjects.AddRangeAsync(subjects);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} subjects", subjects.Count);
            return Ok(new { message = "Successfully seeded subjects", count = subjects.Count, subjects = subjects.Select(s => new { s.Code, s.Name }) });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding subjects");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }

    [HttpPost("english-hierarchy")]
    public async Task<IActionResult> SeedEnglishHierarchy()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // Get English subject
            var englishSubject = await _context.Subjects.FirstOrDefaultAsync(s => s.Code == "ENG");
            if (englishSubject == null)
            {
                return BadRequest(new { error = "English subject not found. Please seed subjects first." });
            }

            // Check if already seeded
            if (await _context.Topics.AnyAsync(t => t.SubjectId == englishSubject.Id))
            {
                return Ok(new { message = "English hierarchy already seeded" });
            }

            var topics = new List<Topic>();
            var subtopics = new List<Topic>();
            var headings = new List<Topic>();

            // Grammar (Level 1 - Topic)
            var grammarTopic = new Topic
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                SubjectId = englishSubject.Id,
                Code = "ENG_GRAMMAR",
                Name = "Grammar (Dil Bilgisi)",
                Level = 1,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            };
            topics.Add(grammarTopic);

            // Grammar Subtopics
            var tenses = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = grammarTopic.Id, Code = "ENG_GRAMMAR_TENSES", Name = "Tenses (Zamanlar)", Level = 2, DisplayOrder = 1, IsActive = true, CreatedAt = now, UpdatedAt = now };
            var modals = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = grammarTopic.Id, Code = "ENG_GRAMMAR_MODALS", Name = "Modals (Kipler)", Level = 2, DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now };
            var conditionals = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = grammarTopic.Id, Code = "ENG_GRAMMAR_COND", Name = "Conditionals (Koşul Cümleleri)", Level = 2, DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now };
            subtopics.AddRange(new[] { tenses, modals, conditionals });

            // Tenses Headings
            headings.Add(new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = tenses.Id, Code = "ENG_GRAMMAR_TENSES_PRESENT", Name = "Present Tenses", Level = 3, DisplayOrder = 1, IsActive = true, CreatedAt = now, UpdatedAt = now });
            headings.Add(new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = tenses.Id, Code = "ENG_GRAMMAR_TENSES_PAST", Name = "Past Tenses", Level = 3, DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now });
            headings.Add(new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, ParentTopicId = tenses.Id, Code = "ENG_GRAMMAR_TENSES_FUTURE", Name = "Future Tenses", Level = 3, DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now });

            // Vocabulary
            var vocabTopic = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, Code = "ENG_VOCABULARY", Name = "Vocabulary (Kelime Bilgisi)", Level = 1, DisplayOrder = 2, IsActive = true, CreatedAt = now, UpdatedAt = now };
            topics.Add(vocabTopic);

            // Reading
            var readingTopic = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, Code = "ENG_READING", Name = "Reading (Okuma)", Level = 1, DisplayOrder = 3, IsActive = true, CreatedAt = now, UpdatedAt = now };
            topics.Add(readingTopic);

            // Writing
            var writingTopic = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, Code = "ENG_WRITING", Name = "Writing (Yazma)", Level = 1, DisplayOrder = 4, IsActive = true, CreatedAt = now, UpdatedAt = now };
            topics.Add(writingTopic);

            // Listening
            var listeningTopic = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, Code = "ENG_LISTENING", Name = "Listening (Dinleme)", Level = 1, DisplayOrder = 5, IsActive = true, CreatedAt = now, UpdatedAt = now };
            topics.Add(listeningTopic);

            // Speaking
            var speakingTopic = new Topic { Id = Guid.NewGuid(), TenantId = tenantId, SubjectId = englishSubject.Id, Code = "ENG_SPEAKING", Name = "Speaking (Konuşma)", Level = 1, DisplayOrder = 6, IsActive = true, CreatedAt = now, UpdatedAt = now };
            topics.Add(speakingTopic);

            // Add all
            await _context.Topics.AddRangeAsync(topics);
            await _context.Topics.AddRangeAsync(subtopics);
            await _context.Topics.AddRangeAsync(headings);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded English hierarchy: {Topics} topics, {Subtopics} subtopics, {Headings} headings", 
                topics.Count, subtopics.Count, headings.Count);

            return Ok(new
            {
                message = "Successfully seeded English hierarchy",
                topics = topics.Count,
                subtopics = subtopics.Count,
                headings = headings.Count,
                structure = topics.Select(t => new { t.Code, t.Name })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding English hierarchy");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }
}

