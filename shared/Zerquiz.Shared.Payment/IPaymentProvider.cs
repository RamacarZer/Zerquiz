using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Zerquiz.Shared.Payment;

/// <summary>
/// Payment provider interface for abstraction
/// Supports Stripe, Iyzico, and other providers
/// </summary>
public interface IPaymentProvider
{
    /// <summary>
    /// Create a payment intent/session
    /// </summary>
    Task<PaymentIntent> CreatePaymentIntentAsync(PaymentRequest request);

    /// <summary>
    /// Capture/confirm a payment
    /// </summary>
    Task<PaymentResult> CapturePaymentAsync(string paymentId);

    /// <summary>
    /// Refund a payment
    /// </summary>
    Task<RefundResult> RefundPaymentAsync(string paymentId, decimal amount, string reason);

    /// <summary>
    /// Get payment status
    /// </summary>
    Task<PaymentStatus> GetPaymentStatusAsync(string paymentId);

    /// <summary>
    /// Verify webhook signature
    /// </summary>
    bool VerifyWebhookSignature(string payload, string signature, string secret);

    /// <summary>
    /// Parse webhook event
    /// </summary>
    WebhookEvent ParseWebhookEvent(string payload);
}

public class PaymentRequest
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public string Description { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public Dictionary<string, string> Metadata { get; set; } = new();
}

public class PaymentIntent
{
    public string Id { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string PaymentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class RefundResult
{
    public bool Success { get; set; }
    public string RefundId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}

public class PaymentStatus
{
    public string PaymentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // pending, succeeded, failed, canceled
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class WebhookEvent
{
    public string EventId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public Dictionary<string, object> Data { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

