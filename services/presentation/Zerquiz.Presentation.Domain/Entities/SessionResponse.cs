using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Real-time response to presentation slide
/// </summary>
public class SessionResponse : BaseEntity
{
    public Guid SessionId { get; set; }
    public PresentationSession Session { get; set; } = null!;
    
    public Guid SlideId { get; set; }
    public Guid ParticipantId { get; set; }
    public SessionParticipant Participant { get; set; } = null!;
    
    public string ResponseData { get; set; } = "{}"; // JSONB
    public DateTime RespondedAt { get; set; }
    
    public bool IsCorrect { get; set; }
    public int? Points { get; set; }
    public int ResponseTimeMs { get; set; } // Response time in milliseconds
}

