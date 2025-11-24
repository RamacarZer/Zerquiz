using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/tenants/{tenantId}/branding")]
public class BrandingSettingsController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<BrandingSettingsController> _logger;

    public BrandingSettingsController(CoreDbContext context, ILogger<BrandingSettingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/tenants/{tenantId}/branding
    [HttpGet]
    public async Task<ActionResult<object>> GetBrandingSettings(Guid tenantId)
    {
        var settings = await _context.TenantBrandingSettings
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.DeletedAt == null);

        if (settings == null)
        {
            // Return default settings if not found
            return Ok(new
            {
                isSuccess = true,
                message = "No branding settings found, returning defaults",
                data = GetDefaultBrandingSettings(tenantId)
            });
        }

        return Ok(new
        {
            isSuccess = true,
            data = new
            {
                settings.Id,
                settings.TenantId,
                settings.DisplayName,
                settings.Subdomain,
                settings.CustomDomain,
                settings.DomainVerified,
                settings.LogoUrl,
                settings.LogoLightUrl,
                settings.LogoDarkUrl,
                settings.FaviconUrl,
                settings.LoginBackgroundUrl,
                settings.DashboardBannerUrl,
                settings.MetaTitle,
                settings.MetaDescription,
                settings.MetaKeywords,
                settings.EmailSenderName,
                settings.EmailSenderAddress,
                settings.EmailLogoUrl,
                settings.EmailFooterText,
                settings.FacebookUrl,
                settings.TwitterUrl,
                settings.LinkedinUrl,
                settings.InstagramUrl,
                settings.SupportEmail,
                settings.SupportPhone,
                settings.Address,
                settings.ColorThemeJson,
                settings.AdvancedSettingsJson,
                settings.DefaultLanguage,
                settings.DefaultTimezone,
                settings.DefaultCurrency,
                settings.DateFormat,
                settings.TimeFormat,
                settings.FeatureFlagsJson
            }
        });
    }

    // PUT: api/tenants/{tenantId}/branding/general
    [HttpPut("general")]
    public async Task<ActionResult<object>> UpdateGeneralSettings(Guid tenantId, [FromBody] UpdateGeneralSettingsRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.DisplayName = request.DisplayName;
        settings.Subdomain = request.Subdomain;
        settings.CustomDomain = request.CustomDomain;
        settings.LogoUrl = request.LogoUrl;
        settings.LogoLightUrl = request.LogoLightUrl;
        settings.LogoDarkUrl = request.LogoDarkUrl;
        settings.FaviconUrl = request.FaviconUrl;
        settings.LoginBackgroundUrl = request.LoginBackgroundUrl;
        settings.DashboardBannerUrl = request.DashboardBannerUrl;
        settings.MetaTitle = request.MetaTitle;
        settings.MetaDescription = request.MetaDescription;
        settings.MetaKeywords = request.MetaKeywords;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "General settings updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/colors
    [HttpPut("colors")]
    public async Task<ActionResult<object>> UpdateColorTheme(Guid tenantId, [FromBody] UpdateColorThemeRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.ColorThemeJson = request.ColorThemeJson;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Color theme updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/email
    [HttpPut("email")]
    public async Task<ActionResult<object>> UpdateEmailBranding(Guid tenantId, [FromBody] UpdateEmailBrandingRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.EmailSenderName = request.EmailSenderName;
        settings.EmailSenderAddress = request.EmailSenderAddress;
        settings.EmailLogoUrl = request.EmailLogoUrl;
        settings.EmailFooterText = request.EmailFooterText;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Email branding updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/social
    [HttpPut("social")]
    public async Task<ActionResult<object>> UpdateSocialMedia(Guid tenantId, [FromBody] UpdateSocialMediaRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.FacebookUrl = request.FacebookUrl;
        settings.TwitterUrl = request.TwitterUrl;
        settings.LinkedinUrl = request.LinkedinUrl;
        settings.InstagramUrl = request.InstagramUrl;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Social media links updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/contact
    [HttpPut("contact")]
    public async Task<ActionResult<object>> UpdateContactInfo(Guid tenantId, [FromBody] UpdateContactInfoRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.SupportEmail = request.SupportEmail;
        settings.SupportPhone = request.SupportPhone;
        settings.Address = request.Address;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Contact info updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/advanced
    [HttpPut("advanced")]
    public async Task<ActionResult<object>> UpdateAdvancedSettings(Guid tenantId, [FromBody] UpdateAdvancedSettingsRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.AdvancedSettingsJson = request.AdvancedSettingsJson;
        settings.DefaultLanguage = request.DefaultLanguage ?? "tr";
        settings.DefaultTimezone = request.DefaultTimezone ?? "Europe/Istanbul";
        settings.DefaultCurrency = request.DefaultCurrency ?? "TRY";
        settings.DateFormat = request.DateFormat ?? "DD/MM/YYYY";
        settings.TimeFormat = request.TimeFormat ?? "24h";
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Advanced settings updated successfully" });
    }

    // PUT: api/tenants/{tenantId}/branding/features
    [HttpPut("features")]
    public async Task<ActionResult<object>> UpdateFeatureFlags(Guid tenantId, [FromBody] UpdateFeatureFlagsRequest request)
    {
        var settings = await GetOrCreateSettings(tenantId);

        settings.FeatureFlagsJson = request.FeatureFlagsJson;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Feature flags updated successfully" });
    }

    // POST: api/tenants/{tenantId}/branding/verify-domain
    [HttpPost("verify-domain")]
    public async Task<ActionResult<object>> VerifyDomain(Guid tenantId)
    {
        var settings = await _context.TenantBrandingSettings
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.DeletedAt == null);

        if (settings == null || string.IsNullOrEmpty(settings.CustomDomain))
        {
            return BadRequest(new { isSuccess = false, message = "No custom domain configured" });
        }

        // TODO: Implement actual DNS verification
        // For now, just mark as verified
        settings.DomainVerified = true;
        settings.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            isSuccess = true,
            message = "Domain verified successfully",
            data = new
            {
                domain = settings.CustomDomain,
                verified = settings.DomainVerified
            }
        });
    }

    // Helper methods
    private async Task<TenantBrandingSettings> GetOrCreateSettings(Guid tenantId)
    {
        var settings = await _context.TenantBrandingSettings
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.DeletedAt == null);

        if (settings == null)
        {
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null)
                throw new InvalidOperationException("Tenant not found");

            settings = new TenantBrandingSettings
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                DisplayName = tenant.Name,
                DefaultLanguage = "tr",
                DefaultTimezone = "Europe/Istanbul",
                DefaultCurrency = "TRY",
                DateFormat = "DD/MM/YYYY",
                TimeFormat = "24h",
                CreatedAt = DateTime.UtcNow
            };

            _context.TenantBrandingSettings.Add(settings);
        }

        return settings;
    }

    private object GetDefaultBrandingSettings(Guid tenantId)
    {
        return new
        {
            TenantId = tenantId,
            DisplayName = "Yeni Kurum",
            DefaultLanguage = "tr",
            DefaultTimezone = "Europe/Istanbul",
            DefaultCurrency = "TRY",
            DateFormat = "DD/MM/YYYY",
            TimeFormat = "24h"
        };
    }
}

