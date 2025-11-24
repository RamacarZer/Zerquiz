using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Lisans Paketleri - Starter, Professional, Enterprise, vb.
/// </summary>
public class LicensePackage : BaseEntity
{
    public string Code { get; set; } = string.Empty; // STARTER, PRO, ENTERPRISE
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "TRY";
    
    // Limitler
    public int MaxUsers { get; set; } // -1 = unlimited
    public int MaxStudents { get; set; }
    public int MaxQuestions { get; set; }
    public int MaxExams { get; set; }
    public int MaxStorage { get; set; } // MB cinsinden
    
    // Özellikler (JSONB)
    public string? FeaturesJson { get; set; } // ["question_bank", "exam_creator", "analytics"]
    
    public int DisplayOrder { get; set; }
    
    // Navigation
    public ICollection<TenantLicense> TenantLicenses { get; set; } = new List<TenantLicense>();
}

/// <summary>
/// Tenant'a atanan lisans
/// </summary>
public class TenantLicense
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; } // Tenant ID - BaseEntity kullanmıyoruz çünkü TenantId özel
    public Guid LicensePackageId { get; set; }
    public string LicenseKey { get; set; } = string.Empty; // Unique license key
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    
    public string? Metadata { get; set; } // JSONB
    public string[]? Tags { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsTrial { get; set; } = false;
    
    // Kullanım İstatistikleri
    public int CurrentUsers { get; set; }
    public int CurrentStudents { get; set; }
    public int CurrentQuestions { get; set; }
    public int CurrentExams { get; set; }
    public long CurrentStorageUsed { get; set; } // Bytes
    
    // Özel limitler (override)
    public int? CustomMaxUsers { get; set; }
    public int? CustomMaxStudents { get; set; }
    public int? CustomMaxQuestions { get; set; }
    public int? CustomMaxExams { get; set; }
    public long? CustomMaxStorage { get; set; }
    
    // Özel özellikler
    public string? CustomFeaturesJson { get; set; } // Override features
    
    // Navigation
    public LicensePackage LicensePackage { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}

/// <summary>
/// Sistem özellikleri - Modül bazlı erişim kontrolü
/// </summary>
public class SystemFeature : BaseEntity
{
    public string Code { get; set; } = string.Empty; // QUESTION_BANK, EXAM_CREATOR, ANALYTICS
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // CORE, PREMIUM, ADDON
    public bool RequiresLicense { get; set; } = true;
    public int DisplayOrder { get; set; }
}

/// <summary>
/// Kullanıcı özel yetkileri - Rol dışında ekstra yetkiler
/// </summary>
public class UserPermission : BaseEntity
{
    public Guid UserId { get; set; }
    public string PermissionCode { get; set; } = string.Empty; // CREATE_EXAM, APPROVE_QUESTION, vb.
    public string? ResourceType { get; set; } // SUBJECT, DEPARTMENT, ALL
    public Guid? ResourceId { get; set; } // Sadece belirli subject'e yetki vb.
    public DateTime? ExpiresAt { get; set; }
    public string? GrantedBy { get; set; }
}

