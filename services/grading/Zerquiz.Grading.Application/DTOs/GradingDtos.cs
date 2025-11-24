namespace Zerquiz.Grading.Application.DTOs;

public class SubmitResponseRequest
{
    public Guid ExamSessionId { get; set; }
    public Guid ExamQuestionId { get; set; }
    public List<string> UserAnswers { get; set; } = new();
    public int TimeSpentSeconds { get; set; }
}

public class ExamResultDto
{
    public Guid Id { get; set; }
    public Guid ExamId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public decimal TotalScore { get; set; }
    public decimal MaxScore { get; set; }
    public decimal Percentage { get; set; }
    public int CorrectCount { get; set; }
    public int WrongCount { get; set; }
    public int EmptyCount { get; set; }
    public DateTime EvaluatedAt { get; set; }
}

public class CertificateDto
{
    public Guid Id { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string ExamName { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public DateTime IssuedAt { get; set; }
    public string? PdfUrl { get; set; }
}

