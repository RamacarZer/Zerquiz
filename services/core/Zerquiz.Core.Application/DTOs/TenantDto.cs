using Zerquiz.Core.Domain.Entities;

namespace Zerquiz.Core.Application.DTOs;

public class TenantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
    public bool IsActive { get; set; }
    public TenantSettings Settings { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    
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
    public string? RepresentativeTitle { get; set; }
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhone { get; set; }
    
    // Technical Contact (Teknik Sorumlu)
    public string? TechnicalContactFirstName { get; set; }
    public string? TechnicalContactLastName { get; set; }
    public string? TechnicalContactTitle { get; set; }
    public string? TechnicalContactEmail { get; set; }
    public string? TechnicalContactPhone { get; set; }
    
    // Subscription Info
    public string SubscriptionStatus { get; set; } = "trial";
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
}

public class CreateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
    
    // Company Info
    public string? CompanyName { get; set; }
    public string? TaxNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Representative
    public string? RepresentativeFirstName { get; set; }
    public string? RepresentativeLastName { get; set; }
    public string? RepresentativeTitle { get; set; }
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhone { get; set; }
    
    // Technical Contact
    public string? TechnicalContactFirstName { get; set; }
    public string? TechnicalContactLastName { get; set; }
    public string? TechnicalContactTitle { get; set; }
    public string? TechnicalContactEmail { get; set; }
    public string? TechnicalContactPhone { get; set; }
}

public class UpdateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public TenantSettings? Settings { get; set; }
    
    // Company Info
    public string? CompanyName { get; set; }
    public string? TaxNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Representative
    public string? RepresentativeFirstName { get; set; }
    public string? RepresentativeLastName { get; set; }
    public string? RepresentativeTitle { get; set; }
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhone { get; set; }
    
    // Technical Contact
    public string? TechnicalContactFirstName { get; set; }
    public string? TechnicalContactLastName { get; set; }
    public string? TechnicalContactTitle { get; set; }
    public string? TechnicalContactEmail { get; set; }
    public string? TechnicalContactPhone { get; set; }
    
    // Subscription
    public string? SubscriptionStatus { get; set; }
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
}
