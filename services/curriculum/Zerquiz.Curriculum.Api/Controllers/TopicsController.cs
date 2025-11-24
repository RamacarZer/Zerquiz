using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Application.DTOs;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public TopicsController(CurriculumDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all topics (with hierarchy) for a subject
    /// </summary>
    [HttpGet("subject/{subjectId}")]
    public async Task<ActionResult<ApiResponse<List<TopicDto>>>> GetBySubject(Guid subjectId)
    {
        var topics = await _context.Topics
            .Where(t => t.SubjectId == subjectId && t.ParentTopicId == null && t.DeletedAt == null)
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new TopicDto
            {
                Id = t.Id,
                SubjectId = t.SubjectId,
                ParentTopicId = t.ParentTopicId,
                Code = t.Code,
                Name = t.Name,
                Level = t.Level,
                DisplayOrder = t.DisplayOrder,
                SubTopics = t.SubTopics
                    .Where(st => st.DeletedAt == null)
                    .Select(st => new TopicDto
                    {
                        Id = st.Id,
                        SubjectId = st.SubjectId,
                        ParentTopicId = st.ParentTopicId,
                        Code = st.Code,
                        Name = st.Name,
                        Level = st.Level,
                        DisplayOrder = st.DisplayOrder
                    }).ToList()
            })
            .ToListAsync();

        return Ok(ApiResponse<List<TopicDto>>.SuccessResult(topics));
    }

    /// <summary>
    /// Get all topics flat list
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TopicDto>>>> GetAll([FromQuery] Guid? subjectId)
    {
        var query = _context.Topics.Where(t => t.DeletedAt == null);

        if (subjectId.HasValue)
            query = query.Where(t => t.SubjectId == subjectId);

        var topics = await query
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        var dtos = topics.Select(t => new TopicDto
        {
            Id = t.Id,
            SubjectId = t.SubjectId,
            ParentTopicId = t.ParentTopicId,
            Code = t.Code,
            Name = t.Name,
            Level = t.Level,
            DisplayOrder = t.DisplayOrder
        }).ToList();

        return Ok(ApiResponse<List<TopicDto>>.SuccessResult(dtos));
    }

    /// <summary>
    /// Get topic by ID with breadcrumb
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TopicDetailDto>>> GetById(Guid id)
    {
        var topic = await _context.Topics
            .Include(t => t.ParentTopic)
            .Include(t => t.Subject)
            .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

        if (topic == null)
            return NotFound(ApiResponse<TopicDetailDto>.ErrorResult("Topic not found"));

        // Build breadcrumb
        var breadcrumb = new List<BreadcrumbItem>();
        var current = topic;
        while (current != null)
        {
            breadcrumb.Insert(0, new BreadcrumbItem
            {
                Id = current.Id,
                Name = current.Name,
                Code = current.Code
            });

            if (current.ParentTopicId.HasValue)
                current = await _context.Topics.FindAsync(current.ParentTopicId);
            else
                current = null;
        }

        var dto = new TopicDetailDto
        {
            Id = topic.Id,
            SubjectId = topic.SubjectId,
            SubjectName = topic.Subject.Name,
            ParentTopicId = topic.ParentTopicId,
            ParentTopicName = topic.ParentTopic?.Name,
            Code = topic.Code,
            Name = topic.Name,
            Level = topic.Level,
            DisplayOrder = topic.DisplayOrder,
            Breadcrumb = breadcrumb
        };

        return Ok(ApiResponse<TopicDetailDto>.SuccessResult(dto));
    }

    /// <summary>
    /// Get children of a topic
    /// </summary>
    [HttpGet("{id}/children")]
    public async Task<ActionResult<ApiResponse<List<TopicDto>>>> GetChildren(Guid id)
    {
        var children = await _context.Topics
            .Where(t => t.ParentTopicId == id && t.DeletedAt == null)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        var dtos = children.Select(t => new TopicDto
        {
            Id = t.Id,
            SubjectId = t.SubjectId,
            ParentTopicId = t.ParentTopicId,
            Code = t.Code,
            Name = t.Name,
            Level = t.Level,
            DisplayOrder = t.DisplayOrder
        }).ToList();

        return Ok(ApiResponse<List<TopicDto>>.SuccessResult(dtos));
    }

    /// <summary>
    /// Create a new topic
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TopicDto>>> Create([FromBody] CreateTopicRequest request)
    {
        // Validate subject
        var subject = await _context.Subjects.FindAsync(request.SubjectId);
        if (subject == null)
            return BadRequest(ApiResponse<TopicDto>.ErrorResult("Subject not found"));

        // Validate parent topic if provided
        if (request.ParentTopicId.HasValue)
        {
            var parentTopic = await _context.Topics.FindAsync(request.ParentTopicId);
            if (parentTopic == null)
                return BadRequest(ApiResponse<TopicDto>.ErrorResult("Parent topic not found"));
        }

        var topic = new Domain.Entities.Topic
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            SubjectId = request.SubjectId,
            ParentTopicId = request.ParentTopicId,
            Code = request.Code,
            Name = request.Name,
            Level = request.Level,
            DisplayOrder = request.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Version = 1,
            IsActive = true
        };

        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();

        var dto = new TopicDto
        {
            Id = topic.Id,
            SubjectId = topic.SubjectId,
            ParentTopicId = topic.ParentTopicId,
            Code = topic.Code,
            Name = topic.Name,
            Level = topic.Level,
            DisplayOrder = topic.DisplayOrder
        };

        return CreatedAtAction(nameof(GetById), new { id = topic.Id }, ApiResponse<TopicDto>.SuccessResult(dto));
    }

    /// <summary>
    /// Update a topic
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TopicDto>>> Update(Guid id, [FromBody] UpdateTopicRequest request)
    {
        var topic = await _context.Topics
            .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

        if (topic == null)
            return NotFound(ApiResponse<TopicDto>.ErrorResult("Topic not found"));

        topic.Name = request.Name;
        topic.DisplayOrder = request.DisplayOrder;
        topic.UpdatedAt = DateTime.UtcNow;
        topic.Version++;

        await _context.SaveChangesAsync();

        var dto = new TopicDto
        {
            Id = topic.Id,
            SubjectId = topic.SubjectId,
            ParentTopicId = topic.ParentTopicId,
            Code = topic.Code,
            Name = topic.Name,
            Level = topic.Level,
            DisplayOrder = topic.DisplayOrder
        };

        return Ok(ApiResponse<TopicDto>.SuccessResult(dto));
    }

    /// <summary>
    /// Delete a topic (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        var topic = await _context.Topics
            .Include(t => t.SubTopics)
            .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

        if (topic == null)
            return NotFound(ApiResponse<bool>.ErrorResult("Topic not found"));

        // Check if it has children
        if (topic.SubTopics.Any(st => st.DeletedAt == null))
            return BadRequest(ApiResponse<bool>.ErrorResult("Cannot delete topic with active sub-topics"));

        // Soft delete
        topic.DeletedAt = DateTime.UtcNow;
        topic.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.SuccessResult(true));
    }
}

// Additional DTOs
public class TopicDetailDto
{
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public Guid? ParentTopicId { get; set; }
    public string? ParentTopicName { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
    public List<BreadcrumbItem> Breadcrumb { get; set; } = new();
}

public class BreadcrumbItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class CreateTopicRequest
{
    public Guid SubjectId { get; set; }
    public Guid? ParentTopicId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; } = 1;
    public int DisplayOrder { get; set; }
}

public class UpdateTopicRequest
{
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

