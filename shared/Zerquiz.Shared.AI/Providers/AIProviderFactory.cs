using Microsoft.Extensions.Logging;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Shared.AI.Providers;

/// <summary>
/// Factory for creating AI provider instances based on configuration
/// </summary>
public class AIProviderFactory
{
    private readonly ILoggerFactory _loggerFactory;
    private readonly IHttpClientFactory? _httpClientFactory;

    public AIProviderFactory(ILoggerFactory loggerFactory, IHttpClientFactory? httpClientFactory = null)
    {
        _loggerFactory = loggerFactory;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Create an AI provider based on the configuration
    /// </summary>
    public IAIProvider CreateProvider(AIConfig config)
    {
        return config.Provider.ToLower() switch
        {
            "openai" => new OpenAIProvider(config, _loggerFactory.CreateLogger<OpenAIProvider>()),
            "azure_openai" => new AzureOpenAIProvider(config, _loggerFactory.CreateLogger<OpenAIProvider>()),
            "local_llm" => new LocalLLMProvider(
                config,
                _loggerFactory.CreateLogger<LocalLLMProvider>(),
                _httpClientFactory?.CreateClient() ?? new HttpClient()
            ),
            _ => throw new NotSupportedException($"Provider '{config.Provider}' is not supported")
        };
    }

    /// <summary>
    /// Create a provider with default configuration (OpenAI)
    /// </summary>
    public IAIProvider CreateDefaultProvider(string apiKey, string model = "gpt-4o")
    {
        var config = new AIConfig
        {
            Provider = "openai",
            ApiKey = apiKey,
            Model = model,
            Temperature = 0.7,
            MaxTokens = 2000
        };

        return CreateProvider(config);
    }
}

