using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Zerquiz.Questions.Infrastructure.Persistence;

namespace Zerquiz.Questions.Api.Controllers;

/// <summary>
/// Question Pool Management - Soru havuzu yönetimi
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuestionPoolsController : ControllerBase
{
    private readonly QuestionsDbContext _context;
    private readonly ILogger<QuestionPoolsController> _logger;

    public QuestionPoolsController(
        QuestionsDbContext context,
        ILogger<QuestionPoolsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Tüm havuzları listele
    /// GET /api/QuestionPools/list
    /// </summary>
    [HttpGet("list")]
    public async Task<ActionResult> GetAll(
        [FromQuery] Guid? tenantId = null,
        [FromQuery] string? status = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            // Mock data for now - gerçek entity oluşturulduğunda değiştirilecek
            var pools = new List<object>
            {
                new
                {
                    id = Guid.NewGuid(),
                    name = "Matematik Soru Havuzu",
                    description = "9. sınıf matematik soruları",
                    questionCount = 150,
                    subjectId = Guid.NewGuid(),
                    difficulty = "mixed",
                    status = "active",
                    createdAt = DateTime.UtcNow.AddDays(-30)
                },
                new
                {
                    id = Guid.NewGuid(),
                    name = "Fen Bilimleri - Fizik",
                    description = "Hareket ve kuvvet ünitesi",
                    questionCount = 85,
                    subjectId = Guid.NewGuid(),
                    difficulty = "medium",
                    status = "active",
                    createdAt = DateTime.UtcNow.AddDays(-15)
                },
                new
                {
                    id = Guid.NewGuid(),
                    name = "İngilizce Grammar Pool",
                    description = "Present simple & continuous tenses",
                    questionCount = 120,
                    subjectId = Guid.NewGuid(),
                    difficulty = "easy",
                    status = "active",
                    createdAt = DateTime.UtcNow.AddDays(-7)
                }
            };

            var filtered = pools.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                filtered = filtered.Where(p => ((dynamic)p).status == status);
            }

            var totalCount = filtered.Count();
            var paged = filtered
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                items = paged,
                totalCount,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching question pools");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuz detayı getir
    /// GET /api/QuestionPools/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            // Mock data
            var pool = new
            {
                id,
                name = "Matematik Soru Havuzu",
                description = "9. sınıf matematik soruları - kapsamlı havuz",
                questionCount = 150,
                subjectId = Guid.NewGuid(),
                subjectName = "Matematik",
                difficulty = "mixed",
                status = "active",
                tags = new[] { "algebra", "geometri", "trigonometri" },
                criteria = new
                {
                    minDifficulty = "easy",
                    maxDifficulty = "hard",
                    questionTypes = new[] { "multiple_choice_single", "numeric_input", "short_answer" },
                    topics = new[] { "Denklemler", "Fonksiyonlar", "Geometrik Şekiller" }
                },
                statistics = new
                {
                    totalQuestions = 150,
                    easy = 45,
                    medium = 75,
                    hard = 30,
                    byType = new Dictionary<string, int>
                    {
                        ["multiple_choice_single"] = 90,
                        ["numeric_input"] = 35,
                        ["short_answer"] = 25
                    }
                },
                createdAt = DateTime.UtcNow.AddDays(-30),
                updatedAt = DateTime.UtcNow.AddDays(-2)
            };

            return Ok(pool);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Yeni havuz oluştur
    /// POST /api/QuestionPools/create
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult> Create([FromBody] CreatePoolRequest request)
    {
        try
        {
            // TODO: Gerçek entity oluşturulduğunda implement edilecek
            var poolId = Guid.NewGuid();

            _logger.LogInformation("Created question pool {PoolId} with name {Name}", poolId, request.Name);

            return CreatedAtAction(nameof(GetById), new { id = poolId }, new
            {
                id = poolId,
                name = request.Name,
                description = request.Description,
                status = "active",
                message = "Pool created successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating question pool");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuz güncelle
    /// PUT /api/QuestionPools/{id}
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdatePoolRequest request)
    {
        try
        {
            // TODO: Implement
            _logger.LogInformation("Updated question pool {PoolId}", id);

            return Ok(new
            {
                id,
                message = "Pool updated successfully",
                updatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuzdan soru seç (weighted random)
    /// POST /api/QuestionPools/{id}/select-questions
    /// </summary>
    [HttpPost("{id}/select-questions")]
    public async Task<ActionResult> SelectQuestions(Guid id, [FromBody] SelectQuestionsRequest request)
    {
        try
        {
            // Havuzdan soru seçimi algoritması
            var questions = await _context.Questions
                .Where(q => q.QuestionStatus == "published")
                .Where(q => request.Difficulties == null || request.Difficulties.Contains(q.Difficulty))
                .OrderBy(_ => Guid.NewGuid()) // Random
                .Take(request.Count)
                .Select(q => new
                {
                    q.Id,
                    q.Code,
                    q.Difficulty,
                    q.Weight,
                    formatType = q.FormatType.Name
                })
                .ToListAsync();

            return Ok(new
            {
                poolId = id,
                selectedCount = questions.Count,
                requestedCount = request.Count,
                questions,
                selectionStrategy = request.Strategy ?? "random"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error selecting questions from pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// A/B/C/D kitapçık üret
    /// POST /api/QuestionPools/{id}/generate-booklets
    /// </summary>
    [HttpPost("{id}/generate-booklets")]
    public async Task<ActionResult> GenerateBooklets(Guid id, [FromBody] GenerateBookletsRequest request)
    {
        try
        {
            var booklets = new List<object>();
            var bookletCodes = new[] { "A", "B", "C", "D" };

            // Her kitapçık için sorular seç
            for (int i = 0; i < request.BookletCount; i++)
            {
                var questions = await _context.Questions
                    .Where(q => q.QuestionStatus == "published")
                    .OrderBy(_ => Guid.NewGuid())
                    .Take(request.QuestionCountPerBooklet)
                    .Select(q => new
                    {
                        q.Id,
                        q.Code,
                        order = i + 1 // Her kitapçıkta farklı sıralama
                    })
                    .ToListAsync();

                // Sıralamayı karıştır
                var shuffled = questions.OrderBy(_ => Guid.NewGuid()).ToList();

                booklets.Add(new
                {
                    bookletCode = bookletCodes[i % 4],
                    questionCount = shuffled.Count,
                    questionIds = shuffled.Select(q => q.Id).ToList(),
                    questionCodes = shuffled.Select(q => q.Code).ToList()
                });
            }

            return Ok(new
            {
                poolId = id,
                bookletCount = booklets.Count,
                questionsPerBooklet = request.QuestionCountPerBooklet,
                booklets,
                generatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating booklets from pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuza soru ekle
    /// POST /api/QuestionPools/{id}/add-questions
    /// </summary>
    [HttpPost("{id}/add-questions")]
    public async Task<ActionResult> AddQuestions(Guid id, [FromBody] AddQuestionsToPoolRequest request)
    {
        try
        {
            // TODO: Gerçek many-to-many ilişki kurulduğunda implement edilecek
            _logger.LogInformation("Added {Count} questions to pool {PoolId}", request.QuestionIds.Count, id);

            return Ok(new
            {
                poolId = id,
                addedCount = request.QuestionIds.Count,
                message = "Questions added to pool successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding questions to pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuzdan soru çıkar
    /// DELETE /api/QuestionPools/{id}/remove-questions
    /// </summary>
    [HttpDelete("{id}/remove-questions")]
    public async Task<ActionResult> RemoveQuestions(Guid id, [FromBody] RemoveQuestionsFromPoolRequest request)
    {
        try
        {
            // TODO: Implement
            _logger.LogInformation("Removed {Count} questions from pool {PoolId}", request.QuestionIds.Count, id);

            return Ok(new
            {
                poolId = id,
                removedCount = request.QuestionIds.Count,
                message = "Questions removed from pool successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing questions from pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Havuz istatistikleri
    /// GET /api/QuestionPools/{id}/statistics
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<ActionResult> GetStatistics(Guid id)
    {
        try
        {
            // Mock statistics
            var stats = new
            {
                poolId = id,
                totalQuestions = 150,
                byDifficulty = new Dictionary<string, int>
                {
                    ["easy"] = 45,
                    ["medium"] = 75,
                    ["hard"] = 30
                },
                byType = new Dictionary<string, int>
                {
                    ["multiple_choice_single"] = 90,
                    ["numeric_input"] = 35,
                    ["short_answer"] = 25
                },
                averageWeight = 1.5m,
                lastUpdated = DateTime.UtcNow.AddDays(-2),
                usageCount = 25, // Kaç sınavda kullanıldı
                lastUsedAt = DateTime.UtcNow.AddDays(-1)
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistics for pool {PoolId}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }
}

// Request DTOs
public class CreatePoolRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid SubjectId { get; set; }
    public List<Guid>? TopicIds { get; set; }
    public List<string>? QuestionTypes { get; set; }
    public string? Difficulty { get; set; }
    public List<string>? Tags { get; set; }
}

public class UpdatePoolRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public List<string>? Tags { get; set; }
}

public class SelectQuestionsRequest
{
    public int Count { get; set; } = 10;
    public List<string>? Difficulties { get; set; }
    public List<string>? QuestionTypes { get; set; }
    public string? Strategy { get; set; } = "random"; // random, weighted, sequential
}

public class GenerateBookletsRequest
{
    public int BookletCount { get; set; } = 4; // A, B, C, D
    public int QuestionCountPerBooklet { get; set; } = 20;
    public bool ShuffleQuestions { get; set; } = true;
    public bool ShuffleOptions { get; set; } = true;
}

public class AddQuestionsToPoolRequest
{
    public List<Guid> QuestionIds { get; set; } = new();
}

public class RemoveQuestionsFromPoolRequest
{
    public List<Guid> QuestionIds { get; set; } = new();
}

