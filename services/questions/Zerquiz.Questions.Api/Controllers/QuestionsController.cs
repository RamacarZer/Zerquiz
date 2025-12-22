using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Zerquiz.Questions.Application.DTOs;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Questions.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Questions.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuestionsDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<QuestionsController> _logger;

    public QuestionsController(
        QuestionsDbContext context,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<QuestionsController> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<QuestionDto>>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] Guid? subjectId = null)
    {
        var query = _context.Questions.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(q => q.QuestionStatus == status);

        if (subjectId.HasValue)
            query = query.Where(q => q.SubjectId == subjectId.Value);

        var totalCount = await query.CountAsync();

        var questions = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new QuestionDto
            {
                Id = q.Id,
                Code = q.Code,
                FormatType = q.FormatType.Name,
                Difficulty = q.Difficulty,
                Status = q.QuestionStatus,
                CreatedAt = q.CreatedAt
            })
            .ToListAsync();

        var result = new PagedResult<QuestionDto>
        {
            Items = questions,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        return Ok(ApiResponse<PagedResult<QuestionDto>>.SuccessResult(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<QuestionDetailDto>>> GetById(Guid id)
    {
        var question = await _context.Questions
            .Include(q => q.Versions)
            .Include(q => q.Solutions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            return NotFound(ApiResponse<QuestionDetailDto>.ErrorResult("Soru bulunamadı"));

        var currentVersion = question.Versions.FirstOrDefault(v => v.Id == question.CurrentVersionId);

        var dto = new QuestionDetailDto
        {
            Id = question.Id,
            Code = question.Code,
            FormatTypeId = question.FormatTypeId,
            PedagogicalTypeId = question.PedagogicalTypeId,
            SubjectId = question.SubjectId,
            TopicId = question.TopicId,
            Difficulty = question.Difficulty,
            Weight = question.Weight,
            Status = question.QuestionStatus,
            CurrentVersion = currentVersion != null ? new QuestionVersionDto
            {
                Id = currentVersion.Id,
                VersionNumber = currentVersion.VersionNumber,
                Content = currentVersion.Content,
                CreatedAt = currentVersion.CreatedAt
            } : null,
            Solutions = question.Solutions.Select(s => new QuestionSolutionDto
            {
                Id = s.Id,
                SolutionType = s.SolutionType,
                Title = s.Title,
                TextContent = s.TextContent,
                MediaUrl = s.MediaUrl,
                DisplayOrder = s.DisplayOrder
            }).ToList()
        };

        return Ok(ApiResponse<QuestionDetailDto>.SuccessResult(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<QuestionDto>>> Create([FromBody] CreateQuestionRequest request)
    {
        var question = new Question
        {
            Code = $"Q-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            FormatTypeId = request.FormatTypeId,
            PedagogicalTypeId = request.PedagogicalTypeId,
            SubjectId = request.SubjectId,
            TopicId = request.TopicId,
            Difficulty = request.Difficulty,
            Weight = request.Weight,
            QuestionStatus = "draft",
            TenantId = Guid.NewGuid(), // TODO: Get from context
            CreatedAt = DateTime.UtcNow,
            CreatedBy = null // TODO: Get from current user (system user)
        };

        var version = new QuestionVersion
        {
            QuestionId = question.Id,
            TenantId = question.TenantId ?? Guid.Empty, // Handle nullable TenantId
            VersionNumber = 1,
            Content = request.Content,
            CreatedBy = question.CreatedBy, // Now both are Guid?
            CreatedAt = DateTime.UtcNow
        };

        question.CurrentVersionId = version.Id;

        _context.Questions.Add(question);
        _context.QuestionVersions.Add(version);
        await _context.SaveChangesAsync();

        var dto = new QuestionDto
        {
            Id = question.Id,
            Code = question.Code,
            Difficulty = question.Difficulty,
            Status = question.QuestionStatus,
            CreatedAt = question.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = question.Id }, 
            ApiResponse<QuestionDto>.SuccessResult(dto, "Soru başarıyla oluşturuldu"));
    }

    [HttpGet("formats")]
    public async Task<ActionResult<List<QuestionFormatType>>> GetFormatTypes()
    {
        var formatTypes = await _context.QuestionFormatTypes
            .Where(f => f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync();
        
        return Ok(formatTypes);
    }

    [HttpGet("pedagogical-types")]
    public async Task<ActionResult<List<QuestionPedagogicalType>>> GetPedagogicalTypes()
    {
        var pedagogicalTypes = await _context.QuestionPedagogicalTypes
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
        
        return Ok(pedagogicalTypes);
    }

    [HttpGet("difficulty-levels")]
    public async Task<ActionResult<List<QuestionDifficultyLevel>>> GetDifficultyLevels()
    {
        var difficultyLevels = await _context.QuestionDifficultyLevels
            .Where(d => d.IsActive)
            .OrderBy(d => d.Level)
            .ToListAsync();
        
        return Ok(difficultyLevels);
    }

    [HttpGet("presentation-types")]
    public async Task<ActionResult<List<QuestionPresentationType>>> GetPresentationTypes()
    {
        var presentationTypes = await _context.QuestionPresentationTypes
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
        
        return Ok(presentationTypes);
    }

    /// <summary>
    /// AI ile soru üret (Content Service'ten content kullanarak)
    /// POST /api/Questions/generate-from-ai
    /// </summary>
    [HttpPost("generate-from-ai")]
    public async Task<ActionResult> GenerateFromAI([FromBody] AIQuestionGenerationRequest request)
    {
        try
        {
            var contentServiceUrl = _configuration["Services:ContentService"] ?? "http://localhost:5008";
            var client = _httpClientFactory.CreateClient();

            // Content Service'e AI generation isteği gönder
            var requestBody = new
            {
                contentItemId = request.ContentItemId,
                questionTypes = request.QuestionTypes,
                difficulty = request.Difficulty,
                count = request.Count,
                language = request.Language
            };

            var response = await client.PostAsJsonAsync(
                $"{contentServiceUrl}/api/AIGeneration/generate/quiz",
                requestBody);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to generate questions from AI. Status: {Status}", response.StatusCode);
                return StatusCode((int)response.StatusCode, "AI generation failed");
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(content);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating questions from AI");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Toplu soru import et (CSV, JSON, Excel)
    /// POST /api/Questions/bulk-import
    /// </summary>
    [HttpPost("bulk-import")]
    public async Task<ActionResult> BulkImport([FromBody] BulkImportRequest request)
    {
        try
        {
            var imported = 0;
            var failed = 0;
            var errors = new List<string>();

            foreach (var item in request.Questions)
            {
                try
                {
                    var question = new Question
                    {
                        Code = item.Code ?? $"Q-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                        FormatTypeId = item.FormatTypeId,
                        PedagogicalTypeId = item.PedagogicalTypeId,
                        SubjectId = item.SubjectId,
                        TopicId = item.TopicId,
                        Difficulty = item.Difficulty ?? "medium",
                        Weight = item.Weight ?? 1.0m,
                        QuestionStatus = "draft",
                        TenantId = request.TenantId,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = request.CreatedBy
                    };

                    var version = new QuestionVersion
                    {
                        QuestionId = question.Id,
                        TenantId = question.TenantId ?? Guid.Empty,
                        VersionNumber = 1,
                        Content = item.Content,
                        CreatedBy = question.CreatedBy,
                        CreatedAt = DateTime.UtcNow
                    };

                    question.CurrentVersionId = version.Id;

                    _context.Questions.Add(question);
                    _context.QuestionVersions.Add(version);
                    imported++;
                }
                catch (Exception ex)
                {
                    failed++;
                    errors.Add($"Row {imported + failed}: {ex.Message}");
                    _logger.LogWarning(ex, "Failed to import question at row {Row}", imported + failed);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                imported,
                failed,
                errors = errors.Take(10).ToList(), // İlk 10 hata
                message = $"{imported} soru başarıyla içe aktarıldı, {failed} başarısız oldu."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk import");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Dynamic answer fields güncelle (JSONB storage)
    /// PUT /api/Questions/{id}/update-answer-fields
    /// </summary>
    [HttpPut("{id}/update-answer-fields")]
    public async Task<ActionResult> UpdateAnswerFields(Guid id, [FromBody] UpdateAnswerFieldsRequest request)
    {
        try
        {
            var question = await _context.Questions
                .Include(q => q.Versions)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return NotFound(new { error = "Question not found" });

            var currentVersion = question.Versions.FirstOrDefault(v => v.Id == question.CurrentVersionId);
            if (currentVersion == null)
                return NotFound(new { error = "Current version not found" });

            // Parse existing content
            var content = JsonSerializer.Deserialize<Dictionary<string, object>>(currentVersion.Content);
            if (content == null)
                content = new Dictionary<string, object>();

            // Update answer fields
            content["answerFields"] = request.AnswerFields;

            // Serialize back
            currentVersion.Content = JsonSerializer.Serialize(content);
            currentVersion.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Answer fields updated successfully",
                questionId = id,
                versionId = currentVersion.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating answer fields for question {QuestionId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Gelişmiş filtreleme ve arama
    /// GET /api/Questions/search
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult> Search(
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? difficulty = null,
        [FromQuery] Guid? subjectId = null,
        [FromQuery] Guid? topicId = null,
        [FromQuery] Guid? formatTypeId = null,
        [FromQuery] string? status = null,
        [FromQuery] List<string>? tags = null,
        [FromQuery] DateTime? createdAfter = null,
        [FromQuery] DateTime? createdBefore = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string sortBy = "createdAt",
        [FromQuery] string sortOrder = "desc")
    {
        try
        {
            var query = _context.Questions
                .Include(q => q.FormatType)
                .Include(q => q.Versions)
                .AsQueryable();

            // Full-text search (PostgreSQL FTS)
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(q =>
                    q.Code.Contains(searchTerm) ||
                    q.Versions.Any(v => v.Content.Contains(searchTerm)));
            }

            // Filters
            if (!string.IsNullOrEmpty(difficulty))
                query = query.Where(q => q.Difficulty == difficulty);

            if (subjectId.HasValue)
                query = query.Where(q => q.SubjectId == subjectId.Value);

            if (topicId.HasValue)
                query = query.Where(q => q.TopicId == topicId.Value);

            if (formatTypeId.HasValue)
                query = query.Where(q => q.FormatTypeId == formatTypeId.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(q => q.QuestionStatus == status);

            if (createdAfter.HasValue)
                query = query.Where(q => q.CreatedAt >= createdAfter.Value);

            if (createdBefore.HasValue)
                query = query.Where(q => q.CreatedAt <= createdBefore.Value);

            var totalCount = await query.CountAsync();

            // Sorting
            query = sortBy.ToLower() switch
            {
                "code" => sortOrder == "asc" ? query.OrderBy(q => q.Code) : query.OrderByDescending(q => q.Code),
                "difficulty" => sortOrder == "asc" ? query.OrderBy(q => q.Difficulty) : query.OrderByDescending(q => q.Difficulty),
                "weight" => sortOrder == "asc" ? query.OrderBy(q => q.Weight) : query.OrderByDescending(q => q.Weight),
                _ => sortOrder == "asc" ? query.OrderBy(q => q.CreatedAt) : query.OrderByDescending(q => q.CreatedAt)
            };

            // Pagination
            var questions = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(q => new
                {
                    q.Id,
                    q.Code,
                    formatType = q.FormatType.Name,
                    q.Difficulty,
                    q.Weight,
                    status = q.QuestionStatus,
                    q.SubjectId,
                    q.TopicId,
                    q.CreatedAt,
                    q.PublishedAt,
                    versionCount = q.Versions.Count
                })
                .ToListAsync();

            return Ok(new
            {
                items = questions,
                totalCount,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching questions");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }
}

// Request DTOs
public class AIQuestionGenerationRequest
{
    public Guid ContentItemId { get; set; }
    public List<string> QuestionTypes { get; set; } = new();
    public string Difficulty { get; set; } = "medium";
    public int Count { get; set; } = 10;
    public string Language { get; set; } = "tr";
}

public class BulkImportRequest
{
    public Guid TenantId { get; set; }
    public Guid? CreatedBy { get; set; }
    public List<BulkImportQuestionItem> Questions { get; set; } = new();
}

public class BulkImportQuestionItem
{
    public string? Code { get; set; }
    public Guid FormatTypeId { get; set; }
    public Guid? PedagogicalTypeId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? TopicId { get; set; }
    public string? Difficulty { get; set; }
    public decimal? Weight { get; set; }
    public string Content { get; set; } = "{}";
}

public class UpdateAnswerFieldsRequest
{
    public Dictionary<string, object> AnswerFields { get; set; } = new();
}


