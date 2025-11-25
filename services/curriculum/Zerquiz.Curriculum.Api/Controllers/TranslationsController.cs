using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TranslationsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public TranslationsController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Bir entity'nin tüm çevirilerini getir
    /// </summary>
    [HttpGet("{entityType}/{entityId}")]
    public async Task<ActionResult<Dictionary<string, Dictionary<string, string>>>> GetTranslations(
        string entityType, 
        Guid entityId)
    {
        var translations = await _context.Translations
            .Where(t => t.EntityType == entityType && t.EntityId == entityId)
            .ToListAsync();

        // Group by language and field
        var result = translations
            .GroupBy(t => t.LanguageCode)
            .ToDictionary(
                g => g.Key,
                g => g.ToDictionary(t => t.FieldName, t => t.TranslatedValue)
            );

        return Ok(result);
    }

    /// <summary>
    /// Toplu çeviri kaydet/güncelle
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> SaveTranslations([FromBody] SaveTranslationsRequest request)
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // TODO: Get from auth

        foreach (var languageCode in request.Translations.Keys)
        {
            foreach (var fieldName in request.Translations[languageCode].Keys)
            {
                var translatedValue = request.Translations[languageCode][fieldName];
                
                var existing = await _context.Translations
                    .FirstOrDefaultAsync(t => 
                        t.TenantId == tenantId &&
                        t.EntityType == request.EntityType &&
                        t.EntityId == request.EntityId &&
                        t.FieldName == fieldName &&
                        t.LanguageCode == languageCode);

                if (existing != null)
                {
                    existing.TranslatedValue = translatedValue;
                    existing.UpdatedAt = DateTime.UtcNow;
                    existing.UpdatedBy = null; // TODO: Get from auth
                }
                else
                {
                    var translation = new Translation
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        EntityType = request.EntityType,
                        EntityId = request.EntityId,
                        FieldName = fieldName,
                        LanguageCode = languageCode,
                        TranslatedValue = translatedValue,
                        Status = "approved",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = null, // TODO: Get from auth
                        IsActive = true
                    };
                    _context.Translations.Add(translation);
                }
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Translations saved successfully" });
    }

    /// <summary>
    /// Desteklenen diller listesi
    /// </summary>
    [HttpGet("languages")]
    public ActionResult<List<LanguageDto>> GetSupportedLanguages()
    {
        var languages = new List<LanguageDto>
        {
            new() { Code = "tr", Name = "Türkçe", NativeName = "Türkçe", Flag = "🇹🇷" },
            new() { Code = "en", Name = "English", NativeName = "English", Flag = "🇬🇧" },
            new() { Code = "de", Name = "German", NativeName = "Deutsch", Flag = "🇩🇪" },
            new() { Code = "fr", Name = "French", NativeName = "Français", Flag = "🇫🇷" },
            new() { Code = "ar", Name = "Arabic", NativeName = "العربية", Flag = "🇸🇦" },
            new() { Code = "ru", Name = "Russian", NativeName = "Русский", Flag = "🇷🇺" },
            new() { Code = "es", Name = "Spanish", NativeName = "Español", Flag = "🇪🇸" },
            new() { Code = "zh", Name = "Chinese", NativeName = "中文", Flag = "🇨🇳" }
        };

        return Ok(languages);
    }

    /// <summary>
    /// Çeviri silme
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTranslation(Guid id)
    {
        var translation = await _context.Translations.FindAsync(id);
        if (translation == null)
            return NotFound();

        _context.Translations.Remove(translation);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class SaveTranslationsRequest
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public Dictionary<string, Dictionary<string, string>> Translations { get; set; } = new();
    // Format: { "en": { "Name": "Mathematics", "Description": "Math subject" }, "de": { ... } }
}

public class LanguageDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NativeName { get; set; } = string.Empty;
    public string Flag { get; set; } = string.Empty;
}

