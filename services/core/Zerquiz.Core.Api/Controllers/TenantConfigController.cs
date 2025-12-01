// TEMPORARY: Disabled due to missing dependencies
/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantConfigController : ControllerBase
{
    private readonly CoreDbContext _context;

    public TenantConfigController(CoreDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get tenant configuration (including custom domain)
    /// </summary>
    [HttpGet("{tenantId}")]
    public async Task<ActionResult> GetConfig(Guid tenantId)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        var config = new
        {
            tenant.Id,
            tenant.Name,
            tenant.Domain,
            CustomDomain = GetCustomDomain(tenant.Settings),
            tenant.IsActive,
            tenant.Settings,
            tenant.CreatedAt
        };

        return Ok(config);
    }

    /// <summary>
    /// Set custom domain for tenant
    /// </summary>
    [HttpPost("{tenantId}/custom-domain")]
    public async Task<ActionResult> SetCustomDomain(Guid tenantId, [FromBody] SetCustomDomainRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        // Parse existing settings
        var settings = string.IsNullOrEmpty(tenant.Settings)
            ? new Dictionary<string, object>()
            : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(tenant.Settings) ?? new();

        // Update custom domain
        settings["customDomain"] = request.CustomDomain;
        settings["customDomainVerified"] = false; // Will be verified separately

        tenant.Settings = System.Text.Json.JsonSerializer.Serialize(settings);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Custom domain configured",
            customDomain = request.CustomDomain,
            verificationRequired = true,
            verificationInstructions = $"Add DNS record: {request.CustomDomain} CNAME platform.zerquiz.com"
        });
    }

    /// <summary>
    /// Verify custom domain
    /// </summary>
    [HttpPost("{tenantId}/custom-domain/verify")]
    public async Task<ActionResult> VerifyCustomDomain(Guid tenantId)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        var customDomain = GetCustomDomain(tenant.Settings);
        if (string.IsNullOrEmpty(customDomain))
            return BadRequest("No custom domain configured");

        // In production, check DNS records
        var isVerified = await VerifyDnsRecords(customDomain);

        // Update settings
        var settings = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(tenant.Settings!) ?? new();
        settings["customDomainVerified"] = isVerified;
        tenant.Settings = System.Text.Json.JsonSerializer.Serialize(settings);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            customDomain,
            verified = isVerified,
            message = isVerified ? "Domain verified successfully" : "Domain verification failed"
        });
    }

    /// <summary>
    /// Get tenant by custom domain (for routing)
    /// </summary>
    [HttpGet("by-domain/{domain}")]
    public async Task<ActionResult> GetByDomain(string domain)
    {
        var tenants = await _context.Tenants.Where(t => t.IsActive).ToListAsync();

        var tenant = tenants.FirstOrDefault(t =>
        {
            var customDomain = GetCustomDomain(t.Settings);
            return !string.IsNullOrEmpty(customDomain) && customDomain.Equals(domain, StringComparison.OrdinalIgnoreCase);
        });

        if (tenant == null)
        {
            // Check default domain
            tenant = tenants.FirstOrDefault(t => t.Domain == domain);
        }

        if (tenant == null)
            return NotFound("Tenant not found for domain");

        return Ok(new
        {
            tenant.Id,
            tenant.Name,
            tenant.Domain,
            customDomain = GetCustomDomain(tenant.Settings),
            tenant.IsActive
        });
    }

    /// <summary>
    /// Update tenant settings
    /// </summary>
    [HttpPut("{tenantId}/settings")]
    public async Task<ActionResult> UpdateSettings(Guid tenantId, [FromBody] UpdateSettingsRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        tenant.Settings = System.Text.Json.JsonSerializer.Serialize(request.Settings);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Settings updated" });
    }

    /// <summary>
    /// Get tenant branding
    /// </summary>
    [HttpGet("{tenantId}/branding")]
    public async Task<ActionResult> GetBranding(Guid tenantId)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        var settings = string.IsNullOrEmpty(tenant.Settings)
            ? new Dictionary<string, object>()
            : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(tenant.Settings) ?? new();

        var branding = new
        {
            logo = settings.GetValueOrDefault("logo", ""),
            primaryColor = settings.GetValueOrDefault("primaryColor", "#3B82F6"),
            secondaryColor = settings.GetValueOrDefault("secondaryColor", "#10B981"),
            favicon = settings.GetValueOrDefault("favicon", ""),
            customCss = settings.GetValueOrDefault("customCss", "")
        };

        return Ok(branding);
    }

    /// <summary>
    /// Update tenant branding
    /// </summary>
    [HttpPost("{tenantId}/branding")]
    public async Task<ActionResult> UpdateBranding(Guid tenantId, [FromBody] UpdateBrandingRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null)
            return NotFound();

        var settings = string.IsNullOrEmpty(tenant.Settings)
            ? new Dictionary<string, object>()
            : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(tenant.Settings) ?? new();

        if (!string.IsNullOrEmpty(request.Logo))
            settings["logo"] = request.Logo;

        if (!string.IsNullOrEmpty(request.PrimaryColor))
            settings["primaryColor"] = request.PrimaryColor;

        if (!string.IsNullOrEmpty(request.SecondaryColor))
            settings["secondaryColor"] = request.SecondaryColor;

        if (!string.IsNullOrEmpty(request.Favicon))
            settings["favicon"] = request.Favicon;

        if (!string.IsNullOrEmpty(request.CustomCss))
            settings["customCss"] = request.CustomCss;

        tenant.Settings = System.Text.Json.JsonSerializer.Serialize(settings);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Branding updated" });
    }

    // Helper methods
    private string? GetCustomDomain(string? settings)
    {
        if (string.IsNullOrEmpty(settings)) return null;

        try
        {
            var settingsDict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(settings);
            if (settingsDict != null && settingsDict.TryGetValue("customDomain", out var domain))
            {
                return domain?.ToString();
            }
        }
        catch { }

        return null;
    }

    private async Task<bool> VerifyDnsRecords(string domain)
    {
        // In production, use DNS lookup to verify CNAME record
        // For now, simulate verification
        await Task.Delay(100);
        return true; // Simulated success
    }
}
*/

/*
public record SetCustomDomainRequest(string CustomDomain);
public record UpdateSettingsRequest(Dictionary<string, object> Settings);
public record UpdateBrandingRequest(string? Logo, string? PrimaryColor, string? SecondaryColor, string? Favicon, string? CustomCss);
*/