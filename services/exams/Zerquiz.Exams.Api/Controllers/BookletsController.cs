using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Zerquiz.Exams.Domain.Entities;
using Zerquiz.Exams.Infrastructure.Persistence;

namespace Zerquiz.Exams.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookletsController : ControllerBase
{
    private readonly ExamsDbContext _context;

    public BookletsController(ExamsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all booklets for an exam
    /// </summary>
    [HttpGet("exam/{examId}")]
    public async Task<ActionResult> GetByExamId(Guid examId)
    {
        var booklets = await _context.Booklets
            .Where(b => b.ExamId == examId)
            .OrderBy(b => b.Type)
            .Select(b => new
            {
                b.Id,
                b.Type,
                b.Code,
                QuestionCount = b.Questions.Count,
                b.CreatedAt
            })
            .ToListAsync();

        return Ok(booklets);
    }

    /// <summary>
    /// Get booklet by ID (with questions)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var booklet = await _context.Booklets
            .Include(b => b.Questions.OrderBy(q => q.Order))
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booklet == null)
            return NotFound();

        return Ok(booklet);
    }

    /// <summary>
    /// Generate booklets for exam with shuffle
    /// </summary>
    [HttpPost("exam/{examId}/generate")]
    public async Task<ActionResult> GenerateBooklets(Guid examId, [FromBody] GenerateBookletsRequest request)
    {
        var exam = await _context.Exams
            .Include(e => e.Sections)
                .ThenInclude(s => s.Questions.OrderBy(q => q.Order))
            .FirstOrDefaultAsync(e => e.Id == examId);

        if (exam == null)
            return NotFound("Exam not found");

        // Delete existing booklets
        var existingBooklets = await _context.Booklets
            .Where(b => b.ExamId == examId)
            .ToListAsync();

        if (existingBooklets.Any())
        {
            _context.Booklets.RemoveRange(existingBooklets);
            await _context.SaveChangesAsync();
        }

        // Generate booklets (A, B, C, D or custom count)
        var bookletTypes = request.BookletTypes ?? new[] { "A", "B", "C", "D" };
        var booklets = new List<Booklet>();

        foreach (var bookletType in bookletTypes)
        {
            var booklet = new Booklet
            {
                ExamId = examId,
                Type = bookletType,
                Code = $"{exam.Code}-{bookletType}",
                Settings = JsonSerializer.Serialize(new
                {
                    shuffleQuestions = request.ShuffleQuestions,
                    shuffleOptions = request.ShuffleOptions,
                    shuffleSeed = GenerateShuffleSeed(bookletType)
                })
            };

            // Copy questions from exam sections
            var order = 1;
            foreach (var section in exam.Sections.OrderBy(s => s.Order))
            {
                var sectionQuestions = section.Questions.OrderBy(q => q.Order).ToList();

                // Shuffle questions if requested
                if (request.ShuffleQuestions)
                {
                    sectionQuestions = ShuffleList(sectionQuestions, GetSeedForBooklet(bookletType, order));
                }

                foreach (var examQuestion in sectionQuestions)
                {
                    var bookletQuestion = new BookletQuestion
                    {
                        BookletId = booklet.Id,
                        QuestionId = examQuestion.QuestionId,
                        SectionId = section.Id,
                        Order = order++,
                        Points = examQuestion.Points,
                        Settings = request.ShuffleOptions
                            ? JsonSerializer.Serialize(new
                            {
                                shuffleSeed = GetSeedForBooklet(bookletType, order),
                                shuffleOptions = true
                            })
                            : "{}"
                    };

                    booklet.Questions.Add(bookletQuestion);
                }
            }

            booklets.Add(booklet);
        }

        _context.Booklets.AddRange(booklets);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Booklets generated successfully",
            count = booklets.Count,
            booklets = booklets.Select(b => new
            {
                b.Id,
                b.Type,
                b.Code,
                QuestionCount = b.Questions.Count
            }).ToList()
        });
    }

    /// <summary>
    /// Get booklet with shuffled questions/options for student
    /// </summary>
    [HttpGet("{id}/shuffled")]
    public async Task<ActionResult> GetShuffled(Guid id)
    {
        var booklet = await _context.Booklets
            .Include(b => b.Exam)
            .Include(b => b.Questions.OrderBy(q => q.Order))
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booklet == null)
            return NotFound();

        var settings = JsonSerializer.Deserialize<BookletSettings>(booklet.Settings);

        var questions = booklet.Questions.Select(bq => new
        {
            bq.Id,
            bq.QuestionId,
            bq.Order,
            bq.Points,
            ShuffleSeed = GetQuestionShuffleSeed(bq)
        }).ToList();

        return Ok(new
        {
            booklet.Id,
            booklet.Type,
            booklet.Code,
            ExamName = booklet.Exam.Title,
            ShuffleQuestions = settings?.shuffleQuestions ?? false,
            ShuffleOptions = settings?.shuffleOptions ?? false,
            Questions = questions
        });
    }

    /// <summary>
    /// Clone booklet
    /// </summary>
    [HttpPost("{id}/clone")]
    public async Task<ActionResult> Clone(Guid id, [FromBody] CloneBookletRequest request)
    {
        var original = await _context.Booklets
            .Include(b => b.Questions)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (original == null)
            return NotFound();

        var cloned = new Booklet
        {
            ExamId = original.ExamId,
            Type = request.NewType ?? original.Type,
            Code = request.NewCode ?? $"{original.Code}-CLONE",
            Settings = original.Settings
        };

        foreach (var q in original.Questions)
        {
            cloned.Questions.Add(new BookletQuestion
            {
                QuestionId = q.QuestionId,
                SectionId = q.SectionId,
                Order = q.Order,
                Points = q.Points,
                Settings = q.Settings
            });
        }

        _context.Booklets.Add(cloned);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = cloned.Id }, cloned);
    }

    // Helper methods
    private static List<T> ShuffleList<T>(List<T> list, int seed)
    {
        var rng = new Random(seed);
        return list.OrderBy(x => rng.Next()).ToList();
    }

    private static int GenerateShuffleSeed(string bookletType)
    {
        return bookletType.GetHashCode() ^ DateTime.UtcNow.Ticks.GetHashCode();
    }

    private static int GetSeedForBooklet(string bookletType, int order)
    {
        return bookletType.GetHashCode() ^ order.GetHashCode();
    }

    private static int GetQuestionShuffleSeed(BookletQuestion bq)
    {
        if (string.IsNullOrEmpty(bq.Settings) || bq.Settings == "{}")
            return 0;

        try
        {
            var settings = JsonSerializer.Deserialize<QuestionShuffleSettings>(bq.Settings);
            return settings?.shuffleSeed ?? 0;
        }
        catch
        {
            return 0;
        }
    }
}

public record GenerateBookletsRequest(
    string[]? BookletTypes,
    bool ShuffleQuestions,
    bool ShuffleOptions
);

public record CloneBookletRequest(string? NewType, string? NewCode);

public record BookletSettings(bool shuffleQuestions, bool shuffleOptions, int shuffleSeed);
public record QuestionShuffleSettings(int shuffleSeed, bool shuffleOptions);

