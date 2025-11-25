using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Pedagojik/Eğitimsel soru türü (pekiştirme, anlama, yorumlama, vb.)
/// </summary>
public class QuestionPedagogicalType : BaseEntity
{
    public string Code { get; set; } = string.Empty; // reinforcement, comprehension, interpretation
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; } = true; // Sistem tarafından tanımlı mı?
    public int DisplayOrder { get; set; } = 0;
}

