using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Domain.Entities;

/// <summary>
/// Eğitim modeli (ör: TR_MEB, TR_TYT, OXFORD, Cambridge, IB)
/// </summary>
public class EducationModel : BaseEntity
{
    public string Code { get; set; } = string.Empty; // TR_MEB, TR_TYT, OXFORD
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Description { get; set; }
    // IsActive inherited from BaseEntity
    
    public ICollection<Curriculum> Curricula { get; set; } = new List<Curriculum>();
}


