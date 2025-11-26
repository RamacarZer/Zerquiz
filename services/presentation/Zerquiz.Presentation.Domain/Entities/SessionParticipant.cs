using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Participant in live presentation session
/// </summary>
public class SessionParticipant : BaseEntity
{
    public Guid SessionId { get; set; }
    public PresentationSession Session { get; set; } = null!;
    
    public Guid? UserId { get; set; } // Null for anonymous
    public string DisplayName { get; set; } = string.Empty;
    
    public DateTime JoinedAt { get; set; }
    public DateTime? LeftAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Connection tracking
    public string? ConnectionId { get; set; } // SignalR connection
    public DateTime LastSeenAt { get; set; }
}

