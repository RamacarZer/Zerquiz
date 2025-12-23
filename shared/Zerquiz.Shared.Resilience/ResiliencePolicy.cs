using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Polly.Retry;
using Polly.Timeout;

namespace Zerquiz.Shared.Resilience;

/// <summary>
/// Resilience policies for inter-service communication
/// Implements Circuit Breaker, Retry, and Timeout patterns
/// </summary>
public class ResiliencePolicy
{
    private readonly ILogger<ResiliencePolicy> _logger;
    private readonly AsyncCircuitBreakerPolicy<HttpResponseMessage> _circuitBreakerPolicy;
    private readonly AsyncRetryPolicy<HttpResponseMessage> _retryPolicy;
    private readonly AsyncTimeoutPolicy _timeoutPolicy;

    public ResiliencePolicy(ILogger<ResiliencePolicy> logger)
    {
        _logger = logger;

        // Circuit Breaker: Open circuit after 3 consecutive failures, stay open for 30 seconds
        _circuitBreakerPolicy = Policy
            .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
            .Or<HttpRequestException>()
            .Or<TimeoutException>()
            .CircuitBreakerAsync(
                handledEventsAllowedBeforeBreaking: 3,
                durationOfBreak: TimeSpan.FromSeconds(30),
                onBreak: (result, duration) =>
                {
                    _logger.LogWarning("Circuit breaker opened for {Duration}s. Reason: {Reason}",
                        duration.TotalSeconds,
                        result.Exception?.Message ?? result.Result?.ReasonPhrase ?? "Unknown");
                },
                onReset: () =>
                {
                    _logger.LogInformation("Circuit breaker reset. Service recovered.");
                },
                onHalfOpen: () =>
                {
                    _logger.LogInformation("Circuit breaker half-open. Testing service...");
                }
            );

        // Retry: Exponential backoff (1s, 2s, 4s)
        _retryPolicy = Policy
            .HandleResult<HttpResponseMessage>(r => 
                (int)r.StatusCode >= 500 || 
                r.StatusCode == System.Net.HttpStatusCode.RequestTimeout)
            .Or<HttpRequestException>()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                onRetry: (outcome, timespan, retryCount, context) =>
                {
                    _logger.LogWarning("Retry {RetryCount} after {Delay}s. Status: {Status}",
                        retryCount,
                        timespan.TotalSeconds,
                        outcome.Result?.StatusCode ?? 0);
                }
            );

        // Timeout: 10 seconds per request
        _timeoutPolicy = Policy.TimeoutAsync(
            TimeSpan.FromSeconds(10),
            TimeoutStrategy.Pessimistic,
            onTimeoutAsync: (context, timespan, task) =>
            {
                _logger.LogError("Request timed out after {Timeout}s", timespan.TotalSeconds);
                return Task.CompletedTask;
            }
        );
    }

    /// <summary>
    /// Execute HTTP request with full resilience (timeout + retry + circuit breaker)
    /// </summary>
    public async Task<HttpResponseMessage> ExecuteAsync(Func<Task<HttpResponseMessage>> action)
    {
        return await _timeoutPolicy.WrapAsync(_retryPolicy).WrapAsync(_circuitBreakerPolicy)
            .ExecuteAsync(action);
    }

    /// <summary>
    /// Execute with fallback - if all retries fail, return fallback response
    /// </summary>
    public async Task<HttpResponseMessage> ExecuteWithFallbackAsync(
        Func<Task<HttpResponseMessage>> action,
        Func<HttpResponseMessage> fallback)
    {
        try
        {
            return await ExecuteAsync(action);
        }
        catch (BrokenCircuitException ex)
        {
            _logger.LogWarning(ex, "Circuit breaker is open. Using fallback.");
            return fallback();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Request failed after all retries. Using fallback.");
            return fallback();
        }
    }

    /// <summary>
    /// Execute generic action with resilience
    /// </summary>
    public async Task<T> ExecuteAsync<T>(Func<Task<T>> action, T fallbackValue = default!)
    {
        try
        {
            return await Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(3, i => TimeSpan.FromSeconds(Math.Pow(2, i)),
                    onRetry: (exception, timespan, retryCount, context) =>
                    {
                        _logger.LogWarning(exception, "Retry {RetryCount} after {Delay}s", retryCount, timespan.TotalSeconds);
                    })
                .ExecuteAsync(action);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "All retries failed. Returning fallback value.");
            return fallbackValue;
        }
    }
}

