using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Tenant branding ve özelleştirme ayarları
/// </summary>
public class TenantBrandingSettings : BaseEntity
{
    // Relation (TenantId already in BaseEntity)
    public Tenant? Tenant { get; set; }
    
    // General Settings
    public string DisplayName { get; set; } = string.Empty;
    public string? Subdomain { get; set; } // ornek.zerquiz.com
    public string? CustomDomain { get; set; } // www.ornek.com
    public bool DomainVerified { get; set; } = false;
    
    // Logos & Images
    public string? LogoUrl { get; set; }
    public string? LogoLightUrl { get; set; } // Açık tema için
    public string? LogoDarkUrl { get; set; } // Koyu tema için
    public string? FaviconUrl { get; set; }
    public string? LoginBackgroundUrl { get; set; }
    public string? DashboardBannerUrl { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    
    // Email Branding
    public string? EmailSenderName { get; set; }
    public string? EmailSenderAddress { get; set; }
    public string? EmailLogoUrl { get; set; }
    public string? EmailFooterText { get; set; }
    
    // Social Media
    public string? FacebookUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? InstagramUrl { get; set; }
    
    // Contact Info
    public string? SupportEmail { get; set; }
    public string? SupportPhone { get; set; }
    public string? Address { get; set; }
    
    // Color Theme (JSONB)
    public string? ColorThemeJson { get; set; }
    // {
    //   "name": "custom",
    //   "primary": "#3B82F6",
    //   "secondary": "#10B981",
    //   "accent": "#F59E0B",
    //   "success": "#10B981",
    //   "warning": "#F59E0B",
    //   "error": "#EF4444"
    // }
    
    // Advanced Settings (JSONB)
    public string? AdvancedSettingsJson { get; set; }
    // {
    //   "custom_css": "...",
    //   "custom_js": "...",
    //   "custom_html_head": "...",
    //   "google_analytics_id": "G-XXXXXXXXXX",
    //   "facebook_pixel_id": "123456789",
    //   "hotjar_id": "123456"
    // }
    
    // Localization
    public string DefaultLanguage { get; set; } = "tr";
    public string DefaultTimezone { get; set; } = "Europe/Istanbul";
    public string DefaultCurrency { get; set; } = "TRY";
    public string DateFormat { get; set; } = "DD/MM/YYYY";
    public string TimeFormat { get; set; } = "24h";
    
    // Feature Flags (JSONB)
    public string? FeatureFlagsJson { get; set; }
    // {
    //   "enable_custom_branding": true,
    //   "enable_custom_domain": true,
    //   "enable_white_label": false,
    //   "enable_custom_css": true,
    //   "enable_custom_js": false
    // }
}

