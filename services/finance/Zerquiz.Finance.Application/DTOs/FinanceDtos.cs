namespace Zerquiz.Finance.Application.DTOs;

// ========== SUBSCRIPTION DTOs ==========

public record SubscriptionDto(
    Guid Id,
    Guid PlanId,
    string PlanName,
    DateTime StartDate,
    DateTime EndDate,
    string SubscriptionStatus,
    string BillingCycle,
    decimal MonthlyFee,
    string Currency,
    bool AutoRenew
);

public record CreateSubscriptionRequest(
    Guid PlanId,
    DateTime StartDate,
    string BillingCycle,
    bool AutoRenew = true
);

public record CancelSubscriptionRequest(
    string CancellationReason
);

// ========== SUBSCRIPTION PLAN DTOs ==========

public record SubscriptionPlanDto(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    decimal MonthlyPrice,
    decimal YearlyPrice,
    string Currency,
    int MaxUsers,
    int MaxQuestions,
    int MaxExams,
    long MaxStorageMB,
    bool IsPublic,
    int DisplayOrder
);

public record CreateSubscriptionPlanRequest(
    string Code,
    string Name,
    string? Description,
    decimal MonthlyPrice,
    decimal YearlyPrice,
    string Currency,
    int MaxUsers,
    int MaxQuestions,
    int MaxExams,
    long MaxStorageMB
);

// ========== PAYMENT DTOs ==========

public record PaymentDto(
    Guid Id,
    Guid? SubscriptionId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string PaymentStatus,
    string? TransactionId,
    DateTime? PaidAt
);

public record CreatePaymentRequest(
    Guid? SubscriptionId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string? PaymentGateway = "stripe"
);

public record PaymentWebhookRequest(
    string TransactionId,
    string Status,
    string? FailureReason
);

// ========== QUOTA DTOs ==========

public record UsageQuotaDto(
    Guid Id,
    string ResourceType,
    int Limit,
    int Used,
    string Period,
    DateTime? ResetAt,
    bool IsHardLimit
);

public record QuotaCheckRequest(
    string ResourceType,
    int RequestedAmount = 1
);

public record QuotaCheckResponse(
    bool IsAllowed,
    int Remaining,
    string? Message
);

// ========== REVENUE SPLIT DTOs ==========

public record RevenueSplitRuleDto(
    Guid Id,
    string TransactionType,
    decimal PlatformPercent,
    decimal TenantPercent,
    decimal AuthorPercent,
    decimal ReviewerPercent,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo
);

