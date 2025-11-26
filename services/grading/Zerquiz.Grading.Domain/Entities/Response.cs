using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Kullanıcının sınav sorusuna verdiği cevap
/// </summary>
public class Response : BaseEntity
{
    public Guid UserId { get; set; } // Kullanıcı ID
    public Guid ExamSessionId { get; set; } // Exam service'den
    public Guid ExamQuestionId { get; set; } // Exam service'den
    public Guid QuestionId { get; set; } // Question service'den
    
    public string AnswerText { get; set; } = string.Empty; // Kullanıcı cevabı
    public string UserAnswers { get; set; } = "[]"; // JSON array - Çoklu cevap desteği
    public bool IsCorrect { get; set; }
    public decimal Score { get; set; }
    public int TimeSpentSeconds { get; set; }
    public DateTime? AnsweredAt { get; set; }
}

