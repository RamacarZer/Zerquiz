using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Lisans paketi - SuperAdmin tarafından tanımlanır
/// </summary>
public class LicensePackage : BaseEntity
{
    // Package Info
    public string Code { get; set; } = string.Empty; // free, basic, professional, enterprise
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Pricing
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public int TrialDays { get; set; } = 0;
    
    // Quota Limits
    public int MaxUsers { get; set; } // 0 = unlimited
    public int MaxStudents { get; set; } // 0 = unlimited
    public int MaxQuestions { get; set; } // 0 = unlimited
    public int MaxExams { get; set; } // 0 = unlimited
    public int MaxStorageGB { get; set; } // 0 = unlimited
    public int MaxApiCallsPerMonth { get; set; } // 0 = unlimited
    public int MaxModules { get; set; } // Modül sayısı (soru, sınav, müfredat vs.)
    public int MaxCases { get; set; } // Dava sayısı (özel domain için)
    public int MaxDocuments { get; set; } // Döküman sayısı
    
    // Features (JSONB - string array)
    public string[]? Features { get; set; } // ["custom_domain", "white_label", "api_access"]
    
    // Display (override BaseEntity.IsActive for specific usage)
    public new bool IsActive { get; set; } = true;
    public bool IsPublic { get; set; } = true; // Kayıt sayfasında göster
    public bool IsHighlighted { get; set; } = false; // "En Popüler" badge
    public string? HighlightText { get; set; } // "En Popüler", "Önerilen"
    public int DisplayOrder { get; set; } = 0;
    
    // Navigation
    public ICollection<TenantLicense> TenantLicenses { get; set; } = new List<TenantLicense>();
}

