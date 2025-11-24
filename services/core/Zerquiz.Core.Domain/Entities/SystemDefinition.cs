using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Dinamik tanımlamalar - Tüm dropdown ve liste değerleri için merkezi yönetim
/// </summary>
public class SystemDefinition : BaseEntity
{
    public string Category { get; set; } = string.Empty; // question_difficulty, exam_mode, user_status, etc.
    public string Code { get; set; } = string.Empty; // easy, medium, hard, etc.
    public string Name { get; set; } = string.Empty; // Display name
    public string? Description { get; set; }
    
    // Multi-language support
    public string? NameEn { get; set; }
    public string? NameTr { get; set; }
    public string? NameAr { get; set; }
    public string? DescriptionEn { get; set; }
    public string? DescriptionTr { get; set; }
    public string? DescriptionAr { get; set; }
    
    // Display & Ordering
    public int DisplayOrder { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
    
    // Hierarchical Structure
    public Guid? ParentId { get; set; }
    public SystemDefinition? Parent { get; set; }
    public ICollection<SystemDefinition> Children { get; set; } = new List<SystemDefinition>();
    
    // Configuration
    public string? ConfigurationJson { get; set; } // JSONB - Flexible config per definition
    
    // System Reserved (Cannot be deleted by users)
    public bool IsSystemReserved { get; set; }
    public bool IsEditable { get; set; } = true;
}

/// <summary>
/// Çeviri tablosu - Gelecekte tam i18n desteği için
/// </summary>
public class Translation : BaseEntity
{
    public string EntityType { get; set; } = string.Empty; // Tenant, Question, Exam, etc.
    public Guid EntityId { get; set; }
    public string FieldName { get; set; } = string.Empty; // Name, Description, Title, etc.
    public string LanguageCode { get; set; } = string.Empty; // tr, en, ar, fr, etc.
    public string TranslatedValue { get; set; } = string.Empty;
}

/// <summary>
/// Sistem parametreleri - Global ayarlar için
/// </summary>
public class SystemParameter : BaseEntity
{
    public string Category { get; set; } = string.Empty; // email, sms, payment, security, etc.
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "string"; // string, int, bool, json, etc.
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; }
    public bool IsEditable { get; set; } = true;
}

