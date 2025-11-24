using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Fatura/Invoice
/// </summary>
public class Invoice : BaseEntity
{
    // Relations (TenantId already in BaseEntity)
    public Tenant? Tenant { get; set; }
    
    public Guid? LicenseId { get; set; }
    public TenantLicense? License { get; set; }
    
    // Invoice Info
    public string InvoiceNumber { get; set; } = string.Empty; // FAT-2025-001
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    
    // Billing Period
    public DateTime BillingPeriodStart { get; set; }
    public DateTime BillingPeriodEnd { get; set; }
    
    // Amounts
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; } = 20.00M; // KDV %20
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "TRY";
    
    // Invoice Status (different from BaseEntity.Status)
    public new string Status { get; set; } = "pending"; // draft, pending, paid, overdue, cancelled
    public DateTime? PaidAt { get; set; }
    public string? PaymentMethod { get; set; } // credit_card, bank_transfer, cash
    public string? PaymentReference { get; set; } // Ödeme referans numarası
    
    // Items (JSONB)
    public string ItemsJson { get; set; } = "[]";
    // [
    //   {
    //     "description": "Professional Paketi - Aylık",
    //     "quantity": 1,
    //     "unit_price": 1499.00,
    //     "total": 1499.00
    //   },
    //   {
    //     "description": "Ek Kullanıcı (25 adet)",
    //     "quantity": 25,
    //     "unit_price": 10.00,
    //     "total": 250.00
    //   }
    // ]
    
    // Notes
    public string? Notes { get; set; }
    public string? InternalNotes { get; set; } // Sadece admin görsün
}

