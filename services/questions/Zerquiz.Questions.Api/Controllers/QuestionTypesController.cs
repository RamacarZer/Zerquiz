using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Zerquiz.Questions.Api.Controllers;

/// <summary>
/// Question Types Management - 65 soru tipi yönetimi
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuestionTypesController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<QuestionTypesController> _logger;
    private readonly IConfiguration _configuration;

    public QuestionTypesController(
        IHttpClientFactory httpClientFactory,
        ILogger<QuestionTypesController> logger,
        IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// Tüm soru tiplerini getir (Core Service'ten)
    /// GET /api/QuestionTypes/list
    /// </summary>
    [HttpGet("list")]
    public async Task<ActionResult> GetAll(
        [FromQuery] string language = "tr",
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var coreServiceUrl = _configuration["Services:CoreService"] ?? "http://localhost:5001";
            var client = _httpClientFactory.CreateClient();
            
            var url = $"{coreServiceUrl}/api/Definitions/dropdown/question_types?language={language}&includeInactive={includeInactive}";
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch question types from Core Service. Status: {Status}", response.StatusCode);
                return StatusCode((int)response.StatusCode, "Failed to fetch question types");
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(content);

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching question types");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Soru tipi detayını getir
    /// GET /api/QuestionTypes/{code}
    /// </summary>
    [HttpGet("{code}")]
    public async Task<ActionResult> GetByCode(
        string code,
        [FromQuery] string language = "tr")
    {
        try
        {
            var coreServiceUrl = _configuration["Services:CoreService"] ?? "http://localhost:5001";
            var client = _httpClientFactory.CreateClient();
            
            var url = $"{coreServiceUrl}/api/Definitions/by-code/{code}?groupCode=question_types&language={language}";
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return NotFound(new { error = "Question type not found", code });
                
                return StatusCode((int)response.StatusCode, "Failed to fetch question type");
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(content);

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching question type {Code}", code);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Soru tipi için JSON schema getir (dynamic form generation için)
    /// GET /api/QuestionTypes/{code}/schema
    /// </summary>
    [HttpGet("{code}/schema")]
    public async Task<ActionResult> GetSchema(string code)
    {
        try
        {
            // AI template'lerden schema oku
            var templatePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "..", "..", "..", "shared", "Zerquiz.Shared.AI", "Templates",
                GetTemplateFileName(code));

            if (!System.IO.File.Exists(templatePath))
            {
                // Fallback: shared library path
                templatePath = Path.Combine(
                    AppDomain.CurrentDomain.BaseDirectory,
                    "..", "..", "..", "..", "shared", "Zerquiz.Shared.AI", "Templates",
                    GetTemplateFileName(code));
            }

            if (!System.IO.File.Exists(templatePath))
            {
                _logger.LogWarning("Template file not found for question type {Code}", code);
                return NotFound(new { error = "Template not found", code });
            }

            var templateJson = await System.IO.File.ReadAllTextAsync(templatePath);
            var template = JsonSerializer.Deserialize<JsonElement>(templateJson);

            // Extract JSON schema if exists
            if (template.TryGetProperty("jsonSchema", out var schema))
            {
                return Ok(new
                {
                    code,
                    schema = schema,
                    template = template.TryGetProperty("outputExample", out var example) ? example : (JsonElement?)null
                });
            }

            // Generate basic schema from template structure
            var basicSchema = GenerateBasicSchema(code, template);
            return Ok(new { code, schema = basicSchema });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching schema for question type {Code}", code);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Kategorilere göre gruplandırılmış soru tipleri
    /// GET /api/QuestionTypes/categories
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult> GetByCategories(
        [FromQuery] string language = "tr",
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var coreServiceUrl = _configuration["Services:CoreService"] ?? "http://localhost:5001";
            var client = _httpClientFactory.CreateClient();
            
            var url = $"{coreServiceUrl}/api/Definitions/dropdown/question_types?language={language}&includeInactive={includeInactive}";
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch question types");
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);
            var items = jsonDoc.RootElement.GetProperty("items");

            // Group by category (from metadata)
            var categories = new Dictionary<string, List<object>>();
            
            foreach (var item in items.EnumerateArray())
            {
                var category = "other";
                
                if (item.TryGetProperty("metadata", out var metadata))
                {
                    var metadataObj = JsonSerializer.Deserialize<JsonElement>(metadata.GetString() ?? "{}");
                    if (metadataObj.TryGetProperty("category", out var cat))
                    {
                        category = cat.GetString() ?? "other";
                    }
                }

                if (!categories.ContainsKey(category))
                {
                    categories[category] = new List<object>();
                }

                categories[category].Add(new
                {
                    id = item.GetProperty("id").GetGuid(),
                    code = item.GetProperty("code").GetString(),
                    value = item.GetProperty("value").GetString(),
                    displayOrder = item.TryGetProperty("displayOrder", out var order) ? order.GetInt32() : 0,
                    iconName = item.TryGetProperty("iconName", out var icon) ? icon.GetString() : null,
                    metadata = item.TryGetProperty("metadata", out var meta) ? meta.GetString() : null
                });
            }

            // Define category display order and names
            var categoryInfo = new Dictionary<string, object>
            {
                ["classic"] = new { name = GetCategoryName("classic", language), order = 1 },
                ["modern"] = new { name = GetCategoryName("modern", language), order = 2 },
                ["interactive"] = new { name = GetCategoryName("interactive", language), order = 3 },
                ["visual"] = new { name = GetCategoryName("visual", language), order = 4 },
                ["multimedia"] = new { name = GetCategoryName("multimedia", language), order = 5 },
                ["advanced"] = new { name = GetCategoryName("advanced", language), order = 6 },
                ["coding"] = new { name = GetCategoryName("coding", language), order = 7 },
                ["other"] = new { name = GetCategoryName("other", language), order = 99 }
            };

            var result = categories
                .OrderBy(c => categoryInfo.ContainsKey(c.Key) 
                    ? ((dynamic)categoryInfo[c.Key]).order 
                    : 99)
                .Select(c => new
                {
                    category = c.Key,
                    categoryName = categoryInfo.ContainsKey(c.Key) 
                        ? ((dynamic)categoryInfo[c.Key]).name 
                        : c.Key,
                    types = c.Value.OrderBy(t => ((dynamic)t).displayOrder)
                })
                .ToList();

            return Ok(new
            {
                language,
                totalTypes = items.GetArrayLength(),
                totalCategories = result.Count,
                categories = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching categorized question types");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Soru tipi için validation rules getir
    /// GET /api/QuestionTypes/{code}/validation
    /// </summary>
    [HttpGet("{code}/validation")]
    public ActionResult GetValidationRules(string code)
    {
        try
        {
            var rules = GetValidationRulesForType(code);
            return Ok(new
            {
                code,
                rules
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching validation rules for {Code}", code);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    #region Helper Methods

    private string GetTemplateFileName(string code)
    {
        // Template dosya adı mapping
        var templateMap = new Dictionary<string, string>
        {
            ["multiple_choice_single"] = "01_multiple_choice_single.json",
            ["multiple_choice_multiple"] = "02_multiple_choice_multiple.json",
            ["true_false"] = "03_true_false.json",
            ["short_answer"] = "04_short_answer.json",
            ["essay"] = "05_essay.json",
            ["fill_blank"] = "06_fill_blank.json",
            ["open_ended"] = "07_open_ended.json",
            ["numeric_input"] = "08_numeric_input.json",
            ["ordering_sequence"] = "09_ordering_sequence.json",
            ["matching_pairs"] = "10_matching_pairs.json"
            // Add more mappings as needed
        };

        return templateMap.ContainsKey(code) ? templateMap[code] : $"{code}.json";
    }

    private object GenerateBasicSchema(string code, JsonElement template)
    {
        // Generate basic schema for dynamic form
        return new
        {
            type = "object",
            properties = new
            {
                stem = new { type = "string", title = "Soru Metni", required = true },
                options = code.Contains("multiple_choice") ? new { type = "array", items = new { type = "string" } } : null,
                correctAnswer = new { type = "string", title = "Doğru Cevap" },
                explanation = new { type = "string", title = "Açıklama" },
                points = new { type = "number", title = "Puan", defaultValue = 5 }
            }
        };
    }

    private string GetCategoryName(string category, string language)
    {
        var names = new Dictionary<string, Dictionary<string, string>>
        {
            ["classic"] = new() { ["tr"] = "Klasik Sorular", ["en"] = "Classic Questions", ["ar"] = "الأسئلة الكلاسيكية" },
            ["modern"] = new() { ["tr"] = "Modern Sorular", ["en"] = "Modern Questions", ["ar"] = "الأسئلة الحديثة" },
            ["interactive"] = new() { ["tr"] = "Etkileşimli", ["en"] = "Interactive", ["ar"] = "تفاعلية" },
            ["visual"] = new() { ["tr"] = "Görsel", ["en"] = "Visual", ["ar"] = "بصرية" },
            ["multimedia"] = new() { ["tr"] = "Multimedya", ["en"] = "Multimedia", ["ar"] = "وسائط متعددة" },
            ["advanced"] = new() { ["tr"] = "Gelişmiş", ["en"] = "Advanced", ["ar"] = "متقدم" },
            ["coding"] = new() { ["tr"] = "Kodlama", ["en"] = "Coding", ["ar"] = "البرمجة" },
            ["other"] = new() { ["tr"] = "Diğer", ["en"] = "Other", ["ar"] = "آخر" }
        };

        return names.ContainsKey(category) && names[category].ContainsKey(language)
            ? names[category][language]
            : category;
    }

    private object GetValidationRulesForType(string code)
    {
        // Question type'a göre validation rules
        var rules = new Dictionary<string, object>
        {
            ["stem"] = new { required = true, minLength = 10, maxLength = 2000 },
            ["points"] = new { required = true, min = 1, max = 100 }
        };

        if (code.Contains("multiple_choice"))
        {
            rules["options"] = new { required = true, minItems = 2, maxItems = 10 };
            rules["correctAnswer"] = new { required = true };
        }
        else if (code == "true_false")
        {
            rules["correctAnswer"] = new { required = true, allowedValues = new[] { "true", "false" } };
        }
        else if (code == "fill_blank")
        {
            rules["blanks"] = new { required = true, minItems = 1, maxItems = 20 };
        }
        else if (code == "matching_pairs")
        {
            rules["pairs"] = new { required = true, minItems = 2, maxItems = 15 };
        }

        return rules;
    }

    #endregion
}

