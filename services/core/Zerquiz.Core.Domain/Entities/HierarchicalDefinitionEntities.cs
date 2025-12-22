using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Definition Group - Top-level grouping for hierarchical definitions
/// </summary>
public class DefinitionGroup : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsSystemReserved { get; set; } = false;
    // ModuleId inherited from BaseEntity
    
    // Navigation properties
    public virtual ICollection<Definition> Definitions { get; set; } = new List<Definition>();
    public virtual ICollection<DefinitionGroupTranslation> Translations { get; set; } = new List<DefinitionGroupTranslation>();
}

/// <summary>
/// Definition Group Translation - Multi-language support for definition groups
/// </summary>
public class DefinitionGroupTranslation
{
    public Guid Id { get; set; }
    public Guid DefinitionGroupId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public virtual DefinitionGroup DefinitionGroup { get; set; } = null!;
}

/// <summary>
/// Definition - Hierarchical definition item
/// </summary>
public class Definition : BaseEntity
{
    public Guid DefinitionGroupId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Value { get; set; }
    public Guid? ParentDefinitionId { get; set; }
    public int Level { get; set; } = 0;
    public int DisplayOrder { get; set; } = 0;
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public Guid[]? ChildIds { get; set; } // Array of child IDs for quick access
    public bool IsSystemReserved { get; set; } = false;
    
    // Navigation properties
    public virtual DefinitionGroup DefinitionGroup { get; set; } = null!;
    public virtual Definition? ParentDefinition { get; set; }
    public virtual ICollection<Definition> ChildDefinitions { get; set; } = new List<Definition>();
    public virtual ICollection<DefinitionTranslation> Translations { get; set; } = new List<DefinitionTranslation>();
    public virtual ICollection<DefinitionRelation> RelationsAsSource { get; set; } = new List<DefinitionRelation>();
    public virtual ICollection<DefinitionRelation> RelationsAsTarget { get; set; } = new List<DefinitionRelation>();
}

/// <summary>
/// Definition Translation - Multi-language support for definitions
/// </summary>
public class DefinitionTranslation
{
    public Guid Id { get; set; }
    public Guid DefinitionId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public virtual Definition Definition { get; set; } = null!;
}

/// <summary>
/// Definition Relation - Many-to-many relationships between definitions
/// </summary>
public class DefinitionRelation
{
    public Guid Id { get; set; }
    public Guid SourceDefinitionId { get; set; }
    public Guid TargetDefinitionId { get; set; }
    public string RelationType { get; set; } = "related"; // related, prerequisite, alternative, etc.
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    
    public virtual Definition SourceDefinition { get; set; } = null!;
    public virtual Definition TargetDefinition { get; set; } = null!;
}




