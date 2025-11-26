using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Infrastructure.Persistence;
using Zerquiz.Presentation.Domain.Entities;
using PresentationEntity = Zerquiz.Presentation.Domain.Entities.Presentation;

namespace Zerquiz.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly PresentationDbContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(PresentationDbContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("demo-presentations")]
    public async Task<IActionResult> SeedDemoPresentations()
    {
        try
        {
            if (await _context.Presentations.AnyAsync())
            {
                return Ok(new { message = "Demo presentations already seeded" });
            }

            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // Demo Presentation 1: Matematik Dersi
            var mathPresentation = new PresentationEntity
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Title = "Matematik: Geometri Temelleri",
                Description = "Üçgenler, dörtgenler ve alan hesaplama",
                Theme = "default",
                AllowStudentQuestions = true,
                ShowProgressBar = true,
                ShowSlideNumbers = true,
                IsLive = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            var mathSlides = new List<Slide>
            {
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = mathPresentation.Id,
                    Order = 0,
                    Type = SlideType.Title,
                    Title = "Geometri Temelleri",
                    Content = "Üçgenler ve Dörtgenler",
                    Transition = "fade",
                    Duration = 0,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = mathPresentation.Id,
                    Order = 1,
                    Type = SlideType.Content,
                    Title = "Üçgen Nedir?",
                    Content = "Üçgen, üç kenarı ve üç köşesi olan kapalı geometrik şekildir.\n\n**Üçgen Türleri:**\n- Eşkenar Üçgen\n- İkizkenar Üçgen\n- Çeşitkenar Üçgen\n\n**Özellikler:**\n- İç açılar toplamı = \\(180^\\circ\\)\n- Dış açılar toplamı = \\(360^\\circ\\)",
                    Transition = "slide",
                    Duration = 0,
                    SpeakerNotes = "Öğrencilere üçgen çeşitlerini görselle anlatın",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = mathPresentation.Id,
                    Order = 2,
                    Type = SlideType.TwoColumn,
                    Title = "Alan Hesaplama Formülleri",
                    LeftColumn = "**Üçgen Alan Formülü:**\n\n\\(A = \\frac{1}{2} \\times taban \\times yükseklik\\)\n\n\\(A = \\frac{1}{2} \\times b \\times h\\)",
                    RightColumn = "**Dörtgen Alan Formülü:**\n\n\\(A = uzunluk \\times genişlik\\)\n\n\\(A = a \\times b\\)",
                    Transition = "zoom",
                    Duration = 0,
                    SpeakerNotes = "Formülleri tahtaya yazıp örneklerle açıklayın",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = mathPresentation.Id,
                    Order = 3,
                    Type = SlideType.Poll,
                    Title = "Hızlı Anket",
                    PollQuestion = "Hangi üçgen türünü daha iyi anlıyorsunuz?",
                    PollOptions = "Eşkenar Üçgen\nİkizkenar Üçgen\nÇeşitkenar Üçgen\nHiçbiri",
                    Transition = "fade",
                    Duration = 0,
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            // Demo Presentation 2: İngilizce Dersi
            var englishPresentation = new PresentationEntity
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Title = "English: Present Tenses",
                Description = "Simple Present and Present Continuous",
                Theme = "minimal",
                AllowStudentQuestions = true,
                ShowProgressBar = true,
                ShowSlideNumbers = true,
                IsLive = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            var englishSlides = new List<Slide>
            {
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = englishPresentation.Id,
                    Order = 0,
                    Type = SlideType.Title,
                    Title = "Present Tenses",
                    Content = "Understanding Present Simple & Present Continuous",
                    Transition = "fade",
                    Duration = 0,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = englishPresentation.Id,
                    Order = 1,
                    Type = SlideType.Content,
                    Title = "Simple Present Tense",
                    Content = "**Usage:**\n- Habits and routines\n- General truths\n- Permanent situations\n\n**Structure:**\n- (+) Subject + Verb (base form)\n- (-) Subject + do/does not + Verb\n- (?) Do/Does + Subject + Verb?\n\n**Examples:**\n- I **eat** breakfast every day.\n- She **doesn't like** coffee.\n- **Do** you **play** tennis?",
                    Transition = "slide",
                    Duration = 0,
                    SpeakerNotes = "Give more examples from daily life",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = englishPresentation.Id,
                    Order = 2,
                    Type = SlideType.Content,
                    Title = "Present Continuous Tense",
                    Content = "**Usage:**\n- Actions happening now\n- Temporary situations\n- Future arrangements\n\n**Structure:**\n- (+) Subject + am/is/are + Verb-ing\n- (-) Subject + am/is/are not + Verb-ing\n- (?) Am/Is/Are + Subject + Verb-ing?\n\n**Examples:**\n- I **am studying** English now.\n- They **are not watching** TV.\n- **Is** she **working** today?",
                    Transition = "slide",
                    Duration = 0,
                    SpeakerNotes = "Emphasize the -ing form",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = englishPresentation.Id,
                    Order = 3,
                    Type = SlideType.Quiz,
                    Title = "Practice Time!",
                    QuestionId = Guid.Empty,
                    Transition = "zoom",
                    Duration = 0,
                    SpeakerNotes = "Give students 2 minutes to answer",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            // Demo Presentation 3: Fen Bilimleri
            var sciencePresentation = new PresentationEntity
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Title = "Fen Bilimleri: Hücre Yapısı",
                Description = "Bitki ve Hayvan Hücreleri",
                Theme = "dark",
                AllowStudentQuestions = true,
                ShowProgressBar = true,
                ShowSlideNumbers = true,
                IsLive = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            var scienceSlides = new List<Slide>
            {
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = sciencePresentation.Id,
                    Order = 0,
                    Type = SlideType.Title,
                    Title = "Hücre: Canlılığın Birimi",
                    Content = "Bitki ve Hayvan Hücrelerinin Yapısı",
                    Transition = "fade",
                    Duration = 0,
                    BackgroundColor = "#1a1a2e",
                    TextColor = "#eaeaea",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = sciencePresentation.Id,
                    Order = 1,
                    Type = SlideType.TwoColumn,
                    Title = "Bitki vs Hayvan Hücresi",
                    LeftColumn = "**Bitki Hücresi:**\n- Hücre duvarı var\n- Kloroplast var\n- Büyük vakuol\n- Düzenli şekil\n- Fotosentez yapar",
                    RightColumn = "**Hayvan Hücresi:**\n- Hücre duvarı yok\n- Kloroplast yok\n- Küçük vakuoller\n- Düzensiz şekil\n- Fotosentez yapmaz",
                    Transition = "slide",
                    Duration = 0,
                    BackgroundColor = "#16213e",
                    TextColor = "#ffffff",
                    SpeakerNotes = "Mikroskop görselleri gösterin",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Slide
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    PresentationId = sciencePresentation.Id,
                    Order = 2,
                    Type = SlideType.Poll,
                    Title = "Test Yourself",
                    PollQuestion = "Hangi hücre organeli fotosentez yapar?",
                    PollOptions = "Mitokondri\nKloroplast\nRibozom\nGolgi Cisimciği",
                    Transition = "zoom",
                    Duration = 0,
                    BackgroundColor = "#0f3460",
                    TextColor = "#e94560",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            // Save to database
            _context.Presentations.AddRange(mathPresentation, englishPresentation, sciencePresentation);
            _context.Slides.AddRange(mathSlides);
            _context.Slides.AddRange(englishSlides);
            _context.Slides.AddRange(scienceSlides);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Demo presentations seeded successfully",
                count = 3,
                presentations = new[]
                {
                    new { mathPresentation.Id, mathPresentation.Title, SlideCount = mathSlides.Count },
                    new { englishPresentation.Id, englishPresentation.Title, SlideCount = englishSlides.Count },
                    new { sciencePresentation.Id, sciencePresentation.Title, SlideCount = scienceSlides.Count }
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding demo presentations");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }

    [HttpPost("clear-all")]
    public async Task<IActionResult> ClearAll()
    {
        try
        {
            _context.SlideInteractions.RemoveRange(_context.SlideInteractions);
            _context.SessionAttendees.RemoveRange(_context.SessionAttendees);
            _context.PresentationSessions.RemoveRange(_context.PresentationSessions);
            _context.Slides.RemoveRange(_context.Slides);
            _context.Presentations.RemoveRange(_context.Presentations);
            await _context.SaveChangesAsync();

            return Ok(new { message = "All presentation data cleared" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing presentation data");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

