using Microsoft.AspNetCore.Mvc;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIDefinitionsSeedController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<AIDefinitionsSeedController> _logger;

    public AIDefinitionsSeedController(CoreDbContext context, ILogger<AIDefinitionsSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("seed")]
    public async Task<ActionResult> SeedAIDefinitions()
    {
        try
        {
            var now = DateTime.UtcNow;
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // System tenant

            var definitions = new List<SystemDefinition>();

            // 1. AI Generation Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "quiz", Name = "Soru Üretimi", NameTr = "Soru Üretimi", NameEn = "Quiz Generation", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "flashcard", Name = "Flashcard Üretimi", NameTr = "Flashcard Üretimi", NameEn = "Flashcard Generation", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "summary", Name = "Özet", NameTr = "Özet", NameEn = "Summary", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "lesson_plan", Name = "Ders Planı", NameTr = "Ders Planı", NameEn = "Lesson Plan", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "worksheet", Name = "Çalışma Yaprağı", NameTr = "Çalışma Yaprağı", NameEn = "Worksheet", DisplayOrder = 5, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "essay_prompt", Name = "Kompozisyon Sorusu", NameTr = "Kompozisyon Sorusu", NameEn = "Essay Prompt", DisplayOrder = 6, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_generation_type", Code = "study_guide", Name = "Çalışma Rehberi", NameTr = "Çalışma Rehberi", NameEn = "Study Guide", DisplayOrder = 7, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 2. Content Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "pdf", Name = "PDF", NameTr = "PDF", NameEn = "PDF", Icon = "📄", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "docx", Name = "Word Belgesi", NameTr = "Word Belgesi", NameEn = "Word Document", Icon = "📝", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "pptx", Name = "PowerPoint", NameTr = "PowerPoint", NameEn = "PowerPoint", Icon = "📊", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "txt", Name = "Metin Dosyası", NameTr = "Metin Dosyası", NameEn = "Text File", Icon = "📃", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "image", Name = "Resim", NameTr = "Resim", NameEn = "Image", Icon = "🖼️", DisplayOrder = 5, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "video", Name = "Video", NameTr = "Video", NameEn = "Video", Icon = "🎥", DisplayOrder = 6, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "content_type", Code = "audio", Name = "Ses", NameTr = "Ses", NameEn = "Audio", Icon = "🔊", DisplayOrder = 7, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 3. Lesson Template Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "5e_model", Name = "5E Modeli", NameTr = "5E Modeli", NameEn = "5E Model", Description = "Engage, Explore, Explain, Elaborate, Evaluate", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "project_based", Name = "Proje Tabanlı", NameTr = "Proje Tabanlı Öğrenme", NameEn = "Project-Based Learning", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "flipped_classroom", Name = "Ters Yüz Sınıf", NameTr = "Ters Yüz Sınıf", NameEn = "Flipped Classroom", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "traditional", Name = "Geleneksel", NameTr = "Geleneksel (Doğrudan Öğretim)", NameEn = "Traditional (Direct Instruction)", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "inquiry_based", Name = "Sorgulamaya Dayalı", NameTr = "Sorgulamaya Dayalı Öğrenme", NameEn = "Inquiry-Based Learning", DisplayOrder = 5, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "jigsaw", Name = "Jigsaw İşbirlikli", NameTr = "Jigsaw İşbirlikli Öğrenme", NameEn = "Jigsaw Cooperative Learning", DisplayOrder = 6, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "socratic_seminar", Name = "Sokratik Seminer", NameTr = "Sokratik Seminer", NameEn = "Socratic Seminar", DisplayOrder = 7, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "lesson_template_type", Code = "problem_solving", Name = "Problem Çözme Atölyesi", NameTr = "Problem Çözme Atölyesi", NameEn = "Problem-Solving Workshop", DisplayOrder = 8, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 4. Assignment Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "homework", Name = "Ödev", NameTr = "Ödev", NameEn = "Homework", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "project", Name = "Proje", NameTr = "Proje", NameEn = "Project", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "research", Name = "Araştırma", NameTr = "Araştırma", NameEn = "Research", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "presentation", Name = "Sunum", NameTr = "Sunum", NameEn = "Presentation", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "lab_work", Name = "Laboratuvar Çalışması", NameTr = "Laboratuvar Çalışması", NameEn = "Lab Work", DisplayOrder = 5, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "reading", Name = "Okuma", NameTr = "Okuma Ödevi", NameEn = "Reading Assignment", DisplayOrder = 6, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "assignment_type", Code = "writing", Name = "Yazma", NameTr = "Yazma Ödevi", NameEn = "Writing Assignment", DisplayOrder = 7, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 5. Learning Style Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "learning_style", Code = "visual", Name = "Görsel", NameTr = "Görsel Öğrenici", NameEn = "Visual Learner", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "learning_style", Code = "auditory", Name = "İşitsel", NameTr = "İşitsel Öğrenici", NameEn = "Auditory Learner", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "learning_style", Code = "kinesthetic", Name = "Kinestetik", NameTr = "Kinestetik Öğrenici", NameEn = "Kinesthetic Learner", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "learning_style", Code = "reading_writing", Name = "Okuma-Yazma", NameTr = "Okuma-Yazma Öğrenici", NameEn = "Reading-Writing Learner", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 6. AI Provider Types
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_provider", Code = "openai", Name = "OpenAI", NameTr = "OpenAI (GPT-4)", NameEn = "OpenAI (GPT-4)", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_provider", Code = "azure_openai", Name = "Azure OpenAI", NameTr = "Azure OpenAI", NameEn = "Azure OpenAI", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_provider", Code = "anthropic", Name = "Anthropic Claude", NameTr = "Anthropic Claude", NameEn = "Anthropic Claude", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "ai_provider", Code = "local_llm", Name = "Local LLM", NameTr = "Yerel LLM (Ollama)", NameEn = "Local LLM (Ollama)", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // 7. Generation Status
            definitions.AddRange(new[]
            {
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "pending", Name = "Beklemede", NameTr = "Beklemede", NameEn = "Pending", Color = "#FFA500", DisplayOrder = 1, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "processing", Name = "İşleniyor", NameTr = "İşleniyor", NameEn = "Processing", Color = "#1E90FF", DisplayOrder = 2, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "completed", Name = "Tamamlandı", NameTr = "Tamamlandı", NameEn = "Completed", Color = "#32CD32", DisplayOrder = 3, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "failed", Name = "Başarısız", NameTr = "Başarısız", NameEn = "Failed", Color = "#FF4500", DisplayOrder = 4, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "approved", Name = "Onaylandı", NameTr = "Onaylandı", NameEn = "Approved", Color = "#228B22", DisplayOrder = 5, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true },
                new SystemDefinition { Id = Guid.NewGuid(), TenantId = tenantId, Category = "generation_status", Code = "rejected", Name = "Reddedildi", NameTr = "Reddedildi", NameEn = "Rejected", Color = "#DC143C", DisplayOrder = 6, IsSystemReserved = true, CreatedAt = now, UpdatedAt = now, IsActive = true }
            });

            // Remove existing AI definitions to avoid duplicates
            var existingCategories = new[] { "ai_generation_type", "content_type", "lesson_template_type", "assignment_type", "learning_style", "ai_provider", "generation_status" };
            var existing = _context.SystemDefinitions.Where(d => existingCategories.Contains(d.Category)).ToList();
            _context.SystemDefinitions.RemoveRange(existing);

            // Add new definitions
            _context.SystemDefinitions.AddRange(definitions);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} AI-related definitions across {CategoryCount} categories",
                definitions.Count, existingCategories.Length);

            return Ok(new
            {
                message = "AI definitions seeded successfully",
                count = definitions.Count,
                categories = existingCategories
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding AI definitions");
            return StatusCode(500, new { error = "Failed to seed definitions", details = ex.Message });
        }
    }
}

