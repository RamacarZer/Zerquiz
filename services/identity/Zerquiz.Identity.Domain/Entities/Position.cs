using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

public class Position : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; } // 1=Müdür, 2=Müdür Yrd, 3=Koordinatör, 4=Zümre Bşk, 5=Öğretmen, etc.
    public int DisplayOrder { get; set; }
    
    // Navigation
    public ICollection<User> Users { get; set; } = new List<User>();
}

