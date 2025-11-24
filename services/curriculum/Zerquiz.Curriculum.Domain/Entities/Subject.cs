using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Branş (Matematik, Fizik, İngilizce, vb.)
/// </summary>
public class Subject : BaseEntity
{
    public string Code { get; set; } = string.Empty; // MATH, PHYS, ENG
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    
    // Navigation properties
    public ICollection<Topic> Topics { get; set; } = new List<Topic>();
    public ICollection<LearningOutcome> LearningOutcomes { get; set; } = new List<LearningOutcome>();
}

