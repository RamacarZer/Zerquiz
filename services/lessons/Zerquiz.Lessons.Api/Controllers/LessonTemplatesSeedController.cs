using Microsoft.AspNetCore.Mvc;
using Zerquiz.Lessons.Domain.Entities;
using Zerquiz.Lessons.Infrastructure.Persistence;

namespace Zerquiz.Lessons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonTemplatesSeedController : ControllerBase
{
    private readonly LessonsDbContext _context;
    private readonly ILogger<LessonTemplatesSeedController> _logger;

    public LessonTemplatesSeedController(LessonsDbContext context, ILogger<LessonTemplatesSeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("seed")]
    public async Task<ActionResult> SeedLessonTemplates()
    {
        try
        {
            var now = DateTime.UtcNow;
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // System tenant

            var templates = new List<LessonTemplate>
            {
                // 1. 5E Model - MOST POPULAR
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "5e_model",
                    Name = "5E Model",
                    NameTr = "5E Modeli",
                    NameEn = "5E Model",
                    Description = "Engage → Explore → Explain → Elaborate → Evaluate",
                    DescriptionTr = "Dikkat Çekme → Keşfetme → Açıklama → Derinleştirme → Değerlendirme",
                    DescriptionEn = "Engage → Explore → Explain → Elaborate → Evaluate",
                    Icon = "🔬",
                    Color = "#3B82F6", // Blue
                    DisplayOrder = 1,
                    BestFor = "Science, Math, Critical Thinking",
                    EstimatedDuration = "45-60 minutes",
                    IsPopular = true,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""engage"", ""title"": ""Engage (Dikkat Çekme)"", ""duration"": 10, ""description"": ""Hook students' attention with a phenomenon, question, or demonstration""},
    {""type"": ""explore"", ""title"": ""Explore (Keşfetme)"", ""duration"": 15, ""description"": ""Hands-on investigation, experimentation, or inquiry""},
    {""type"": ""explain"", ""title"": ""Explain (Açıklama)"", ""duration"": 10, ""description"": ""Teacher introduces concepts, vocabulary, and explanations""},
    {""type"": ""elaborate"", ""title"": ""Elaborate (Derinleştirme)"", ""duration"": 15, ""description"": ""Apply concepts to new situations, problem-solving""},
    {""type"": ""evaluate"", ""title"": ""Evaluate (Değerlendirme)"", ""duration"": 5, ""description"": ""Assess understanding through formative or summative assessment""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 2. Project-Based Learning
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "project_based",
                    Name = "Project-Based Learning",
                    NameTr = "Proje Tabanlı Öğrenme",
                    NameEn = "Project-Based Learning",
                    Description = "Students create a product or presentation through sustained inquiry",
                    DescriptionTr = "Öğrenciler uzun süreli araştırma ile bir ürün veya sunum oluşturur",
                    DescriptionEn = "Students create a product or presentation through sustained inquiry",
                    Icon = "🎯",
                    Color = "#10B981", // Green
                    DisplayOrder = 2,
                    BestFor = "All Subjects, Collaborative Work",
                    EstimatedDuration = "Multiple sessions (2-4 weeks)",
                    IsPopular = true,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""introduction"", ""title"": ""Problem Introduction"", ""duration"": 30, ""description"": ""Present driving question or challenge""}, 
    {""type"": ""research"", ""title"": ""Research & Planning"", ""duration"": 120, ""description"": ""Students research, plan, and design solution""},
    {""type"": ""development"", ""title"": ""Design & Development"", ""duration"": 180, ""description"": ""Build, create, iterate on project""},
    {""type"": ""presentation"", ""title"": ""Presentation"", ""duration"": 45, ""description"": ""Share findings, product, or solution""},
    {""type"": ""reflection"", ""title"": ""Reflection"", ""duration"": 30, ""description"": ""Reflect on learning and process""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 3. Flipped Classroom
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "flipped_classroom",
                    Name = "Flipped Classroom",
                    NameTr = "Ters Yüz Sınıf",
                    NameEn = "Flipped Classroom",
                    Description = "Pre-class learning (video/reading) + In-class active learning",
                    DescriptionTr = "Ders öncesi öğrenme (video/okuma) + Sınıfta aktif öğrenme",
                    DescriptionEn = "Pre-class learning (video/reading) + In-class active learning",
                    Icon = "🔄",
                    Color = "#8B5CF6", // Purple
                    DisplayOrder = 3,
                    BestFor = "Math, Science, Language",
                    EstimatedDuration = "Pre-class 20-30 min + In-class 45 min",
                    IsPopular = true,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""pre_class"", ""title"": ""Pre-Class (Evde)"", ""duration"": 25, ""description"": ""Students watch video or read material at home""},
    {""type"": ""warm_up"", ""title"": ""Warm-Up (Başlangıç)"", ""duration"": 5, ""description"": ""Quick review of pre-class content""},
    {""type"": ""active_learning"", ""title"": ""Active Learning (Aktif Öğrenme)"", ""duration"": 30, ""description"": ""Problem-solving, discussions, labs, projects""},
    {""type"": ""post_class"", ""title"": ""Post-Class (Pekiştirme)"", ""duration"": 15, ""description"": ""Practice, homework, or additional resources""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 4. Traditional (Direct Instruction)
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "traditional",
                    Name = "Traditional (Direct Instruction)",
                    NameTr = "Geleneksel (Doğrudan Öğretim)",
                    NameEn = "Traditional (Direct Instruction)",
                    Description = "Classic teacher-led instruction with practice and assessment",
                    DescriptionTr = "Klasik öğretmen merkezli öğretim, uygulama ve değerlendirme",
                    DescriptionEn = "Classic teacher-led instruction with practice and assessment",
                    Icon = "📚",
                    Color = "#EF4444", // Red
                    DisplayOrder = 4,
                    BestFor = "Skill-Based, Procedural Knowledge",
                    EstimatedDuration = "45 minutes",
                    IsPopular = false,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""warm_up"", ""title"": ""Warm-Up / Review"", ""duration"": 5, ""description"": ""Review previous content, activate prior knowledge""},
    {""type"": ""presentation"", ""title"": ""Present New Material"", ""duration"": 15, ""description"": ""Teacher explains new concepts, demonstrates""},
    {""type"": ""guided_practice"", ""title"": ""Guided Practice"", ""duration"": 10, ""description"": ""Students practice with teacher support""},
    {""type"": ""independent_practice"", ""title"": ""Independent Practice"", ""duration"": 10, ""description"": ""Students work independently""},
    {""type"": ""closure"", ""title"": ""Closure & Assessment"", ""duration"": 5, ""description"": ""Summarize, check for understanding""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 5. Inquiry-Based Learning
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "inquiry_based",
                    Name = "Inquiry-Based Learning",
                    NameTr = "Sorgulamaya Dayalı Öğrenme",
                    NameEn = "Inquiry-Based Learning",
                    Description = "Students drive learning through questions and investigations",
                    DescriptionTr = "Öğrenciler soru sorarak ve araştırarak öğrenir",
                    DescriptionEn = "Students drive learning through questions and investigations",
                    Icon = "❓",
                    Color = "#F59E0B", // Orange
                    DisplayOrder = 5,
                    BestFor = "Science, Social Studies, Research Skills",
                    EstimatedDuration = "60-90 minutes (or multiple sessions)",
                    IsPopular = false,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""question"", ""title"": ""Generate Questions"", ""duration"": 10, ""description"": ""Students ask questions about topic or phenomenon""},
    {""type"": ""investigate"", ""title"": ""Investigate"", ""duration"": 25, ""description"": ""Research, experiment, gather data""},
    {""type"": ""analyze"", ""title"": ""Analyze & Synthesize"", ""duration"": 15, ""description"": ""Make sense of findings, draw conclusions""},
    {""type"": ""communicate"", ""title"": ""Communicate"", ""duration"": 15, ""description"": ""Share findings with class""},
    {""type"": ""reflect"", ""title"": ""Reflect"", ""duration"": 5, ""description"": ""Reflect on process and learning""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 6. Jigsaw Cooperative Learning
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "jigsaw",
                    Name = "Jigsaw Cooperative Learning",
                    NameTr = "Jigsaw İşbirlikli Öğrenme",
                    NameEn = "Jigsaw Cooperative Learning",
                    Description = "Each student becomes an expert on one part, then teaches others",
                    DescriptionTr = "Her öğrenci bir konuda uzman olur ve diğerlerine öğretir",
                    DescriptionEn = "Each student becomes an expert on one part, then teaches others",
                    Icon = "🧩",
                    Color = "#EC4899", // Pink
                    DisplayOrder = 6,
                    BestFor = "Reading Comprehension, Complex Topics",
                    EstimatedDuration = "60 minutes",
                    IsPopular = false,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""introduction"", ""title"": ""Introduction"", ""duration"": 5, ""description"": ""Explain jigsaw process and assign topics""},
    {""type"": ""expert_groups"", ""title"": ""Expert Groups"", ""duration"": 20, ""description"": ""Students with same topic meet and learn together""},
    {""type"": ""home_groups"", ""title"": ""Home Groups (Teaching)"", ""duration"": 25, ""description"": ""Each expert teaches their part to home group""},
    {""type"": ""assessment"", ""title"": ""Assessment"", ""duration"": 10, ""description"": ""Whole class discussion or individual assessment""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 7. Socratic Seminar
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "socratic_seminar",
                    Name = "Socratic Seminar",
                    NameTr = "Sokratik Seminer",
                    NameEn = "Socratic Seminar",
                    Description = "Student-led discussion through questioning and dialogue",
                    DescriptionTr = "Öğrenci liderliğinde sorgulama ve diyalog yoluyla tartışma",
                    DescriptionEn = "Student-led discussion through questioning and dialogue",
                    Icon = "💬",
                    Color = "#06B6D4", // Cyan
                    DisplayOrder = 7,
                    BestFor = "Literature, Philosophy, Ethics, Critical Thinking",
                    EstimatedDuration = "60 minutes",
                    IsPopular = false,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""preparation"", ""title"": ""Preparation (Pre-class)"", ""duration"": 30, ""description"": ""Students read text and prepare questions""},
    {""type"": ""opening"", ""title"": ""Opening Question"", ""duration"": 5, ""description"": ""Teacher poses opening question""},
    {""type"": ""seminar"", ""title"": ""Seminar Discussion"", ""duration"": 35, ""description"": ""Student-led dialogue, ask questions, build on ideas""},
    {""type"": ""closing"", ""title"": ""Closing Reflection"", ""duration"": 10, ""description"": ""Reflect on discussion and learning""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                },

                // 8. Problem-Solving Workshop
                new LessonTemplate
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Code = "problem_solving",
                    Name = "Problem-Solving Workshop",
                    NameTr = "Problem Çözme Atölyesi",
                    NameEn = "Problem-Solving Workshop",
                    Description = "Structured approach to tackle complex problems collaboratively",
                    DescriptionTr = "Karmaşık problemleri işbirlikli çözmek için yapılandırılmış yaklaşım",
                    DescriptionEn = "Structured approach to tackle complex problems collaboratively",
                    Icon = "⚡",
                    Color = "#14B8A6", // Teal
                    DisplayOrder = 8,
                    BestFor = "Math, Engineering, Design Thinking",
                    EstimatedDuration = "60 minutes",
                    IsPopular = false,
                    IsSystemReserved = true,
                    StructureJson = @"{
  ""phases"": [
    {""type"": ""problem_introduction"", ""title"": ""Problem Introduction"", ""duration"": 10, ""description"": ""Present problem, clarify requirements""},
    {""type"": ""individual_thinking"", ""title"": ""Individual Think Time"", ""duration"": 10, ""description"": ""Students work independently on problem""},
    {""type"": ""group_collaboration"", ""title"": ""Group Collaboration"", ""duration"": 25, ""description"": ""Share strategies, work together, refine solutions""},
    {""type"": ""solution_sharing"", ""title"": ""Solution Sharing"", ""duration"": 10, ""description"": ""Groups present solutions to class""},
    {""type"": ""reflection"", ""title"": ""Reflection"", ""duration"": 5, ""description"": ""Discuss strategies, what worked, what didn't""}
  ]
}",
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsActive = true
                }
            };

            // Remove existing templates
            var existing = _context.LessonTemplates.Where(t => t.IsSystemReserved).ToList();
            _context.LessonTemplates.RemoveRange(existing);

            // Add new templates
            _context.LessonTemplates.AddRange(templates);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} lesson templates", templates.Count);

