using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Kazanım (örn: MATH.09.EQ.01 - 9. sınıf matematik denklemler kazanımı)
/// </summary>
public class LearningOutcome : BaseEntity
{
    public Guid CurriculumId { get; set; }
    public Curriculum Curriculum { get; set; } = null!;
    
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public Guid? TopicId { get; set; }
    public Topic? Topic { get; set; }
    
    public string Code { get; set; } = string.Empty; // MATH.09.EQ.01
    public string Description { get; set; } = string.Empty;
    public string? Details { get; set; }
    public int? GradeLevel { get; set; } // Sınıf seviyesi (9, 10, 11, 12)
    // IsActive inherited from BaseEntity
}


