using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Questions.Domain.Entities;

/// <summary>
/// Ana soru kaydı (metadata ve durum bilgisi)
/// </summary>
public class Question : BaseEntity
{
    public string Code { get; set; } = string.Empty; // Tenant içinde unique kod
    
    // Format ve tip
    public Guid FormatTypeId { get; set; }
    public QuestionFormatType FormatType { get; set; } = null!;
    
    public Guid? PedagogicalTypeId { get; set; }
    public QuestionPedagogicalType? PedagogicalType { get; set; }
    
    // Müfredat ilişkileri
    public Guid SubjectId { get; set; } // Branş
    public Guid? TopicId { get; set; } // Konu
    public Guid? SubtopicId { get; set; } // Alt konu
    public Guid? LearningOutcomeId { get; set; } // Kazanım
    public Guid? CurriculumId { get; set; } // Müfredat
    
    // Zorluk ve ağırlık
    public string Difficulty { get; set; } = "medium"; // easy, medium, hard, advanced
    public decimal Weight { get; set; } = 1.0m; // Soru katsayısı
    
    // Durum ve onay (renamed to avoid conflict with BaseEntity.Status)
    public string QuestionStatus { get; set; } = "draft"; // draft, internal_review, review_requested, approved, published, archived
    public Guid CurrentVersionId { get; set; } // Güncel versiyon
    public DateTime? PublishedAt { get; set; }
    
    // İlişkiler
    public ICollection<QuestionVersion> Versions { get; set; } = new List<QuestionVersion>();
    public ICollection<QuestionSolution> Solutions { get; set; } = new List<QuestionSolution>();
    public ICollection<QuestionReview> Reviews { get; set; } = new List<QuestionReview>();
}

