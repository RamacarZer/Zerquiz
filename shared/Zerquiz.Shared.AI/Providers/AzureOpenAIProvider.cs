using Microsoft.Extensions.Logging;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Shared.AI.Providers;

/// <summary>
/// Azure OpenAI provider - inherits from OpenAI provider since API is compatible
/// </summary>
public class AzureOpenAIProvider : OpenAIProvider
{
    public AzureOpenAIProvider(AIConfig config, ILogger<OpenAIProvider> logger) 
        : base(config, logger)
    {
        // Azure OpenAI uses same SDK, just different endpoint
        // Config should have Endpoint and Deployment Name set
    }
}

