using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Domain.Entities;
using Zerquiz.Royalty.Infrastructure.Persistence;

namespace Zerquiz.Royalty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoyaltyCalculationController : ControllerBase
{
    private readonly RoyaltyDbContext _context;

    public RoyaltyCalculationController(RoyaltyDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Calculate royalty for question usage
    /// </summary>
    [HttpPost("calculate-question-usage")]
    public async Task<ActionResult> CalculateQuestionUsage([FromBody] QuestionUsageRequest request)
    {
        // Find the work (question)
        var work = await _context.Works
            .Include(w => w.Authors)
            .FirstOrDefaultAsync(w => w.Id == request.QuestionId && w.Type == "question");

        if (work == null)
            return NotFound("Question work not found");

        // Revenue split configuration (could be from database in real implementation)
        var platformShare = 0.30m; // 30% platform
        var authorShare = 0.70m;   // 70% to authors

        var netRevenue = request.Amount * authorShare;

        // Create transactions for each author based on their share percentage
        var transactions = new List<RoyaltyTransaction>();

        // Primary author gets remaining percentage
        var totalCoAuthorShare = work.Authors.Sum(a => a.SharePercentage);
        var primaryAuthorShare = 100m - totalCoAuthorShare;

        if (primaryAuthorShare > 0)
        {
            transactions.Add(new RoyaltyTransaction
            {
                WorkId = work.Id,
                AuthorId = work.PrimaryAuthorId,
                Amount = netRevenue * (primaryAuthorShare / 100m),
                Currency = request.Currency,
                TransactionType = "question_usage",
                AccruedAt = DateTime.UtcNow,
                Metadata = System.Text.Json.JsonDocument.Parse($"{{\"examId\":\"{request.ExamId}\",\"sharePercentage\":{primaryAuthorShare}}}")
            });
        }

        // Co-authors
        foreach (var author in work.Authors)
        {
            transactions.Add(new RoyaltyTransaction
            {
                WorkId = work.Id,
                AuthorId = author.AuthorId,
                Amount = netRevenue * (author.SharePercentage / 100m),
                Currency = request.Currency,
                TransactionType = "question_usage",
                AccruedAt = DateTime.UtcNow,
                Metadata = System.Text.Json.JsonDocument.Parse($"{{\"examId\":\"{request.ExamId}\",\"sharePercentage\":{author.SharePercentage}}}")
            });
        }

        _context.RoyaltyTransactions.AddRange(transactions);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Royalty calculated and recorded",
            totalAmount = request.Amount,
            platformShare = request.Amount * platformShare,
            authorShare = netRevenue,
            transactions = transactions.Select(t => new
            {
                t.AuthorId,
                t.Amount,
                t.Currency
            }).ToList()
        });
    }

    /// <summary>
    /// Calculate review fee
    /// </summary>
    [HttpPost("calculate-review-fee")]
    public async Task<ActionResult> CalculateReviewFee([FromBody] ReviewFeeRequest request)
    {
        // Check if fee already exists
        var existing = await _context.ReviewFees
            .FirstOrDefaultAsync(f => f.QuestionReviewId == request.QuestionReviewId);

        if (existing != null)
            return BadRequest("Review fee already calculated");

        // Fee calculation logic (could be configurable)
        decimal feeAmount = request.ReviewType switch
        {
            "internal" => 50m,
            "committee_lead" => 100m,
            "final_approval" => 150m,
            _ => 75m
        };

        var reviewFee = new ReviewFee
        {
            QuestionReviewId = request.QuestionReviewId,
            ReviewerId = request.ReviewerId,
            Amount = feeAmount,
            Status = "pending"
        };

        _context.ReviewFees.Add(reviewFee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review fee calculated",
            reviewFeeId = reviewFee.Id,
            amount = feeAmount,
            currency = "TRY"
        });
    }

    /// <summary>
    /// Bulk calculate royalties for exam
    /// </summary>
    [HttpPost("calculate-exam-royalties")]
    public async Task<ActionResult> CalculateExamRoyalties([FromBody] ExamRoyaltyRequest request)
    {
        // In real implementation, this would integrate with Exams Service
        // to get all questions in the exam and calculate royalties for each

        var results = new List<object>();
        decimal totalRoyalty = 0;

        foreach (var questionId in request.QuestionIds)
        {
            var work = await _context.Works
                .Include(w => w.Authors)
                .FirstOrDefaultAsync(w => w.Id == questionId && w.Type == "question");

            if (work == null) continue;

            var authorShare = request.AmountPerQuestion * 0.70m;
            var primaryAuthorShare = 100m - work.Authors.Sum(a => a.SharePercentage);

            if (primaryAuthorShare > 0)
            {
                var amount = authorShare * (primaryAuthorShare / 100m);
                _context.RoyaltyTransactions.Add(new RoyaltyTransaction
                {
                    WorkId = work.Id,
                    AuthorId = work.PrimaryAuthorId,
                    Amount = amount,
                    Currency = request.Currency,
                    TransactionType = "exam_usage",
                    AccruedAt = DateTime.UtcNow,
                    Metadata = System.Text.Json.JsonDocument.Parse($"{{\"examId\":\"{request.ExamId}\"}}")
                });

                totalRoyalty += amount;
            }

            foreach (var author in work.Authors)
            {
                var amount = authorShare * (author.SharePercentage / 100m);
                _context.RoyaltyTransactions.Add(new RoyaltyTransaction
                {
                    WorkId = work.Id,
                    AuthorId = author.AuthorId,
                    Amount = amount,
                    Currency = request.Currency,
                    TransactionType = "exam_usage",
                    AccruedAt = DateTime.UtcNow,
                    Metadata = System.Text.Json.JsonDocument.Parse($"{{\"examId\":\"{request.ExamId}\"}}")
                });

                totalRoyalty += amount;
            }

            results.Add(new { questionId, calculated = true });
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            examId = request.ExamId,
            totalQuestions = request.QuestionIds.Count,
            totalRoyalty,
            currency = request.Currency,
            results
        });
    }

    /// <summary>
    /// Get royalty report for date range
    /// </summary>
    [HttpGet("report")]
    public async Task<ActionResult> GetReport(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate,
        [FromQuery] string? groupBy = "author")
    {
        var transactions = await _context.RoyaltyTransactions
            .Include(t => t.Work)
            .Where(t => t.AccruedAt >= fromDate && t.AccruedAt <= toDate)
            .ToListAsync();

        if (groupBy == "author")
        {
            var byAuthor = transactions
                .GroupBy(t => t.AuthorId)
                .Select(g => new
                {
                    authorId = g.Key,
                    totalAmount = g.Sum(t => t.Amount),
                    transactionCount = g.Count(),
                    byType = g.GroupBy(t => t.TransactionType)
                        .Select(tg => new { type = tg.Key, amount = tg.Sum(t => t.Amount) })
                        .ToList()
                })
                .OrderByDescending(x => x.totalAmount)
                .ToList();

            return Ok(byAuthor);
        }
        else if (groupBy == "work")
        {
            var byWork = transactions
                .GroupBy(t => t.WorkId)
                .Select(g => new
                {
                    workId = g.Key,
                    workTitle = g.First().Work.Title,
                    workType = g.First().Work.Type,
                    totalAmount = g.Sum(t => t.Amount),
                    transactionCount = g.Count()
                })
                .OrderByDescending(x => x.totalAmount)
                .ToList();

            return Ok(byWork);
        }
        else if (groupBy == "month")
        {
            var byMonth = transactions
                .GroupBy(t => new { t.AccruedAt.Year, t.AccruedAt.Month })
                .Select(g => new
                {
                    period = $"{g.Key.Year}-{g.Key.Month:D2}",
                    totalAmount = g.Sum(t => t.Amount),
                    transactionCount = g.Count()
                })
                .OrderByDescending(x => x.period)
                .ToList();

            return Ok(byMonth);
        }

        return Ok(transactions);
    }
}

public record QuestionUsageRequest(Guid QuestionId, Guid ExamId, decimal Amount, string Currency);
public record ReviewFeeRequest(Guid QuestionReviewId, Guid ReviewerId, string ReviewType);
public record ExamRoyaltyRequest(Guid ExamId, List<Guid> QuestionIds, decimal AmountPerQuestion, string Currency);

