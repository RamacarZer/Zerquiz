using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Presentation.Domain.Entities;

/// <summary>
/// Slayt entity - Her sunum birden fazla slayt içerir
/// </summary>
public class Slide : BaseEntity
{
    public Guid PresentationId { get; set; }
    public Presentation Presentation { get; set; } = null!;
    
    public int Order { get; set; } // Sıralama (0, 1, 2...)
    
    public SlideType Type { get; set; } // Slayt tipi
    
    // Content
    public string? Title { get; set; }
    public string? Content { get; set; } // HTML/Markdown + LaTeX support
    public string? ImageUrl { get; set; }
    public string? ImageCaption { get; set; }
    
    // Two Column Layout
    public string? LeftColumn { get; set; }
    public string? RightColumn { get; set; }
    
    // Interactive elements
    public Guid? QuestionId { get; set; } // Link to Questions Service
    public string? PollQuestion { get; set; }
    public string? PollOptions { get; set; } // JSON array: ["Option 1", "Option 2", ...]
    
    // Transitions & Animations
    public string Transition { get; set; } = "fade"; // fade, slide, zoom, none
    public int Duration { get; set; } = 0; // Auto-advance seconds (0 = manual)
    
    // Speaker notes (only visible to presenter)
    public string? SpeakerNotes { get; set; }
    
    // Styling
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
}

/// <summary>
/// Slide tipleri - Socrative tarzı çeşitli content types
/// </summary>
public enum SlideType
{
    Title,       // Başlık slaydı (cover slide)
    Content,     // Metin içerik (markdown + LaTeX)
    Image,       // Görsel slayt
    Quiz,        // Questions Service'den soru
    Poll,        // Anlık poll/oylama
    TwoColumn,   // İki sütun layout
    Blank        // Boş slayt
}

