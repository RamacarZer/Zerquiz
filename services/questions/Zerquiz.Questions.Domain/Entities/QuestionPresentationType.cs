using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru sunum şekli ve cevap tipi (dinamik)
/// </summary>
public class QuestionPresentationType : BaseEntity
{
    public string Code { get; set; } = string.Empty; // written_text, multiple_choice, true_false, etc.
    public string Name { get; set; } = string.Empty; // Yazılı Sorusu, Şıklı, Doğru/Yanlış
    public string? Description { get; set; }
    
    /// <summary>
    /// Cevap alanı tipi: text_input, options, boolean, matching, ordering, etc.
    /// </summary>
    public string AnswerType { get; set; } = string.Empty;
    
    /// <summary>
    /// Minimum şık/seçenek sayısı (şıklı sorular için)
    /// </summary>
    public int? MinOptions { get; set; }
    
    /// <summary>
    /// Maximum şık/seçenek sayısı
    /// </summary>
    public int? MaxOptions { get; set; }
    
    /// <summary>
    /// Önizlemede şık isimleri gizlensin mi?
    /// </summary>
    public bool HideOptionLabelsInPreview { get; set; } = false;
    
    /// <summary>
    /// Cevap zorunlu mu? (Cevapsız sorular için false)
    /// </summary>
    public bool RequiresAnswer { get; set; } = true;
    
    /// <summary>
    /// Yapılandırma şeması (JSON)
    /// </summary>
    public string? ConfigSchema { get; set; }
    
    public bool IsSystem { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}


