namespace Zerquiz.Shared.AI.Models;

/// <summary>
/// Input for content-based AI generation
/// </summary>
public class ContentInput
{
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subject { get; set; }
    public string? Grade { get; set; }
    public string Language { get; set; } = "tr";
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// Quiz generation configuration
/// </summary>
public class QuizConfig
{
    public List<string> QuestionTypeCodes { get; set; } = new();
    public string Difficulty { get; set; } = "medium"; // easy, medium, hard
    public int Count { get; set; } = 10;
    public string Language { get; set; } = "tr";
    public bool IncludeExplanations { get; set; } = true;
}

/// <summary>
/// Generated quiz data structure
/// </summary>
public class QuizData
{
    public List<GeneratedQuestion> Questions { get; set; } = new();
}

public class GeneratedQuestion
{
    public string QuestionTypeCode { get; set; } = string.Empty;
    public string Stem { get; set; } = string.Empty;
    public List<string>? Options { get; set; }
    public string? CorrectAnswer { get; set; }
    public string? Explanation { get; set; }
    public string Difficulty { get; set; } = "medium";
    public int Points { get; set; } = 5;
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// Flashcard set
/// </summary>
public class FlashcardSet
{
    public List<Flashcard> Cards { get; set; } = new();
}

public class Flashcard
{
    public string Front { get; set; } = string.Empty;
    public string Back { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Hint { get; set; }
}

/// <summary>
/// Summary length options
/// </summary>
public enum SummaryLength
{
    Short,
    Medium,
    Long
}

/// <summary>
/// Lesson plan generation input
/// </summary>
public class LessonPlanInput
{
    public string Topic { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public int Duration { get; set; } = 45; // minutes
    public string TemplateCode { get; set; } = "traditional";
    public string Language { get; set; } = "tr";
    public List<string>? LearningObjectives { get; set; }
}

/// <summary>
/// Generated lesson plan data
/// </summary>
public class LessonPlanData
{
    public string Title { get; set; } = string.Empty;
    public List<string> Objectives { get; set; } = new();
    public List<LessonActivity> Activities { get; set; } = new();
    public List<string> MaterialsNeeded { get; set; } = new();
    public string? Assessment { get; set; }
}

public class LessonActivity
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string? Instructions { get; set; }
}

/// <summary>
/// Worksheet generation data
/// </summary>
public class WorksheetData
{
    public string Title { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public List<WorksheetQuestion> Questions { get; set; } = new();
    public WorksheetAnswerKey? AnswerKey { get; set; }
}

public class WorksheetQuestion
{
    public int Number { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string QuestionType { get; set; } = string.Empty;
    public int Points { get; set; } = 5;
}

public class WorksheetAnswerKey
{
    public List<WorksheetAnswer> Answers { get; set; } = new();
}

public class WorksheetAnswer
{
    public int Number { get; set; }
    public string Answer { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

/// <summary>
/// Essay analysis result
/// </summary>
public class EssayAnalysis
{
    public int EstimatedScore { get; set; }
    public string Grade { get; set; } = string.Empty;
    public List<string> Strengths { get; set; } = new();
    public List<string> Weaknesses { get; set; } = new();
    public List<string> Suggestions { get; set; } = new();
    public Dictionary<string, int>? RubricScores { get; set; }
    public string? OverallFeedback { get; set; }
}




