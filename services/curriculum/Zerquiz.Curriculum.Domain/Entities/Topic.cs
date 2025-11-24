using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Konu hiyerarşisi (Konu -> Alt Konu -> Başlık)
/// </summary>
public class Topic : BaseEntity
{
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public Guid? ParentTopicId { get; set; } // Üst konuya bağlantı (alt konu için)
    public Topic? ParentTopic { get; set; }
    
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; } // 1=Konu, 2=Alt Konu, 3=Başlık
    public int DisplayOrder { get; set; }
    public string? Description { get; set; }
    
    public ICollection<Topic> SubTopics { get; set; } = new List<Topic>();
    public ICollection<LearningOutcome> LearningOutcomes { get; set; } = new List<LearningOutcome>();
}

