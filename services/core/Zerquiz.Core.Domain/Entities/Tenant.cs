using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Tenant entity representing an organization/company in the multi-tenant system
/// Tenant'lar TenantId'ye sahip DEĞİL çünkü kendileri tenant'tır
/// </summary>
public class Tenant
{
    // Tenant specific fields
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty; // subdomain
    public string? CustomDomain { get; set; }
    public TenantSettings Settings { get; set; } = new();
    
    // Navigation properties
    public TenantTheme? Theme { get; set; }
    public ICollection<TenantLicense> Licenses { get; set; } = new List<TenantLicense>();
    
    // Company/Organization Info
    public string? CompanyName { get; set; }
    public string? TaxNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Company Representative (Şirket Temsilcisi)
    public string? RepresentativeFirstName { get; set; }
    public string? RepresentativeLastName { get; set; }
    public string? RepresentativeTitle { get; set; } // Genel Müdür, İşletme Müdürü vb.
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhone { get; set; }
    
    // IT Contact (Bilgi İşlem Sorumlusu)
    public string? TechnicalContactFirstName { get; set; }
    public string? TechnicalContactLastName { get; set; }
    public string? TechnicalContactTitle { get; set; } // Bilgi İşlem Müdürü, Sistem Yöneticisi vb.
    public string? TechnicalContactEmail { get; set; }
    public string? TechnicalContactPhone { get; set; }
    
    // Subscription Info
    public string SubscriptionStatus { get; set; } = "trial"; // trial, active, suspended, expired
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
    
    // Professional fields (BaseEntity pattern ama inherit etmiyor çünkü Tenant özel)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public Guid? DeletedBy { get; set; }
    
    public bool IsActive { get; set; } = true;
    public string? Status { get; set; }
    public int Version { get; set; } = 1;
    
    public string? Source { get; set; }
    public string? Metadata { get; set; } // JSONB
    public string[]? Tags { get; set; }
    
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestId { get; set; }
    public string? CorrelationId { get; set; }
    
    public bool IsDeleted => DeletedAt.HasValue;
}

/// <summary>
/// Tenant settings stored as JSONB
/// </summary>
public class TenantSettings
{
    public string? LogoUrl { get; set; }
    public string DefaultLanguage { get; set; } = "tr";
    public string Currency { get; set; } = "TRY";
    public Dictionary<string, object> CustomSettings { get; set; } = new();
}

