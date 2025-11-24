namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Pedagojik/Eğitimsel soru türü (pekiştirme, anlama, yorumlama, vb.)
/// </summary>
public class QuestionPedagogicalType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // reinforcement, comprehension, interpretation
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

