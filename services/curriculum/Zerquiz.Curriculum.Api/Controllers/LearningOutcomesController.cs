using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LearningOutcomesController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public LearningOutcomesController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all learning outcomes with filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] Guid? subjectId = null,
        [FromQuery] Guid? topicId = null,
        [FromQuery] string? gradeLevel = null)
    {
        var query = _context.Definitions
            .Where(d => d.DefinitionGroupKey == "LEARNING_OUTCOME" && d.IsActive);

        // Apply filters via metadata (stored in JSONB)
        var outcomes = await query
            .OrderBy(d => d.DisplayOrder)
            .Select(d => new
            {
                d.Id,
                d.Code,
                d.Name,
                d.Description,
                d.Metadata,
                d.DisplayOrder
            })
            .ToListAsync();

        // Filter in memory (since JSONB querying is complex)
        if (subjectId.HasValue || topicId.HasValue || !string.IsNullOrEmpty(gradeLevel))
        {
            outcomes = outcomes.Where(o =>
            {
                if (o.Metadata == null) return false;

                var metadata = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(o.Metadata);

                if (subjectId.HasValue && metadata.TryGetProperty("subjectId", out var subjId))
                {
                    if (subjId.GetString() != subjectId.ToString()) return false;
                }

                if (topicId.HasValue && metadata.TryGetProperty("topicId", out var topId))
                {
                    if (topId.GetString() != topicId.ToString()) return false;
                }

                if (!string.IsNullOrEmpty(gradeLevel) && metadata.TryGetProperty("gradeLevel", out var grade))
                {
                    if (grade.GetString() != gradeLevel) return false;
                }

                return true;
            }).ToList();
        }

        return Ok(outcomes);
    }

    /// <summary>
    /// Get learning outcome by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var outcome = await _context.Definitions
            .FirstOrDefaultAsync(d => d.Id == id && d.DefinitionGroupKey == "LEARNING_OUTCOME");

        if (outcome == null)
            return NotFound();

        return Ok(outcome);
    }

    /// <summary>
    /// Create learning outcome
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateLearningOutcomeRequest request)
    {
        var outcome = new Definition
        {
            DefinitionGroupKey = "LEARNING_OUTCOME",
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder ?? 0,
            IsActive = true,
            Metadata = System.Text.Json.JsonSerializer.Serialize(new
            {
                subjectId = request.SubjectId,
                topicId = request.TopicId,
                subtopicId = request.SubtopicId,
                gradeLevel = request.GradeLevel,
                bloomLevel = request.BloomLevel,
                estimatedDuration = request.EstimatedDuration,
                keywords = request.Keywords
            })
        };

        _context.Definitions.Add(outcome);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = outcome.Id }, outcome);
    }

    /// <summary>
    /// Update learning outcome
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateLearningOutcomeRequest request)
    {
        var outcome = await _context.Definitions
            .FirstOrDefaultAsync(d => d.Id == id && d.DefinitionGroupKey == "LEARNING_OUTCOME");

        if (outcome == null)
            return NotFound();

        if (!string.IsNullOrEmpty(request.Name))
            outcome.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Description))
            outcome.Description = request.Description;

        if (request.DisplayOrder.HasValue)
            outcome.DisplayOrder = request.DisplayOrder.Value;

        // Update metadata
        if (request.SubjectId.HasValue || request.TopicId.HasValue || !string.IsNullOrEmpty(request.GradeLevel))
        {
            var existingMetadata = string.IsNullOrEmpty(outcome.Metadata)
                ? new { }
                : System.Text.Json.JsonSerializer.Deserialize<dynamic>(outcome.Metadata);

            outcome.Metadata = System.Text.Json.JsonSerializer.Serialize(new
            {
                subjectId = request.SubjectId ?? existingMetadata?.subjectId,
                topicId = request.TopicId ?? existingMetadata?.topicId,
                subtopicId = request.SubtopicId ?? existingMetadata?.subtopicId,
                gradeLevel = request.GradeLevel ?? existingMetadata?.gradeLevel,
                bloomLevel = request.BloomLevel ?? existingMetadata?.bloomLevel,
                estimatedDuration = request.EstimatedDuration ?? existingMetadata?.estimatedDuration,
                keywords = request.Keywords ?? existingMetadata?.keywords
            });
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Delete learning outcome
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var outcome = await _context.Definitions
            .FirstOrDefaultAsync(d => d.Id == id && d.DefinitionGroupKey == "LEARNING_OUTCOME");

        if (outcome == null)
            return NotFound();

        outcome.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Get learning outcomes by subject
    /// </summary>
    [HttpGet("subject/{subjectId}")]
    public async Task<ActionResult> GetBySubject(Guid subjectId)
    {
        var outcomes = await _context.Definitions
            .Where(d => d.DefinitionGroupKey == "LEARNING_OUTCOME" && d.IsActive)
            .ToListAsync();

        var filtered = outcomes.Where(o =>
        {
            if (string.IsNullOrEmpty(o.Metadata)) return false;

            var metadata = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(o.Metadata);
            if (metadata.TryGetProperty("subjectId", out var subjId))
            {
                return subjId.GetString() == subjectId.ToString();
            }
            return false;
        }).Select(o => new
        {
            o.Id,
            o.Code,
            o.Name,
            o.Description,
            o.DisplayOrder
        }).ToList();

        return Ok(filtered);
    }

    /// <summary>
    /// Link learning outcome to question
    /// </summary>
    [HttpPost("{id}/link-question")]
    public async Task<ActionResult> LinkToQuestion(Guid id, [FromBody] LinkQuestionRequest request)
    {
        // In real implementation, this would call Questions service or use event bus
        // For now, just confirm the learning outcome exists

        var outcome = await _context.Definitions
            .FirstOrDefaultAsync(d => d.Id == id && d.DefinitionGroupKey == "LEARNING_OUTCOME");

        if (outcome == null)
            return NotFound();

        return Ok(new
        {
            message = "Learning outcome linked to question",
            learningOutcomeId = id,
            questionId = request.QuestionId
        });
    }

    /// <summary>
    /// Get statistics for learning outcome
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<ActionResult> GetStatistics(Guid id)
    {
        var outcome = await _context.Definitions
            .FirstOrDefaultAsync(d => d.Id == id && d.DefinitionGroupKey == "LEARNING_OUTCOME");

        if (outcome == null)
            return NotFound();

        // In real implementation, aggregate from Questions/Exams/Grading services
        var stats = new
        {
            learningOutcomeId = id,
            totalQuestions = 0, // Would query Questions service
            totalExams = 0,     // Would query Exams service
            averageScore = 0.0, // Would query Grading service
            masteryRate = 0.0   // Calculated from student performance
        };

        return Ok(stats);
    }
}

public record CreateLearningOutcomeRequest(
    string Code,
    string Name,
    string? Description,
    Guid SubjectId,
    Guid? TopicId,
    Guid? SubtopicId,
    string? GradeLevel,
    string? BloomLevel,
    int? EstimatedDuration,
    string[]? Keywords,
    int? DisplayOrder
);

public record UpdateLearningOutcomeRequest(
    string? Name,
    string? Description,
    Guid? SubjectId,
    Guid? TopicId,
    Guid? SubtopicId,
    string? GradeLevel,
    string? BloomLevel,
    int? EstimatedDuration,
    string[]? Keywords,
    int? DisplayOrder
);

public record LinkQuestionRequest(Guid QuestionId);
