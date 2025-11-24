using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Sınavdaki sorular
/// </summary>
public class ExamQuestion : BaseEntity
{
    public Guid ExamSectionId { get; set; }
    public ExamSection ExamSection { get; set; } = null!;
    
    public Guid QuestionId { get; set; } // Questions service'den
    public int DisplayOrder { get; set; }
    public decimal Points { get; set; }
    public decimal Weight { get; set; } = 1.0m;
}

