using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Müfredat (belirli bir eğitim modeli için yıl ve dönem bazlı)
/// </summary>
public class Curriculum : BaseEntity
{
    public Guid EducationModelId { get; set; }
    public EducationModel EducationModel { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; } // 2024
    public string Term { get; set; } = string.Empty; // Fall, Spring, Güz, Bahar
    public string CurriculumVersion { get; set; } = string.Empty; // v1.0, 2024-2025 (renamed to avoid conflict with BaseEntity.Version)
    // IsActive inherited from BaseEntity
    
    public ICollection<LearningOutcome> LearningOutcomes { get; set; } = new List<LearningOutcome>();
}



