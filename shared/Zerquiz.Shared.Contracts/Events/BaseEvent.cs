namespace Zerquiz.Shared.Contracts.Events;

/// <summary>
/// Base event for all domain events
/// </summary>
public abstract class BaseEvent
{
    public Guid EventId { get; set; } = Guid.NewGuid();
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public Guid TenantId { get; set; }
}

