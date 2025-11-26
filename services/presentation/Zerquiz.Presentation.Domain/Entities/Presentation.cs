using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Sunum/Presentation entity - Socrative tarzı modern sunumlar
/// </summary>
public class Presentation : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? SubjectId { get; set; } // Curriculum link (optional)
    
    // Settings
    public string Theme { get; set; } = "default"; // default, dark, minimal, modern
    public bool AllowStudentQuestions { get; set; } = true;
    public bool ShowProgressBar { get; set; } = true;
    public bool ShowSlideNumbers { get; set; } = true;
    
    // Live features
    public bool IsLive { get; set; }
    public string? LiveCode { get; set; } // 6-digit join code (ABC123)
    public DateTime? LiveStartTime { get; set; }
    public DateTime? LiveEndTime { get; set; }
    
    // Navigation
    public ICollection<Slide> Slides { get; set; } = new List<Slide>();
    public ICollection<PresentationSession> Sessions { get; set; } = new List<PresentationSession>();
}

