using System.Text.Json;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Logging;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;
using OpenAI.Chat;

namespace Zerquiz.Shared.AI.Providers;

/// <summary>
/// OpenAI provider implementation (GPT-4, GPT-4o)
/// </summary>
public class OpenAIProvider : IAIProvider
{
    private readonly AIConfig _config;
    private readonly ILogger<OpenAIProvider> _logger;
    private readonly AzureOpenAIClient _client;
    private readonly ChatClient _chatClient;

    public OpenAIProvider(AIConfig config, ILogger<OpenAIProvider> logger)
    {
        _config = config;
        _logger = logger;
        
        // Using Azure SDK which works with both OpenAI and Azure OpenAI
        if (string.IsNullOrEmpty(_config.Endpoint))
        {
            // Standard OpenAI
            _client = new AzureOpenAIClient(new Uri("https://api.openai.com/v1"), new AzureKeyCredential(_config.ApiKey));
        }
        else
        {
            // Custom endpoint (e.g., Azure OpenAI)
            _client = new AzureOpenAIClient(new Uri(_config.Endpoint), new AzureKeyCredential(_config.ApiKey));
        }

        _chatClient = _client.GetChatClient(_config.Model);
    }

    public async Task<AIResponse<string>> GenerateTextAsync(AIPrompt prompt, CancellationToken cancellationToken = default)
    {
        try
        {
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(prompt.SystemMessage),
                new UserChatMessage(prompt.UserMessage)
            };

            var options = new ChatCompletionOptions
            {
                Temperature = (float)(prompt.Temperature ?? _config.Temperature),
                MaxOutputTokenCount = prompt.MaxTokens ?? _config.MaxTokens
            };

            var response = await _chatClient.CompleteChatAsync(messages, options, cancellationToken);

            return new AIResponse<string>
            {
                Success = true,
                Data = response.Value.Content[0].Text,
                RawResponse = response.Value.Content[0].Text,
                TokensUsed = response.Value.Usage.TotalTokenCount,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating text with OpenAI");
            return new AIResponse<string>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<QuizData>> GenerateQuizAsync(ContentInput input, QuizConfig config, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildQuizPrompt(input, config);
            var textResponse = await GenerateTextAsync(prompt, cancellationToken);

            if (!textResponse.Success || string.IsNullOrEmpty(textResponse.Data))
            {
                return new AIResponse<QuizData>
                {
                    Success = false,
                    Error = textResponse.Error ?? "Empty response"
                };
            }

            // Parse JSON response
            var quizData = ParseQuizResponse(textResponse.Data);

            return new AIResponse<QuizData>
            {
                Success = true,
                Data = quizData,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating quiz with OpenAI");
            return new AIResponse<QuizData>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<FlashcardSet>> GenerateFlashcardsAsync(ContentInput input, int count, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildFlashcardPrompt(input, count);
            var textResponse = await GenerateTextAsync(prompt, cancellationToken);

            if (!textResponse.Success || string.IsNullOrEmpty(textResponse.Data))
            {
                return new AIResponse<FlashcardSet>
                {
                    Success = false,
                    Error = textResponse.Error ?? "Empty response"
                };
            }

            var flashcardSet = ParseFlashcardResponse(textResponse.Data);

            return new AIResponse<FlashcardSet>
            {
                Success = true,
                Data = flashcardSet,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating flashcards with OpenAI");
            return new AIResponse<FlashcardSet>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<string>> GenerateSummaryAsync(ContentInput input, SummaryLength length, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildSummaryPrompt(input, length);
            return await GenerateTextAsync(prompt, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating summary with OpenAI");
            return new AIResponse<string>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<LessonPlanData>> GenerateLessonPlanAsync(LessonPlanInput input, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildLessonPlanPrompt(input);
            var textResponse = await GenerateTextAsync(prompt, cancellationToken);

            if (!textResponse.Success || string.IsNullOrEmpty(textResponse.Data))
            {
                return new AIResponse<LessonPlanData>
                {
                    Success = false,
                    Error = textResponse.Error ?? "Empty response"
                };
            }

            var lessonPlan = ParseLessonPlanResponse(textResponse.Data);

            return new AIResponse<LessonPlanData>
            {
                Success = true,
                Data = lessonPlan,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating lesson plan with OpenAI");
            return new AIResponse<LessonPlanData>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<WorksheetData>> GenerateWorksheetAsync(ContentInput input, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildWorksheetPrompt(input);
            var textResponse = await GenerateTextAsync(prompt, cancellationToken);

            if (!textResponse.Success || string.IsNullOrEmpty(textResponse.Data))
            {
                return new AIResponse<WorksheetData>
                {
                    Success = false,
                    Error = textResponse.Error ?? "Empty response"
                };
            }

            var worksheet = ParseWorksheetResponse(textResponse.Data);

            return new AIResponse<WorksheetData>
            {
                Success = true,
                Data = worksheet,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating worksheet with OpenAI");
            return new AIResponse<WorksheetData>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<AIResponse<EssayAnalysis>> AnalyzeEssayAsync(string essay, string rubric, CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildEssayAnalysisPrompt(essay, rubric);
            var textResponse = await GenerateTextAsync(prompt, cancellationToken);

            if (!textResponse.Success || string.IsNullOrEmpty(textResponse.Data))
            {
                return new AIResponse<EssayAnalysis>
                {
                    Success = false,
                    Error = textResponse.Error ?? "Empty response"
                };
            }

            var analysis = ParseEssayAnalysisResponse(textResponse.Data);

            return new AIResponse<EssayAnalysis>
            {
                Success = true,
                Data = analysis,
                RawResponse = textResponse.Data,
                TokensUsed = textResponse.TokensUsed,
                Provider = "openai",
                Model = _config.Model
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing essay with OpenAI");
            return new AIResponse<EssayAnalysis>
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    #region Prompt Builders

    private AIPrompt BuildQuizPrompt(ContentInput input, QuizConfig config)
    {
        var questionTypesList = string.Join(", ", config.QuestionTypeCodes);
        var systemMessage = GetSystemMessage(input.Language);

        var userMessage = $@"İçerik:
{input.Content}

Görev: Bu içerikten {config.Count} adet {config.Difficulty} zorlukta soru üret.

Soru Tipleri: {questionTypesList}

Her soru için:
- Soru metnini (stem) açık ve net yaz
- Soru tipine göre uygun seçenekler/cevap formatı kullan
- Doğru cevabı belirt
{(config.IncludeExplanations ? "- Açıklama ekle" : "")}

Çıktı Formatı: JSON
{{
  ""questions"": [
    {{
      ""questionTypeCode"": ""multiple_choice_single"",
      ""stem"": ""Soru metni"",
      ""options"": [""A"", ""B"", ""C"", ""D""],
      ""correctAnswer"": ""B"",
      ""explanation"": ""Açıklama"",
      ""difficulty"": ""{config.Difficulty}"",
      ""points"": 5
    }}
  ]
}}";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private AIPrompt BuildFlashcardPrompt(ContentInput input, int count)
    {
        var systemMessage = GetSystemMessage(input.Language);

        var userMessage = $@"İçerik:
{input.Content}

Görev: Bu içerikten {count} adet flashcard (çalışma kartı) oluştur.

Her kart için:
- Ön yüz (front): Soru veya anahtar kavram
- Arka yüz (back): Detaylı cevap veya açıklama
- İpucu (hint): Opsiyonel ipucu

Çıktı Formatı: JSON
{{
  ""cards"": [
    {{
      ""front"": ""Soru veya kavram"",
      ""back"": ""Detaylı açıklama"",
      ""hint"": ""İpucu (opsiyonel)""
    }}
  ]
}}";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private AIPrompt BuildSummaryPrompt(ContentInput input, SummaryLength length)
    {
        var systemMessage = GetSystemMessage(input.Language);
        var lengthInstruction = length switch
        {
            SummaryLength.Short => "kısa (2-3 paragraf)",
            SummaryLength.Medium => "orta uzunlukta (4-6 paragraf)",
            SummaryLength.Long => "detaylı (7-10 paragraf)",
            _ => "orta uzunlukta"
        };

        var userMessage = $@"İçerik:
{input.Content}

Görev: Bu içeriğin {lengthInstruction} bir özetini çıkar.

Özet:
- Ana fikirleri vurgula
- Anahtar kavramları içer
- Mantıklı ve akıcı ol
- Orijinal metne sadık kal";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private AIPrompt BuildLessonPlanPrompt(LessonPlanInput input)
    {
        var systemMessage = GetSystemMessage(input.Language);

        var userMessage = $@"Ders Planı Oluştur:

Konu: {input.Topic}
Branş: {input.Subject}
Sınıf: {input.Grade}
Süre: {input.Duration} dakika
Şablon: {input.TemplateCode}

Görev: Detaylı bir ders planı oluştur.

Çıktı Formatı: JSON
{{
  ""title"": ""Ders başlığı"",
  ""objectives"": [""Hedef 1"", ""Hedef 2""],
  ""activities"": [
    {{
      ""type"": ""warm_up"",
      ""title"": ""Aktivite başlığı"",
      ""description"": ""Açıklama"",
      ""duration"": 10,
      ""instructions"": ""Adım adım talimatlar""
    }}
  ],
  ""materialsNeeded"": [""Materyal 1"", ""Materyal 2""],
  ""assessment"": ""Değerlendirme yöntemi""
}}";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private AIPrompt BuildWorksheetPrompt(ContentInput input)
    {
        var systemMessage = GetSystemMessage(input.Language);

        var userMessage = $@"İçerik:
{input.Content}

Görev: Bu içerikten bir çalışma yaprağı (worksheet) oluştur.

Çalışma Yaprağı:
- 10-15 soru içermeli
- Çeşitli soru tipleri (çoktan seçmeli, boşluk doldurma, kısa cevap)
- Cevap anahtarı ekle

Çıktı Formatı: JSON
{{
  ""title"": ""Çalışma Yaprağı Başlığı"",
  ""instructions"": ""Talimatlar"",
  ""questions"": [
    {{
      ""number"": 1,
      ""questionText"": ""Soru metni"",
      ""questionType"": ""multiple_choice"",
      ""points"": 5
    }}
  ],
  ""answerKey"": {{
    ""answers"": [
      {{
        ""number"": 1,
        ""answer"": ""Cevap"",
        ""explanation"": ""Açıklama""
      }}
    ]
  }}
}}";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private AIPrompt BuildEssayAnalysisPrompt(string essay, string rubric)
    {
        var systemMessage = "Sen profesyonel bir eğitmen ve kompozisyon değerlendirme uzmanısın.";

        var userMessage = $@"Kompozisyon:
{essay}

Değerlendirme Rubriği:
{rubric}

Görev: Bu kompozisyonu rubriğe göre değerlendir.

Çıktı Formatı: JSON
{{
  ""estimatedScore"": 85,
  ""grade"": ""A"",
  ""strengths"": [""Güçlü yan 1"", ""Güçlü yan 2""],
  ""weaknesses"": [""Zayıf yan 1""],
  ""suggestions"": [""Öneri 1"", ""Öneri 2""],
  ""overallFeedback"": ""Genel değerlendirme""
}}";

        return new AIPrompt
        {
            SystemMessage = systemMessage,
            UserMessage = userMessage
        };
    }

    private string GetSystemMessage(string language)
    {
        return language.ToLower() switch
        {
            "tr" => "Sen profesyonel bir eğitimcisin. Eğitim içeriği oluşturma konusunda uzmansın. JSON formatında yanıt ver.",
            "en" => "You are a professional educator. You are an expert in creating educational content. Respond in JSON format.",
            "ar" => "أنت معلم محترف. أنت خبير في إنشاء المحتوى التعليمي. الرد بتنسيق JSON.",
            _ => "You are a professional educator. You are an expert in creating educational content. Respond in JSON format."
        };
    }

    #endregion

    #region Response Parsers

    private QuizData ParseQuizResponse(string response)
    {
        try
        {
            // Extract JSON from markdown code blocks if present
            var jsonText = ExtractJsonFromResponse(response);
            return JsonSerializer.Deserialize<QuizData>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new QuizData();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing quiz response");
            return new QuizData();
        }
    }

    private FlashcardSet ParseFlashcardResponse(string response)
    {
        try
        {
            var jsonText = ExtractJsonFromResponse(response);
            return JsonSerializer.Deserialize<FlashcardSet>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new FlashcardSet();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing flashcard response");
            return new FlashcardSet();
        }
    }

    private LessonPlanData ParseLessonPlanResponse(string response)
    {
        try
        {
            var jsonText = ExtractJsonFromResponse(response);
            return JsonSerializer.Deserialize<LessonPlanData>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new LessonPlanData();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing lesson plan response");
            return new LessonPlanData();
        }
    }

    private WorksheetData ParseWorksheetResponse(string response)
    {
        try
        {
            var jsonText = ExtractJsonFromResponse(response);
            return JsonSerializer.Deserialize<WorksheetData>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new WorksheetData();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing worksheet response");
            return new WorksheetData();
        }
    }

    private EssayAnalysis ParseEssayAnalysisResponse(string response)
    {
        try
        {
            var jsonText = ExtractJsonFromResponse(response);
            return JsonSerializer.Deserialize<EssayAnalysis>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new EssayAnalysis();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing essay analysis response");
            return new EssayAnalysis();
        }
    }

    private string ExtractJsonFromResponse(string response)
    {
        // Remove markdown code blocks if present
        var trimmed = response.Trim();
        if (trimmed.StartsWith("```json"))
        {
            trimmed = trimmed.Substring(7);
        }
        else if (trimmed.StartsWith("```"))
        {
            trimmed = trimmed.Substring(3);
        }

        if (trimmed.EndsWith("```"))
        {
            trimmed = trimmed.Substring(0, trimmed.Length - 3);
        }

        return trimmed.Trim();
    }

    #endregion
}

