namespace Zerquiz.Exams.Application.DTOs;

public class ExamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ScheduledAt { get; set; }
    public int QuestionCount { get; set; }
}

public class CreateExamRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Mode { get; set; } = "online";
    public int DurationMinutes { get; set; }
    public Guid? CurriculumId { get; set; }
}

public class ExamSessionDto
{
    public Guid Id { get; set; }
    public Guid ExamId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public Guid? BookletId { get; set; }
    public string? BookletType { get; set; }
    public DateTime StartedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class StartExamRequest
{
    public Guid ExamId { get; set; }
    public Guid? BookletId { get; set; }
}

