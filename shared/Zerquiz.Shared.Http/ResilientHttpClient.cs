using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Zerquiz.Shared.Resilience;

namespace Zerquiz.Shared.Http;

/// <summary>
/// Resilient HTTP client for inter-service communication
/// Handles failures gracefully without affecting other services
/// </summary>
public class ResilientHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly ResiliencePolicy _resiliencePolicy;
    private readonly ILogger<ResilientHttpClient> _logger;

    public ResilientHttpClient(
        HttpClient httpClient,
        ResiliencePolicy resiliencePolicy,
        ILogger<ResilientHttpClient> logger)
    {
        _httpClient = httpClient;
        _resiliencePolicy = resiliencePolicy;
        _logger = logger;
    }

    /// <summary>
    /// Get with automatic fallback
    /// </summary>
    public async Task<T?> GetAsync<T>(string url, T? fallbackValue = default)
    {
        try
        {
            var response = await _resiliencePolicy.ExecuteWithFallbackAsync(
                action: () => _httpClient.GetAsync(url),
                fallback: () => CreateFallbackResponse()
            );

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Service {Url} returned {StatusCode}. Using fallback.",
                    url, response.StatusCode);
                return fallbackValue;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to call {Url}. Using fallback.", url);
            return fallbackValue;
        }
    }

    /// <summary>
    /// Post with resilience
    /// </summary>
    public async Task<HttpResponseMessage> PostAsync(string url, HttpContent content)
    {
        return await _resiliencePolicy.ExecuteAsync(() => _httpClient.PostAsync(url, content));
    }

    /// <summary>
    /// Check if service is available (health check)
    /// </summary>
    public async Task<bool> IsServiceHealthyAsync(string serviceUrl)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{serviceUrl}/health/live");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private HttpResponseMessage CreateFallbackResponse()
    {
        return new HttpResponseMessage(System.Net.HttpStatusCode.ServiceUnavailable)
        {
            Content = new StringContent(JsonSerializer.Serialize(new
            {
                error = "Service temporarily unavailable",
                fallback = true,
                timestamp = DateTime.UtcNow
            }))
        };
    }
}

