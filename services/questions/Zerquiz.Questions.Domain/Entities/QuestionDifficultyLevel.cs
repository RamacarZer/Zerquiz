using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Soru zorluk seviyeleri (dinamik)
/// </summary>
public class QuestionDifficultyLevel : BaseEntity
{
    public string Code { get; set; } = string.Empty; // easy, medium, hard, very_hard, expert
    public string Name { get; set; } = string.Empty; // Kolay, Orta, Zor, etc.
    public string? Description { get; set; }
    public string? Color { get; set; } // Hex color for UI (e.g., #22c55e for easy)
    public int Level { get; set; } = 1; // Numeric level for ordering/comparison
    public bool IsSystem { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
