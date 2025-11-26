using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Sunum oturumu - Live presentation tracking
/// </summary>
public class PresentationSession : BaseEntity
{
    public Guid PresentationId { get; set; }
    public Presentation Presentation { get; set; } = null!;
    
    public Guid PresenterUserId { get; set; } // Öğretmen/Sunan kişi
    
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    // Live state
    public int CurrentSlideIndex { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public string? SessionCode { get; set; } // Join code for students
    
    // Statistics
    public int TotalAttendees { get; set; }
    public int CurrentOnlineCount { get; set; }
    
    // Navigation
    public ICollection<SessionAttendee> Attendees { get; set; } = new List<SessionAttendee>();
    public ICollection<SlideInteraction> Interactions { get; set; } = new List<SlideInteraction>();
}

/// <summary>
/// Session katılımcıları
/// </summary>
public class SessionAttendee : BaseEntity
{
    public Guid SessionId { get; set; }
    public PresentationSession Session { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    
    public DateTime JoinedAt { get; set; }
    public DateTime? LeftAt { get; set; }
    public bool IsOnline { get; set; } = true;
    
    // Tracking
    public int LastViewedSlideIndex { get; set; }
    public DateTime? LastActiveAt { get; set; }
}

/// <summary>
/// Slayt etkileşimleri (quiz answers, poll votes)
/// </summary>
public class SlideInteraction : BaseEntity
{
    public Guid SessionId { get; set; }
    public PresentationSession Session { get; set; } = null!;
    
    public Guid SlideId { get; set; }
    public Guid UserId { get; set; }
    
    public string InteractionType { get; set; } = string.Empty; // quiz_answer, poll_vote, question
    public string? Response { get; set; } // JSON data
    public DateTime RespondedAt { get; set; }
    
    public bool IsCorrect { get; set; } // For quiz answers
    public int? Score { get; set; }
}