            return Ok(new
            {
                message = "Lesson templates seeded successfully",
                count = templates.Count,
                templates = templates.Select(t => new
                {
                    t.Code,
                    t.Name,
                    t.NameTr,
                    t.Icon,
                    t.Color,
                    t.IsPopular,
                    t.BestFor
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding lesson templates");
            return StatusCode(500, new { error = "Failed to seed templates", details = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult> GetTemplates([FromQuery] bool popularOnly = false)
    {
        var query = _context.LessonTemplates.Where(t => t.IsActive);

        if (popularOnly)
            query = query.Where(t => t.IsPopular);

        var templates = await query
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new
            {
                t.Id,
                t.Code,
                t.Name,
                t.NameTr,
                t.NameEn,
                t.Description,
                t.DescriptionTr,
                t.Icon,
                t.Color,
                t.BestFor,
                t.EstimatedDuration,
                t.IsPopular,
                t.DisplayOrder
            })
            .ToListAsync();

        return Ok(templates);
    }

    [HttpGet("{code}")]
    public async Task<ActionResult> GetTemplateByCode(string code)
    {
        var template = await _context.LessonTemplates
            .FirstOrDefaultAsync(t => t.Code == code && t.IsActive);

        if (template == null)
            return NotFound(new { error = "Template not found" });

        return Ok(template);
    }
}

