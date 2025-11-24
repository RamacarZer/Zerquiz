namespace Zerquiz.Exams.Domain.Entities;

/// <summary>
/// Kitapçıktaki sorular (karışık sırada)
/// </summary>
public class BookletQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookletId { get; set; }
    public Booklet Booklet { get; set; } = null!;
    
    public Guid ExamQuestionId { get; set; }
    public ExamQuestion ExamQuestion { get; set; } = null!;
    
    public int DisplayOrder { get; set; }
    public string OptionsOrder { get; set; } = "[]"; // JSON array - Karışık şık sırası
}

