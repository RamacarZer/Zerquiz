using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Tenant tema ve branding ayarları
/// Her tenant'ın kendi görsel kimliği
/// </summary>
public class TenantTheme : BaseEntity
{
    // Colors
    public string PrimaryColor { get; set; } = "#3B82F6";
    public string SecondaryColor { get; set; } = "#8B5CF6";
    public string AccentColor { get; set; } = "#10B981";
    public string SuccessColor { get; set; } = "#10B981";
    public string WarningColor { get; set; } = "#F59E0B";
    public string ErrorColor { get; set; } = "#EF4444";
    public string BackgroundColor { get; set; } = "#F9FAFB";
    public string SurfaceColor { get; set; } = "#FFFFFF";
    public string TextPrimaryColor { get; set; } = "#111827";
    public string TextSecondaryColor { get; set; } = "#6B7280";
    
    // Typography
    public string FontFamily { get; set; } = "Inter";
    public string FontSizeBase { get; set; } = "16px";
    public int FontWeightNormal { get; set; } = 400;
    public int FontWeightBold { get; set; } = 700;
    
    // Spacing & Border
    public string BorderRadius { get; set; } = "0.5rem";
    public string SpacingUnit { get; set; } = "0.25rem";
    
    // Branding Assets
    public string? LogoUrl { get; set; }
    public string? LogoSmallUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? LoginBackgroundUrl { get; set; }
    
    // Customization
    public string? CustomCSS { get; set; }
    public string? CustomJS { get; set; }
    
    // Theme metadata
    public string Name { get; set; } = "Default";
    public string? Description { get; set; }
    
    // Navigation to Tenant
    public Tenant? Tenant { get; set; }
}

