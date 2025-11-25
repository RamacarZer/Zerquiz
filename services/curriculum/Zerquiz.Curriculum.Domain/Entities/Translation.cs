using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Çok dilli çeviri desteği - Tüm içerikler için
/// </summary>
public class Translation : BaseEntity
{
    /// <summary>
    /// Hangi entity türü (Subject, Topic, LearningOutcome, etc.)
    /// </summary>
    public string EntityType { get; set; } = string.Empty; // "Subject", "Topic", "LearningOutcome"
    
    /// <summary>
    /// Entity'nin ID'si
    /// </summary>
    public Guid EntityId { get; set; }
    
    /// <summary>
    /// Hangi alan (Name, Description, etc.)
    /// </summary>
    public string FieldName { get; set; } = string.Empty; // "Name", "Description"
    
    /// <summary>
    /// Dil kodu (ISO 639-1)
    /// </summary>
    public string LanguageCode { get; set; } = string.Empty; // "tr", "en", "de", "fr", "ar"
    
    /// <summary>
    /// Çevrilmiş değer
    /// </summary>
    public string TranslatedValue { get; set; } = string.Empty;
    
    /// <summary>
    /// Çevirinin durumu
    /// </summary>
    public string Status { get; set; } = "pending"; // pending, approved, rejected
    
    /// <summary>
    /// Çeviriyi yapan (opsiyonel)
    /// </summary>
    public Guid? TranslatorId { get; set; }
    
    /// <summary>
    /// Çeviriyi onaylayan (opsiyonel)
    /// </summary>
    public Guid? ApprovedBy { get; set; }
    
    /// <summary>
    /// Onay tarihi
    /// </summary>
    public DateTime? ApprovedAt { get; set; }
}

