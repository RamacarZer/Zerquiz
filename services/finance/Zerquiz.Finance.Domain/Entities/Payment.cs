using System.Text.Json;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Finance.Domain.Entities;

/// <summary>
/// Ödeme kaydı
/// </summary>
public class Payment : BaseEntity
{
    public Guid? SubscriptionId { get; set; }
    public Guid? InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public string PaymentMethod { get; set; } = "credit_card"; // credit_card, bank_transfer, paypal
    public string PaymentStatus { get; set; } = "pending"; // pending, completed, failed, refunded
    public string? TransactionId { get; set; } // External payment gateway transaction ID
    public string? PaymentGateway { get; set; } // stripe, iyzico, paypal
    public DateTime? PaidAt { get; set; }
    public JsonDocument? PaymentData { get; set; } // JSONB - Gateway response data
    public string? FailureReason { get; set; }
    
    // Navigation
    public Subscription? Subscription { get; set; }
}

