using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Live presentation session (Socrative-style)
/// </summary>
public class PresentationSession : BaseEntity
{
    public Guid PresentationId { get; set; }
    public Presentation Presentation { get; set; } = null!;
    
    public Guid HostId { get; set; } // Teacher/Presenter
    public string SessionCode { get; set; } = string.Empty; // 6-digit join code
    
    // Session state
    public string SessionStatus { get; set; } = "waiting"; // waiting, active, paused, ended
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    
    // Current slide
    public Guid? CurrentSlideId { get; set; }
    public int CurrentSlideIndex { get; set; } = 0;
    
    // Settings
    public bool AllowAnonymous { get; set; } = false;
    public bool ShowResults { get; set; } = true;
    public bool AllowQuestions { get; set; } = true;
    public int? ParticipantLimit { get; set; }
    
    // Statistics
    public int ParticipantCount { get; set; } = 0;
    public int TotalResponses { get; set; } = 0;
    
    // Relations
    public ICollection<SessionParticipant> Participants { get; set; } = new List<SessionParticipant>();
    public ICollection<SessionResponse> Responses { get; set; } = new List<SessionResponse>();
}
