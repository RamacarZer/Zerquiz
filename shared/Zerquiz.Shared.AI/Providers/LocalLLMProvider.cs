using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Shared.AI.Providers;

/// <summary>
/// Local LLM provider (Ollama, LM Studio, etc. via HTTP API)
/// </summary>
public class LocalLLMProvider : IAIProvider
{
    private readonly AIConfig _config;
    private readonly ILogger<LocalLLMProvider> _logger;
    private readonly HttpClient _httpClient;

    public LocalLLMProvider(AIConfig config, ILogger<LocalLLMProvider> logger, HttpClient httpClient)
    {
        _config = config;
        _logger = logger;
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(_config.Endpoint);
        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    public async Task<AIResponse<string>> GenerateTextAsync(AIPrompt prompt, CancellationToken cancellationToken = default)
    {
        try
        {
            var requestBody = new
            {
                model = _config.Model,
                prompt = $"{prompt.SystemMessage}\n\n{prompt.UserMessage}",
                temperature = prompt.Temperature ?? _config.Temperature,
                max_tokens = prompt.MaxTokens ?? _config.MaxTokens,
                stream = false
            };

            var response = await _httpClient.PostAsJsonAsync("/api/generate", requestBody, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken);

            return new AIResponse<string>
            {
                Success = true,
                Data = result?.Response ?? string.Empty,
                RawResponse = result?.Response,
                TokensUsed = 0, // Ollama doesn't provide token count
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating text with Local LLM");
            return new AIResponse<string>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<QuizData>> GenerateQuizAsync(ContentInput input, QuizConfig config, CancellationToken cancellationToken = default)
    {
        // Delegate to text generation with appropriate prompt
        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator. Generate questions in JSON format.",
            UserMessage = $"Generate {config.Count} questions from this content:\n{input.Content}\n\nReturn JSON format."
        };

        var textResponse = await GenerateTextAsync(prompt, cancellationToken);
        
        if (!textResponse.Success)
        {
            return new AIResponse<QuizData> { Success = false, Error = textResponse.Error };
        }

        try
        {
            var quizData = JsonSerializer.Deserialize<QuizData>(textResponse.Data ?? "{}", new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new AIResponse<QuizData>
            {
                Success = true,
                Data = quizData,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            return new AIResponse<QuizData> { Success = false, Error = ex.Message };
        }
    }

    public async Task<AIResponse<FlashcardSet>> GenerateFlashcardsAsync(ContentInput input, int count, CancellationToken cancellationToken = default)
    {
        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator. Generate flashcards in JSON format.",
            UserMessage = $"Generate {count} flashcards from this content:\n{input.Content}\n\nReturn JSON format."
        };

        var textResponse = await GenerateTextAsync(prompt, cancellationToken);
        
        if (!textResponse.Success)
        {
            return new AIResponse<FlashcardSet> { Success = false, Error = textResponse.Error };
        }

        try
        {
            var flashcardSet = JsonSerializer.Deserialize<FlashcardSet>(textResponse.Data ?? "{}", new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new AIResponse<FlashcardSet>
            {
                Success = true,
                Data = flashcardSet,
                RawResponse = textResponse.Data,
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            return new AIResponse<FlashcardSet> { Success = false, Error = ex.Message };
        }
    }

    public async Task<AIResponse<string>> GenerateSummaryAsync(ContentInput input, SummaryLength length, CancellationToken cancellationToken = default)
    {
        var lengthText = length switch
        {
            SummaryLength.Short => "short (2-3 paragraphs)",
            SummaryLength.Medium => "medium (4-6 paragraphs)",
            SummaryLength.Long => "detailed (7-10 paragraphs)",
            _ => "medium"
        };

        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator.",
            UserMessage = $"Create a {lengthText} summary of this content:\n{input.Content}"
        };

        return await GenerateTextAsync(prompt, cancellationToken);
    }

    public async Task<AIResponse<LessonPlanData>> GenerateLessonPlanAsync(LessonPlanInput input, CancellationToken cancellationToken = default)
    {
        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator. Generate lesson plans in JSON format.",
            UserMessage = $"Create a lesson plan for:\nTopic: {input.Topic}\nSubject: {input.Subject}\nGrade: {input.Grade}\nDuration: {input.Duration} minutes\n\nReturn JSON format."
        };

        var textResponse = await GenerateTextAsync(prompt, cancellationToken);
        
        if (!textResponse.Success)
        {
            return new AIResponse<LessonPlanData> { Success = false, Error = textResponse.Error };
        }

        try
        {
            var lessonPlan = JsonSerializer.Deserialize<LessonPlanData>(textResponse.Data ?? "{}", new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new AIResponse<LessonPlanData>
            {
                Success = true,
                Data = lessonPlan,
                RawResponse = textResponse.Data,
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            return new AIResponse<LessonPlanData> { Success = false, Error = ex.Message };
        }
    }

    public async Task<AIResponse<WorksheetData>> GenerateWorksheetAsync(ContentInput input, CancellationToken cancellationToken = default)
    {
        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator. Generate worksheets in JSON format.",
            UserMessage = $"Create a worksheet from this content:\n{input.Content}\n\nReturn JSON format."
        };

        var textResponse = await GenerateTextAsync(prompt, cancellationToken);
        
        if (!textResponse.Success)
        {
            return new AIResponse<WorksheetData> { Success = false, Error = textResponse.Error };
        }

        try
        {
            var worksheet = JsonSerializer.Deserialize<WorksheetData>(textResponse.Data ?? "{}", new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new AIResponse<WorksheetData>
            {
                Success = true,
                Data = worksheet,
                RawResponse = textResponse.Data,
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            return new AIResponse<WorksheetData> { Success = false, Error = ex.Message };
        }
    }

    public async Task<AIResponse<EssayAnalysis>> AnalyzeEssayAsync(string essay, string rubric, CancellationToken cancellationToken = default)
    {
        var prompt = new AIPrompt
        {
            SystemMessage = "You are a professional educator. Analyze essays in JSON format.",
            UserMessage = $"Analyze this essay:\n{essay}\n\nUsing this rubric:\n{rubric}\n\nReturn JSON format."
        };

        var textResponse = await GenerateTextAsync(prompt, cancellationToken);
        
        if (!textResponse.Success)
        {
            return new AIResponse<EssayAnalysis> { Success = false, Error = textResponse.Error };
        }

        try
        {
            var analysis = JsonSerializer.Deserialize<EssayAnalysis>(textResponse.Data ?? "{}", new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new AIResponse<EssayAnalysis>
            {
                Success = true,
                Data = analysis,
                RawResponse = textResponse.Data,
                Provider = "local_llm",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            return new AIResponse<EssayAnalysis> { Success = false, Error = ex.Message };
        }
    }

    private class OllamaResponse
    {
        public string? Response { get; set; }
    }
}




