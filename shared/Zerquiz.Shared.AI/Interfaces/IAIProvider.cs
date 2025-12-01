using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Shared.AI.Interfaces;

/// <summary>
/// Interface for AI providers (OpenAI, Azure, Anthropic, Local LLM)
/// </summary>
public interface IAIProvider
{
    /// <summary>
    /// Generate text from a prompt
    /// </summary>
    Task<AIResponse<string>> GenerateTextAsync(AIPrompt prompt, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate quiz questions from content
    /// </summary>
    Task<AIResponse<QuizData>> GenerateQuizAsync(ContentInput input, QuizConfig config, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate flashcards from content
    /// </summary>
    Task<AIResponse<FlashcardSet>> GenerateFlashcardsAsync(ContentInput input, int count, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate summary from content
    /// </summary>
    Task<AIResponse<string>> GenerateSummaryAsync(ContentInput input, SummaryLength length, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate lesson plan
    /// </summary>
    Task<AIResponse<LessonPlanData>> GenerateLessonPlanAsync(LessonPlanInput input, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate worksheet
    /// </summary>
    Task<AIResponse<WorksheetData>> GenerateWorksheetAsync(ContentInput input, CancellationToken cancellationToken = default);

    /// <summary>
    /// Analyze essay
    /// </summary>
    Task<AIResponse<EssayAnalysis>> AnalyzeEssayAsync(string essay, string rubric, CancellationToken cancellationToken = default);
}

