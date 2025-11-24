namespace Zerquiz.Shared.Contracts.Events;

/// <summary>
/// Event published when a user is registered
/// </summary>
public class UserRegisteredEvent : BaseEvent
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

