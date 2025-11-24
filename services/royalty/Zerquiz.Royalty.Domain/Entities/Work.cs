using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Royalty.Domain.Entities;

/// <summary>
/// Eser (Soru, Kitap, Sınav seti)
/// </summary>
public class Work : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "question"; // question, book, exam_set
    public Guid PrimaryAuthorId { get; set; }
    public Guid? WorkGroupId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public ICollection<WorkAuthor> Authors { get; set; } = new List<WorkAuthor>();
    public ICollection<RoyaltyTransaction> Transactions { get; set; } = new List<RoyaltyTransaction>();
}

