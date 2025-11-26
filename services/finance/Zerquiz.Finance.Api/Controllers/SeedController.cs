using Microsoft.AspNetCore.Mvc;
using Zerquiz.Finance.Domain.Entities;
using Zerquiz.Finance.Infrastructure.Persistence;

namespace Zerquiz.Finance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public SeedController(FinanceDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Seed subscription plans
    /// </summary>
    [HttpPost("plans")]
    public async Task<IActionResult> SeedPlans()
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        var plans = new List<SubscriptionPlan>
        {
            new SubscriptionPlan
            {
                Code = "starter",
                Name = "Starter",
                Description = "Küçük eğitim kurumları için ideal başlangıç paketi",
                MonthlyPrice = 299m,
                YearlyPrice = 2990m,
                Currency = "TRY",
                MaxUsers = 50,
                MaxQuestions = 1000,
                MaxExams = 50,
                MaxStorageMB = 1024, // 1GB
                IsPublic = true,
                DisplayOrder = 1,
                TenantId = tenantId
            },
            new SubscriptionPlan
            {
                Code = "professional",
                Name = "Professional",
                Description = "Orta ölçekli kurumlar için gelişmiş özellikler",
                MonthlyPrice = 799m,
                YearlyPrice = 7990m,
                Currency = "TRY",
                MaxUsers = 250,
                MaxQuestions = 10000,
                MaxExams = 500,
                MaxStorageMB = 10240, // 10GB
                IsPublic = true,
                DisplayOrder = 2,
                TenantId = tenantId
            },
            new SubscriptionPlan
            {
                Code = "enterprise",
                Name = "Enterprise",
                Description = "Büyük kurumlar için sınırsız özellikler",
                MonthlyPrice = 2499m,
                YearlyPrice = 24990m,
                Currency = "TRY",
                MaxUsers = -1, // Unlimited
                MaxQuestions = -1,
                MaxExams = -1,
                MaxStorageMB = 102400, // 100GB
                IsPublic = true,
                DisplayOrder = 3,
                TenantId = tenantId
            }
        };

        _context.SubscriptionPlans.AddRange(plans);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Subscription plans seeded", count = plans.Count });
    }

    /// <summary>
    /// Seed revenue split rules
    /// </summary>
    [HttpPost("revenue-rules")]
    public async Task<IActionResult> SeedRevenueRules()
    {
        var rules = new List<RevenueSplitRule>
        {
            new RevenueSplitRule
            {
                TransactionType = "subscription_fee",
                PlatformPercent = 100m,
                TenantPercent = 0m,
                AuthorPercent = 0m,
                ReviewerPercent = 0m,
                EffectiveFrom = DateTime.UtcNow,
                RuleDescription = "Subscription fees go 100% to platform"
            },
            new RevenueSplitRule
            {
                TransactionType = "exam_fee",
                PlatformPercent = 30m,
                TenantPercent = 40m,
                AuthorPercent = 20m,
                ReviewerPercent = 10m,
                EffectiveFrom = DateTime.UtcNow,
                RuleDescription = "Exam fees: Platform 30%, Tenant 40%, Author 20%, Reviewer 10%"
            },
            new RevenueSplitRule
            {
                TransactionType = "question_usage",
                PlatformPercent = 20m,
                TenantPercent = 30m,
                AuthorPercent = 40m,
                ReviewerPercent = 10m,
                EffectiveFrom = DateTime.UtcNow,
                RuleDescription = "Question usage: Platform 20%, Tenant 30%, Author 40%, Reviewer 10%"
            }
        };

        _context.RevenueSplitRules.AddRange(rules);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Revenue rules seeded", count = rules.Count });
    }
}

