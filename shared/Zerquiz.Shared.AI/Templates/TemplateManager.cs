using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Zerquiz.Shared.AI.Templates;

/// <summary>
/// Template model for AI content generation
/// </summary>
public class ContentTemplate
{
    public string TemplateId { get; set; } = string.Empty;
    public string QuestionTypeCode { get; set; } = string.Empty;
    public TemplateMetadata Metadata { get; set; } = new();
    public PromptConfig PromptConfig { get; set; } = new();
    public string PromptTemplateTr { get; set; } = string.Empty;
    public string? PromptTemplateEn { get; set; }
    public TemplateValidation Validation { get; set; } = new();
    public PostProcessing? PostProcessing { get; set; }
    public Dictionary<string, object>? ExampleOutput { get; set; }
}

public class TemplateMetadata
{
    public string CreatedBy { get; set; } = "system";
    public string Version { get; set; } = "1.0";
    public string Language { get; set; } = "tr";
    public string Category { get; set; } = string.Empty;
}

public class PromptConfig
{
    public string SystemMessageTr { get; set; } = string.Empty;
    public string? SystemMessageEn { get; set; }
    public int ContextWindow { get; set; } = 2000;
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 1500;
}

public class TemplateValidation
{
    public List<string> RequiredFields { get; set; } = new();
    public int? MinOptions { get; set; }
    public int? MaxOptions { get; set; }
    public string? CorrectAnswerFormat { get; set; }
    public bool RequireExplanation { get; set; }
}

public class PostProcessing
{
    public int AutoAssignPoints { get; set; } = 5;
    public bool AutoTagConcepts { get; set; }
    public bool AutoDetectDifficulty { get; set; }
}

/// <summary>
/// Manages AI generation templates
/// </summary>
public class TemplateManager
{
    private readonly ILogger<TemplateManager> _logger;
    private readonly Dictionary<string, ContentTemplate> _templates = new();

    public TemplateManager(ILogger<TemplateManager> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Load all templates from embedded resources or file system
    /// </summary>
    public async Task LoadTemplatesAsync(string templatesDirectory)
    {
        try
        {
            if (!Directory.Exists(templatesDirectory))
            {
                _logger.LogWarning("Templates directory not found: {Directory}", templatesDirectory);
                return;
            }

            var templateFiles = Directory.GetFiles(templatesDirectory, "*.json");
            
            foreach (var file in templateFiles)
            {
                try
                {
                    var json = await File.ReadAllTextAsync(file);
                    var template = JsonSerializer.Deserialize<ContentTemplate>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (template != null && !string.IsNullOrEmpty(template.QuestionTypeCode))
                    {
                        _templates[template.QuestionTypeCode] = template;
                        _logger.LogInformation("Loaded template: {TemplateId} for {QuestionType}", 
                            template.TemplateId, template.QuestionTypeCode);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading template file: {File}", file);
                }
            }

            _logger.LogInformation("Loaded {Count} templates", _templates.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading templates from directory: {Directory}", templatesDirectory);
        }
    }

    /// <summary>
    /// Get template for a specific question type
    /// </summary>
    public ContentTemplate? GetTemplate(string questionTypeCode)
    {
        _templates.TryGetValue(questionTypeCode, out var template);
        return template;
    }

    /// <summary>
    /// Get all available templates
    /// </summary>
    public IReadOnlyDictionary<string, ContentTemplate> GetAllTemplates()
    {
        return _templates;
    }

    /// <summary>
    /// Build prompt from template with variable substitution
    /// </summary>
    public string BuildPrompt(ContentTemplate template, Dictionary<string, string> variables, string language = "tr")
    {
        var promptTemplate = language.ToLower() == "en" && !string.IsNullOrEmpty(template.PromptTemplateEn)
            ? template.PromptTemplateEn
            : template.PromptTemplateTr;

        // Simple variable substitution
        foreach (var (key, value) in variables)
        {
            promptTemplate = promptTemplate.Replace($"{{{{{key}}}}}", value);
        }

        return promptTemplate;
    }

    /// <summary>
    /// Get system message from template
    /// </summary>
    public string GetSystemMessage(ContentTemplate template, string language = "tr")
    {
        return language.ToLower() == "en" && !string.IsNullOrEmpty(template.PromptConfig.SystemMessageEn)
            ? template.PromptConfig.SystemMessageEn
            : template.PromptConfig.SystemMessageTr;
    }
}

