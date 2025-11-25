using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedDefinitionsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public SeedDefinitionsController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Seed definition system with initial data
    /// </summary>
    [HttpPost("seed-all")]
    public async Task<ActionResult> SeedAll()
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        // Check if already seeded
        if (await _context.DefinitionGroups.AnyAsync())
        {
            return Ok(new { message = "Definition groups already exist. Skipping seed." });
        }

        // 1. Seed Definition Groups
        var groups = new List<DefinitionGroup>
        {
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "SUBJECT",
                Name = "Branş",
                Description = "Ana branş tanımları (Matematik, Fizik, Kimya...)",
                IsSystem = true,
                DisplayOrder = 1,
                Icon = "📚",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "SUB_SUBJECT",
                Name = "Alt Branş",
                Description = "Branş alt kategorileri (Cebir, Geometri...)",
                IsSystem = true,
                DisplayOrder = 2,
                Icon = "📖",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "TOPIC",
                Name = "Konu",
                Description = "Ana konu başlıkları",
                IsSystem = true,
                DisplayOrder = 3,
                Icon = "📝",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "SUB_TOPIC",
                Name = "Alt Konu",
                Description = "Konu alt başlıkları",
                IsSystem = true,
                DisplayOrder = 4,
                Icon = "📄",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "TITLE",
                Name = "Başlık",
                Description = "Detay başlıkları",
                IsSystem = true,
                DisplayOrder = 5,
                Icon = "🔖",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = "OUTCOME",
                Name = "Kazanım",
                Description = "Öğrenme kazanımları",
                IsSystem = true,
                DisplayOrder = 6,
                Icon = "🎯",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        _context.DefinitionGroups.AddRange(groups);
        await _context.SaveChangesAsync();

        // 2. Add translations for groups
        var groupTranslations = new List<DefinitionGroupTranslation>();
        foreach (var group in groups)
        {
            // English
            groupTranslations.Add(new DefinitionGroupTranslation
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DefinitionGroupId = group.Id,
                LanguageCode = "en",
                Name = GetEnglishGroupName(group.Code),
                Description = GetEnglishGroupDescription(group.Code),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });

            // German
            groupTranslations.Add(new DefinitionGroupTranslation
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DefinitionGroupId = group.Id,
                LanguageCode = "de",
                Name = GetGermanGroupName(group.Code),
                Description = GetGermanGroupDescription(group.Code),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        _context.DefinitionGroupTranslations.AddRange(groupTranslations);
        await _context.SaveChangesAsync();

        // 3. Seed Sample Definitions
        var subjectGroup = groups.First(g => g.Code == "SUBJECT");
        var subSubjectGroup = groups.First(g => g.Code == "SUB_SUBJECT");
        var topicGroup = groups.First(g => g.Code == "TOPIC");
        var subTopicGroup = groups.First(g => g.Code == "SUB_TOPIC");
        var titleGroup = groups.First(g => g.Code == "TITLE");
        var outcomeGroup = groups.First(g => g.Code == "OUTCOME");

        var definitions = new List<Definition>();

        // SUBJECTS (Branşlar)
        var mathSubject = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = subjectGroup.Id,
            GroupKey = "SUBJECT",
            ParentId = null,
            Code = "MATH",
            Name = "Matematik",
            Description = "Matematik dersi",
            Color = "#3B82F6",
            Icon = "🔢",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(mathSubject);

        var physicsSubject = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = subjectGroup.Id,
            GroupKey = "SUBJECT",
            ParentId = null,
            Code = "PHYS",
            Name = "Fizik",
            Description = "Fizik dersi",
            Color = "#10B981",
            Icon = "⚛️",
            DisplayOrder = 2,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(physicsSubject);

        // SUB-SUBJECTS (Alt Branşlar) - Matematik
        var algebraSubSubject = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = subSubjectGroup.Id,
            GroupKey = "SUB_SUBJECT",
            ParentId = mathSubject.Id,
            Code = "MATH.ALG",
            Name = "Cebir",
            Description = "Cebirsel işlemler ve denklemler",
            Color = "#3B82F6",
            Icon = "🔤",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(algebraSubSubject);

        var geometrySubSubject = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = subSubjectGroup.Id,
            GroupKey = "SUB_SUBJECT",
            ParentId = mathSubject.Id,
            Code = "MATH.GEO",
            Name = "Geometri",
            Description = "Şekiller ve uzay geometrisi",
            Color = "#3B82F6",
            Icon = "📐",
            DisplayOrder = 2,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(geometrySubSubject);

        // TOPICS (Konular) - Cebir
        var equationsTopic = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = topicGroup.Id,
            GroupKey = "TOPIC",
            ParentId = algebraSubSubject.Id,
            Code = "MATH.ALG.EQ",
            Name = "Denklemler",
            Description = "Doğrusal ve ikinci dereceden denklemler",
            Color = "#3B82F6",
            Icon = "=",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(equationsTopic);

        // SUB-TOPICS (Alt Konular) - Denklemler
        var linearEquationsSubTopic = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = subTopicGroup.Id,
            GroupKey = "SUB_TOPIC",
            ParentId = equationsTopic.Id,
            Code = "MATH.ALG.EQ.LIN",
            Name = "Doğrusal Denklemler",
            Description = "Birinci dereceden denklemler",
            Color = "#3B82F6",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(linearEquationsSubTopic);

        // TITLES (Başlıklar) - Doğrusal Denklemler
        var oneVariableTitle = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = titleGroup.Id,
            GroupKey = "TITLE",
            ParentId = linearEquationsSubTopic.Id,
            Code = "MATH.ALG.EQ.LIN.ONE",
            Name = "Tek Bilinmeyenli Denklemler",
            Description = "Bir bilinmeyenli doğrusal denklemler",
            Color = "#3B82F6",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(oneVariableTitle);

        // OUTCOMES (Kazanımlar) - Tek Bilinmeyenli Denklemler
        var outcome1 = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = outcomeGroup.Id,
            GroupKey = "OUTCOME",
            ParentId = oneVariableTitle.Id,
            Code = "MATH.ALG.EQ.LIN.ONE.O1",
            Name = "Tek bilinmeyenli birinci dereceden denklemleri çözer",
            Description = "Öğrenci, tek bilinmeyenli birinci dereceden denklemleri çözebilir.",
            Color = "#3B82F6",
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(outcome1);

        var outcome2 = new Definition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            GroupId = outcomeGroup.Id,
            GroupKey = "OUTCOME",
            ParentId = oneVariableTitle.Id,
            Code = "MATH.ALG.EQ.LIN.ONE.O2",
            Name = "Denklem kurarak problemleri çözer",
            Description = "Öğrenci, günlük hayat problemlerini denklem kurarak çözebilir.",
            Color = "#3B82F6",
            DisplayOrder = 2,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        definitions.Add(outcome2);

        _context.Definitions.AddRange(definitions);
        await _context.SaveChangesAsync();

        // 4. Add sample translations for definitions
        var defTranslations = new List<DefinitionTranslation>
        {
            // Mathematics translations
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DefinitionId = mathSubject.Id,
                LanguageCode = "en",
                Name = "Mathematics",
                Description = "Mathematics course",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DefinitionId = mathSubject.Id,
                LanguageCode = "de",
                Name = "Mathematik",
                Description = "Mathematikkurs",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            // Algebra translations
            new() {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DefinitionId = algebraSubSubject.Id,
                LanguageCode = "en",
                Name = "Algebra",
                Description = "Algebraic operations and equations",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        _context.DefinitionTranslations.AddRange(defTranslations);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Definition system seeded successfully!",
            definitionGroups = groups.Count,
            definitions = definitions.Count,
            groupTranslations = groupTranslations.Count,
            definitionTranslations = defTranslations.Count
        });
    }

    // Helper methods for translations
    private string GetEnglishGroupName(string code) => code switch
    {
        "SUBJECT" => "Subject",
        "SUB_SUBJECT" => "Sub-Subject",
        "TOPIC" => "Topic",
        "SUB_TOPIC" => "Sub-Topic",
        "TITLE" => "Title",
        "OUTCOME" => "Learning Outcome",
        _ => code
    };

    private string GetEnglishGroupDescription(string code) => code switch
    {
        "SUBJECT" => "Main subject definitions (Math, Physics, Chemistry...)",
        "SUB_SUBJECT" => "Subject sub-categories (Algebra, Geometry...)",
        "TOPIC" => "Main topic headings",
        "SUB_TOPIC" => "Topic sub-headings",
        "TITLE" => "Detail titles",
        "OUTCOME" => "Learning outcomes",
        _ => code
    };

    private string GetGermanGroupName(string code) => code switch
    {
        "SUBJECT" => "Fach",
        "SUB_SUBJECT" => "Unterfach",
        "TOPIC" => "Thema",
        "SUB_TOPIC" => "Unterthema",
        "TITLE" => "Titel",
        "OUTCOME" => "Lernergebnis",
        _ => code
    };

    private string GetGermanGroupDescription(string code) => code switch
    {
        "SUBJECT" => "Hauptfachdefinitionen (Mathematik, Physik, Chemie...)",
        "SUB_SUBJECT" => "Fachunterkategorien (Algebra, Geometrie...)",
        "TOPIC" => "Hauptthemenüberschriften",
        "SUB_TOPIC" => "Thema-Unterüberschriften",
        "TITLE" => "Detailtitel",
        "OUTCOME" => "Lernergebnisse",
        _ => code
    };
}

