namespace Zerquiz.Presentation.Application.DTOs;

public class PresentationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Theme { get; set; } = "default";
    public bool IsLive { get; set; }
    public string? LiveCode { get; set; }
    public int SlideCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class PresentationDetailDto : PresentationDto
{
    public bool AllowStudentQuestions { get; set; }
    public bool ShowProgressBar { get; set; }
    public bool ShowSlideNumbers { get; set; }
    public List<SlideDto> Slides { get; set; } = new();
}

public class SlideDto
{
    public Guid Id { get; set; }
    public Guid PresentationId { get; set; }
    public int Order { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? SpeakerNotes { get; set; }
}

public class CreatePresentationRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? SubjectId { get; set; }
    public string Theme { get; set; } = "default";
}

public class UpdatePresentationRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Theme { get; set; }
    public bool? AllowStudentQuestions { get; set; }
    public bool? ShowProgressBar { get; set; }
}

public class CreateSlideRequest
{
    public string Type { get; set; } = "Content";
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int? Order { get; set; }
}

public class UpdateSlideRequest
{
    public string? Type { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? SpeakerNotes { get; set; }
    public int? Order { get; set; }
}

public class SessionDto
{
    public Guid Id { get; set; }
    public Guid PresentationId { get; set; }
    public string PresentationTitle { get; set; } = string.Empty;
    public string SessionCode { get; set; } = string.Empty;
    public int CurrentSlideIndex { get; set; }
    public bool IsActive { get; set; }
    public int TotalAttendees { get; set; }
    public int CurrentOnlineCount { get; set; }
    public DateTime StartTime { get; set; }
}

