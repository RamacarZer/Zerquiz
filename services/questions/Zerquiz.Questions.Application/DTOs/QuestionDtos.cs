namespace Zerquiz.Questions.Application.DTOs;

public class QuestionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FormatType { get; set; } = string.Empty;
    public string? PedagogicalType { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string? TopicName { get; set; }
    public string Difficulty { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class QuestionDetailDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public Guid FormatTypeId { get; set; }
    public Guid? PedagogicalTypeId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? TopicId { get; set; }
    public string Difficulty { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string Status { get; set; } = string.Empty;
    public QuestionVersionDto? CurrentVersion { get; set; }
    public List<QuestionSolutionDto>? Solutions { get; set; }
}

public class QuestionVersionDto
{
    public Guid Id { get; set; }
    public int VersionNumber { get; set; }
    public string Content { get; set; } = string.Empty; // JSON string
    public DateTime CreatedAt { get; set; }
}

public class QuestionSolutionDto
{
    public Guid Id { get; set; }
    public string SolutionType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? TextContent { get; set; }
    public string? MediaUrl { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateQuestionRequest
{
    public Guid FormatTypeId { get; set; }
    public Guid? PedagogicalTypeId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? TopicId { get; set; }
    public string Difficulty { get; set; } = "medium";
    public decimal Weight { get; set; } = 1.0m;
    public string Content { get; set; } = string.Empty; // JSON
}

public class UpdateQuestionRequest
{
    public string? Difficulty { get; set; }
    public decimal? Weight { get; set; }
    public string? Content { get; set; } // New version
}

// Format Types
public class QuestionFormatTypeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
}

// Pedagogical Types
public class QuestionPedagogicalTypeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
}

// Review
public class QuestionReviewDto
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Guid ReviewerId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public string ReviewStatus { get; set; } = string.Empty;
    public string? Comments { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public decimal? ReviewFee { get; set; }
}

public class SubmitForReviewRequest
{
    public Guid QuestionId { get; set; }
    public Guid ReviewerId { get; set; }
    public string? Notes { get; set; }
}

public class ReviewQuestionRequest
{
    public Guid ReviewId { get; set; }
    public string Status { get; set; } = string.Empty; // approved, rejected, revision_requested
    public string? Comments { get; set; }
}

