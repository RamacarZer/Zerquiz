using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Tanım Grupları - Branş, Alt Branş, Konu, Alt Konu, Başlık, Kazanım gibi tanım kategorileri
/// </summary>
public class DefinitionGroup : BaseEntity
{
    public string Code { get; set; } = string.Empty; // SUBJECT, SUB_SUBJECT, TOPIC, SUB_TOPIC, TITLE, OUTCOME
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; } = false; // Sistem tanımı mı?
    public int DisplayOrder { get; set; } = 0;
    public string? Icon { get; set; }
    
    // Eğitim Modeli İlişkisi (Optional - tüm gruplar için geçerli olmayabilir)
    public Guid? EducationModelId { get; set; }
    
    // Navigation
    public EducationModel? EducationModel { get; set; }
    public ICollection<DefinitionGroupTranslation> Translations { get; set; } = new List<DefinitionGroupTranslation>();
    public ICollection<Definition> Definitions { get; set; } = new List<Definition>();
}

/// <summary>
/// Tanım Grubu Çevirileri
/// </summary>
public class DefinitionGroupTranslation
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid DefinitionGroupId { get; set; }
    public string LanguageCode { get; set; } = string.Empty; // tr, en, de, fr, ar
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    // Navigation
    public DefinitionGroup DefinitionGroup { get; set; } = null!;
}

/// <summary>
/// Tanımlar - Branş, Alt Branş, Konu, Alt Konu, Başlık, Kazanım tanımları
/// Hiyerarşik yapı: parent_id ile üst tanıma bağlanır
/// </summary>
public class Definition : BaseEntity
{
    public Guid GroupId { get; set; } // Hangi grup? (SUBJECT, TOPIC, OUTCOME...)
    public string GroupKey { get; set; } = string.Empty; // Grup kodu
    public Guid? ParentId { get; set; } // Üst tanım (hiyerarşi için)
    public string Code { get; set; } = string.Empty; // Unique code
    public string Name { get; set; } = string.Empty;
    public string[]? AltNames { get; set; } // Alternatif isimler
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public bool IsDefault { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
    public bool IsSystem { get; set; } = false;
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    
    // Eğitim Modeli İlişkisi (Optional - definitions can belong to specific education models)
    public Guid? EducationModelId { get; set; }
    
    // Extended from BaseEntity via inheritance
    // id, tenant_id, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by,
    // is_active, status, version, source, metadata, tags, ip_address, user_agent, 
    // request_id, correlation_id inherited
    
    public Guid? OrganizationId { get; set; }
    public Guid? AppId { get; set; }
    
    // Navigation
    public EducationModel? EducationModel { get; set; }
    public DefinitionGroup Group { get; set; } = null!;
    public Definition? Parent { get; set; }
    public ICollection<Definition> Children { get; set; } = new List<Definition>();
    public ICollection<DefinitionTranslation> Translations { get; set; } = new List<DefinitionTranslation>();
}

/// <summary>
/// Tanım Çevirileri
/// </summary>
public class DefinitionTranslation
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid DefinitionId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    // Navigation
    public Definition Definition { get; set; } = null!;
}

