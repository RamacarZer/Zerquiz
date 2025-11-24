namespace Zerquiz.Shared.Contracts.Events;

/// <summary>
/// Event published when a question is published
/// </summary>
public class QuestionPublishedEvent : BaseEvent
{
    public Guid QuestionId { get; set; }
    public Guid AuthorId { get; set; }
    public Guid SubjectId { get; set; }
}

