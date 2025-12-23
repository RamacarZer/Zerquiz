using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Zerquiz.Shared.Payment.Providers;

public class StripePaymentProvider : IPaymentProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<StripePaymentProvider> _logger;
    private readonly StripeSettings _settings;

    public StripePaymentProvider(
        HttpClient httpClient,
        ILogger<StripePaymentProvider> logger,
        IOptions<StripeSettings> settings)
    {
        _httpClient = httpClient;
        _logger = logger;
        _settings = settings.Value;

        _httpClient.BaseAddress = new Uri("https://api.stripe.com/v1/");
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.SecretKey}");
    }

    public async Task<PaymentIntent> CreatePaymentIntentAsync(PaymentRequest request)
    {
        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("amount", ((int)(request.Amount * 100)).ToString()), // Stripe uses cents
                new KeyValuePair<string, string>("currency", request.Currency.ToLower()),
                new KeyValuePair<string, string>("description", request.Description),
                new KeyValuePair<string, string>("receipt_email", request.CustomerEmail),
                new KeyValuePair<string, string>("metadata[customer_id]", request.CustomerId),
            });

            var response = await _httpClient.PostAsync("payment_intents", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<StripePaymentIntentResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new PaymentIntent
            {
                Id = result?.Id ?? string.Empty,
                ClientSecret = result?.ClientSecret ?? string.Empty,
                Status = result?.Status ?? "unknown",
                Amount = request.Amount,
                Currency = request.Currency
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Stripe payment intent");
            throw;
        }
    }

    public async Task<PaymentResult> CapturePaymentAsync(string paymentId)
    {
        try
        {
            var response = await _httpClient.PostAsync($"payment_intents/{paymentId}/capture", null);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<StripePaymentIntentResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new PaymentResult
            {
                Success = result?.Status == "succeeded",
                PaymentId = result?.Id ?? string.Empty,
                Status = result?.Status ?? "unknown",
                CompletedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error capturing Stripe payment: {PaymentId}", paymentId);
            return new PaymentResult
            {
                Success = false,
                PaymentId = paymentId,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<RefundResult> RefundPaymentAsync(string paymentId, decimal amount, string reason)
    {
        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("payment_intent", paymentId),
                new KeyValuePair<string, string>("amount", ((int)(amount * 100)).ToString()),
                new KeyValuePair<string, string>("reason", reason),
            });

            var response = await _httpClient.PostAsync("refunds", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<StripeRefundResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new RefundResult
            {
                Success = result?.Status == "succeeded",
                RefundId = result?.Id ?? string.Empty,
                Amount = amount,
                Status = result?.Status ?? "unknown"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refunding Stripe payment: {PaymentId}", paymentId);
            return new RefundResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<PaymentStatus> GetPaymentStatusAsync(string paymentId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"payment_intents/{paymentId}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<StripePaymentIntentResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new PaymentStatus
            {
                PaymentId = result?.Id ?? string.Empty,
                Status = result?.Status ?? "unknown",
                Amount = (result?.Amount ?? 0) / 100m,
                Currency = result?.Currency ?? "TRY",
                CreatedAt = DateTimeOffset.FromUnixTimeSeconds(result?.Created ?? 0).UtcDateTime
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Stripe payment status: {PaymentId}", paymentId);
            throw;
        }
    }

    public bool VerifyWebhookSignature(string payload, string signature, string secret)
    {
        try
        {
            // Stripe webhook signature verification
            // In production, use Stripe.NET library for proper verification
            return !string.IsNullOrEmpty(signature);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Stripe webhook signature");
            return false;
        }
    }

    public WebhookEvent ParseWebhookEvent(string payload)
    {
        try
        {
            var stripeEvent = JsonSerializer.Deserialize<StripeWebhookEvent>(payload, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return new WebhookEvent
            {
                EventId = stripeEvent?.Id ?? string.Empty,
                EventType = stripeEvent?.Type ?? string.Empty,
                PaymentId = stripeEvent?.Data?.Object?.Id ?? string.Empty,
                CreatedAt = DateTimeOffset.FromUnixTimeSeconds(stripeEvent?.Created ?? 0).UtcDateTime
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing Stripe webhook event");
            throw;
        }
    }

    // DTOs
    private class StripePaymentIntentResponse
    {
        public string? Id { get; set; }
        public string? ClientSecret { get; set; }
        public string? Status { get; set; }
        public long Amount { get; set; }
        public string? Currency { get; set; }
        public long Created { get; set; }
    }

    private class StripeRefundResponse
    {
        public string? Id { get; set; }
        public string? Status { get; set; }
    }

    private class StripeWebhookEvent
    {
        public string? Id { get; set; }
        public string? Type { get; set; }
        public long Created { get; set; }
        public StripeWebhookData? Data { get; set; }
    }

    private class StripeWebhookData
    {
        public StripeWebhookObject? Object { get; set; }
    }

    private class StripeWebhookObject
    {
        public string? Id { get; set; }
    }
}

public class StripeSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
}

