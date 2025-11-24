using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LearningOutcomesController : ControllerBase
{
    private readonly CurriculumDbContext _context;
    private readonly ILogger<LearningOutcomesController> _logger;

    public LearningOutcomesController(CurriculumDbContext context, ILogger<LearningOutcomesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<LearningOutcomeDto>>>> GetAll(
        [FromQuery] Guid? curriculumId,
        [FromQuery] Guid? subjectId,
        [FromQuery] Guid? topicId)
    {
        var query = _context.LearningOutcomes
            .Include(lo => lo.Curriculum)
            .Include(lo => lo.Subject)
            .Include(lo => lo.Topic)
            .Where(lo => lo.DeletedAt == null);

        if (curriculumId.HasValue)
            query = query.Where(lo => lo.CurriculumId == curriculumId);

        if (subjectId.HasValue)
            query = query.Where(lo => lo.SubjectId == subjectId);

        if (topicId.HasValue)
            query = query.Where(lo => lo.TopicId == topicId);

        var outcomes = await query
            .OrderBy(lo => lo.Code)
            .ToListAsync();

        var dtos = outcomes.Select(lo => new LearningOutcomeDto
        {
            Id = lo.Id,
            CurriculumId = lo.CurriculumId,
            CurriculumName = lo.Curriculum.Name,
            SubjectId = lo.SubjectId,
            SubjectName = lo.Subject.Name,
            TopicId = lo.TopicId,
            TopicName = lo.Topic?.Name,
            Code = lo.Code,
            Description = lo.Description,
            Details = lo.Details
        }).ToList();

        return Ok(ApiResponse<List<LearningOutcomeDto>>.SuccessResult(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<LearningOutcomeDto>>> GetById(Guid id)
    {
        var outcome = await _context.LearningOutcomes
            .Include(lo => lo.Curriculum)
            .Include(lo => lo.Subject)
            .Include(lo => lo.Topic)
            .FirstOrDefaultAsync(lo => lo.Id == id && lo.DeletedAt == null);

        if (outcome == null)
            return NotFound(ApiResponse<LearningOutcomeDto>.ErrorResult("Learning outcome not found"));

        var dto = new LearningOutcomeDto
        {
            Id = outcome.Id,
            CurriculumId = outcome.CurriculumId,
            CurriculumName = outcome.Curriculum.Name,
            SubjectId = outcome.SubjectId,
            SubjectName = outcome.Subject.Name,
            TopicId = outcome.TopicId,
            TopicName = outcome.Topic?.Name,
            Code = outcome.Code,
            Description = outcome.Description,
            Details = outcome.Details
        };

        return Ok(ApiResponse<LearningOutcomeDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<LearningOutcomeDto>>> Create([FromBody] CreateLearningOutcomeRequest request)
    {
        // Validate curriculum
        var curriculum = await _context.Curricula.FindAsync(request.CurriculumId);
        if (curriculum == null)
            return BadRequest(ApiResponse<LearningOutcomeDto>.ErrorResult("Curriculum not found"));

        // Validate subject
        var subject = await _context.Subjects.FindAsync(request.SubjectId);
        if (subject == null)
            return BadRequest(ApiResponse<LearningOutcomeDto>.ErrorResult("Subject not found"));

        // Validate topic if provided
        if (request.TopicId.HasValue)
        {
            var topic = await _context.Topics.FindAsync(request.TopicId);
            if (topic == null)
                return BadRequest(ApiResponse<LearningOutcomeDto>.ErrorResult("Topic not found"));
        }

        // Check for duplicate code
        var exists = await _context.LearningOutcomes
            .AnyAsync(lo => lo.Code == request.Code && lo.DeletedAt == null);

        if (exists)
            return BadRequest(ApiResponse<LearningOutcomeDto>.ErrorResult("Learning outcome with this code already exists"));

        var outcome = new LearningOutcome
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // System level
            CurriculumId = request.CurriculumId,
            SubjectId = request.SubjectId,
            TopicId = request.TopicId,
            Code = request.Code,
            Description = request.Description,
            Details = request.Details,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Version = 1,
            IsActive = true
        };

        _context.LearningOutcomes.Add(outcome);
        await _context.SaveChangesAsync();

        // Reload with includes
        outcome = await _context.LearningOutcomes
            .Include(lo => lo.Curriculum)
            .Include(lo => lo.Subject)
            .Include(lo => lo.Topic)
            .FirstAsync(lo => lo.Id == outcome.Id);

        var dto = new LearningOutcomeDto
        {
            Id = outcome.Id,
            CurriculumId = outcome.CurriculumId,
            CurriculumName = outcome.Curriculum.Name,
            SubjectId = outcome.SubjectId,
            SubjectName = outcome.Subject.Name,
            TopicId = outcome.TopicId,
            TopicName = outcome.Topic?.Name,
            Code = outcome.Code,
            Description = outcome.Description,
            Details = outcome.Details
        };

        return CreatedAtAction(nameof(GetById), new { id = outcome.Id }, ApiResponse<LearningOutcomeDto>.SuccessResult(dto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<LearningOutcomeDto>>> Update(Guid id, [FromBody] UpdateLearningOutcomeRequest request)
    {
        var outcome = await _context.LearningOutcomes
            .Include(lo => lo.Curriculum)
            .Include(lo => lo.Subject)
            .Include(lo => lo.Topic)
            .FirstOrDefaultAsync(lo => lo.Id == id && lo.DeletedAt == null);

        if (outcome == null)
            return NotFound(ApiResponse<LearningOutcomeDto>.ErrorResult("Learning outcome not found"));

        outcome.Description = request.Description;
        outcome.Details = request.Details;
        outcome.UpdatedAt = DateTime.UtcNow;
        outcome.Version++;

        await _context.SaveChangesAsync();

        var dto = new LearningOutcomeDto
        {
            Id = outcome.Id,
            CurriculumId = outcome.CurriculumId,
            CurriculumName = outcome.Curriculum.Name,
            SubjectId = outcome.SubjectId,
            SubjectName = outcome.Subject.Name,
            TopicId = outcome.TopicId,
            TopicName = outcome.Topic?.Name,
            Code = outcome.Code,
            Description = outcome.Description,
            Details = outcome.Details
        };

        return Ok(ApiResponse<LearningOutcomeDto>.SuccessResult(dto));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var outcome = await _context.LearningOutcomes
            .FirstOrDefaultAsync(lo => lo.Id == id && lo.DeletedAt == null);

        if (outcome == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Learning outcome not found"));

        // Soft delete
        outcome.DeletedAt = DateTime.UtcNow;
        outcome.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }

    /// <summary>
    /// Get learning outcomes grouped by topic
    /// </summary>
    [HttpGet("by-topic")]
    public async Task<ActionResult<ApiResponse<List<TopicWithOutcomesDto>>>> GetGroupedByTopic(
        [FromQuery] Guid? subjectId)
    {
        var query = _context.Topics
            .Include(t => t.LearningOutcomes.Where(lo => lo.DeletedAt == null))
            .Where(t => t.DeletedAt == null);

        if (subjectId.HasValue)
            query = query.Where(t => t.SubjectId == subjectId);

        var topics = await query.ToListAsync();

        var dtos = topics.Select(t => new TopicWithOutcomesDto
        {
            TopicId = t.Id,
            TopicName = t.Name,
            TopicCode = t.Code,
            LearningOutcomes = t.LearningOutcomes.Select(lo => new LearningOutcomeDto
            {
                Id = lo.Id,
                Code = lo.Code,
                Description = lo.Description,
                Details = lo.Details
            }).ToList()
        }).ToList();

        return Ok(ApiResponse<List<TopicWithOutcomesDto>>.SuccessResult(dtos));
    }
}

// DTOs
public class LearningOutcomeDto
{
    public Guid Id { get; set; }
    public Guid? CurriculumId { get; set; }
    public string? CurriculumName { get; set; }
    public Guid? SubjectId { get; set; }
    public string? SubjectName { get; set; }
    public Guid? TopicId { get; set; }
    public string? TopicName { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Details { get; set; }
}

public class CreateLearningOutcomeRequest
{
    public Guid CurriculumId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? TopicId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Details { get; set; }
}

public class UpdateLearningOutcomeRequest
{
    public string Description { get; set; } = string.Empty;
    public string? Details { get; set; }
}

public class TopicWithOutcomesDto
{
    public Guid TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public string TopicCode { get; set; } = string.Empty;
    public List<LearningOutcomeDto> LearningOutcomes { get; set; } = new();
}

