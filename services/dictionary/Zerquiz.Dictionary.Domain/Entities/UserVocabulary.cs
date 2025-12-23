using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Dictionary.Domain.Entities;

/// <summary>
/// User vocabulary - saved words
/// </summary>
public class UserVocabulary : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid DictionaryEntryId { get; set; }
    public DictionaryEntry DictionaryEntry { get; set; } = null!;
    
    // Learning Progress
    public int MasteryLevel { get; set; } = 1; // 1-5 stars
    public int ReviewCount { get; set; } = 0;
    public DateTime? LastReviewedAt { get; set; }
    public DateTime? NextReviewDate { get; set; }
    
    // Context where word was found
    public string? SourceContext { get; set; }
    public Guid? SourceBookId { get; set; }
    public Guid? SourceChapterId { get; set; }
    
    // User notes
    public string? UserNote { get; set; }
}

