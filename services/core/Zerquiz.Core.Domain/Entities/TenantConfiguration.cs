using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Tenant Configuration - Branding, SEO, Integrations
/// </summary>
public class TenantConfiguration : BaseEntity
{
    // Relations
    public Tenant? Tenant { get; set; }
    
    // Domain & Branding
    public string? CustomDomain { get; set; }
    public string? Subdomain { get; set; }
    public string? BrandName { get; set; }
    public string? BrandLogoUrl { get; set; }
    public string? BrandFaviconUrl { get; set; }
    public string? BrandLoginBackgroundUrl { get; set; }
    
    // Colors
    public string? PrimaryColor { get; set; } = "#3B82F6";
    public string? SecondaryColor { get; set; } = "#8B5CF6";
    public string? AccentColor { get; set; } = "#10B981";
    
    // Email Branding
    public string? EmailFromName { get; set; }
    public string? EmailFromAddress { get; set; }
    public string? EmailLogoUrl { get; set; }
    public string? EmailFooterText { get; set; }
    
    // Feature Flags
    public bool EnableCustomBranding { get; set; } = true;
    public bool EnableCustomDomain { get; set; } = false;
    public bool EnableClientPortal { get; set; } = true;
    public bool EnableOnlinePayments { get; set; } = false;
    public bool EnableDocumentSigning { get; set; } = false;
    public bool EnableVideoMeetings { get; set; } = false;
    
    // Custom Code
    public string? CustomCss { get; set; }
    public string? CustomJs { get; set; }
    public string? CustomHeadHtml { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? MetaImageUrl { get; set; }
    
    // Social Media
    public string? FacebookUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? InstagramUrl { get; set; }
    
    // Contact
    public string? SupportEmail { get; set; }
    public string? SupportPhone { get; set; }
    public string? Address { get; set; }
    
    // Localization
    public string DefaultLanguage { get; set; } = "tr-TR";
    public string DefaultTimezone { get; set; } = "Europe/Istanbul";
    public string DefaultCurrency { get; set; } = "TRY";
    
    // Analytics
    public string? GoogleAnalyticsId { get; set; }
    public string? FacebookPixelId { get; set; }
}