// DTOs
public record UpdateGeneralSettingsRequest
{
    public string DisplayName { get; init; } = string.Empty;
    public string? Subdomain { get; init; }
    public string? CustomDomain { get; init; }
    public string? LogoUrl { get; init; }
    public string? LogoLightUrl { get; init; }
    public string? LogoDarkUrl { get; init; }
    public string? FaviconUrl { get; init; }
    public string? LoginBackgroundUrl { get; init; }
    public string? DashboardBannerUrl { get; init; }
    public string? MetaTitle { get; init; }
    public string? MetaDescription { get; init; }
    public string? MetaKeywords { get; init; }
}

public record UpdateColorThemeRequest
{
    public string? ColorThemeJson { get; init; }
}

public record UpdateEmailBrandingRequest
{
    public string? EmailSenderName { get; init; }
    public string? EmailSenderAddress { get; init; }
    public string? EmailLogoUrl { get; init; }
    public string? EmailFooterText { get; init; }
}

public record UpdateSocialMediaRequest
{
    public string? FacebookUrl { get; init; }
    public string? TwitterUrl { get; init; }
    public string? LinkedinUrl { get; init; }
    public string? InstagramUrl { get; init; }
}

public record UpdateContactInfoRequest
{
    public string? SupportEmail { get; init; }
    public string? SupportPhone { get; init; }
    public string? Address { get; init; }
}

public record UpdateAdvancedSettingsRequest
{
    public string? AdvancedSettingsJson { get; init; }
    public string? DefaultLanguage { get; init; }
    public string? DefaultTimezone { get; init; }
    public string? DefaultCurrency { get; init; }
    public string? DateFormat { get; init; }
    public string? TimeFormat { get; init; }
}

public record UpdateFeatureFlagsRequest
{
    public string? FeatureFlagsJson { get; init; }
}

