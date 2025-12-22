namespace Zerquiz.Shared.AI.Models;

/// <summary>
/// Configuration for AI providers
/// </summary>
public class AIConfig
{
    public string Provider { get; set; } = "openai"; // openai, azure_openai, anthropic, local_llm
    public string ApiKey { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string Model { get; set; } = "gpt-4o";
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 2000;
    public string? DeploymentName { get; set; } // For Azure OpenAI
}

/// <summary>
/// AI prompt configuration
/// </summary>
public class AIPrompt
{
    public string SystemMessage { get; set; } = string.Empty;
    public string UserMessage { get; set; } = string.Empty;
    public double? Temperature { get; set; }
    public int? MaxTokens { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// Generic AI response wrapper
/// </summary>
public class AIResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public string? RawResponse { get; set; }
    public int TokensUsed { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
}




