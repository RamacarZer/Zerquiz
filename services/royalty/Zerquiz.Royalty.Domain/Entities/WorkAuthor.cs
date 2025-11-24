using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Royalty.Domain.Entities;

/// <summary>
/// Eser yazarları ve pay oranları
/// </summary>
public class WorkAuthor : BaseEntity
{
    public Guid WorkId { get; set; }
    public Work Work { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public decimal SharePercentage { get; set; } // Yüzde pay
    public string Role { get; set; } = "co-author"; // primary, co-author
}

