using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Finance.Application.DTOs;
using Zerquiz.Finance.Domain.Entities;
using Zerquiz.Finance.Infrastructure.Persistence;

namespace Zerquiz.Finance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionPlansController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public SubscriptionPlansController(FinanceDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all public subscription plans
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubscriptionPlanDto>>> GetAll()
    {
        var plans = await _context.SubscriptionPlans
            .Where(p => p.IsPublic)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new SubscriptionPlanDto(
                p.Id,
                p.Code,
                p.Name,
                p.Description,
                p.MonthlyPrice,
                p.YearlyPrice,
                p.Currency,
                p.MaxUsers,
                p.MaxQuestions,
                p.MaxExams,
                p.MaxStorageMB,
                p.IsPublic,
                p.DisplayOrder
            ))
            .ToListAsync();

        return Ok(plans);
    }

    /// <summary>
    /// Get plan by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SubscriptionPlanDto>> GetById(Guid id)
    {
        var plan = await _context.SubscriptionPlans
            .Where(p => p.Id == id)
            .Select(p => new SubscriptionPlanDto(
                p.Id,
                p.Code,
                p.Name,
                p.Description,
                p.MonthlyPrice,
                p.YearlyPrice,
                p.Currency,
                p.MaxUsers,
                p.MaxQuestions,
                p.MaxExams,
                p.MaxStorageMB,
                p.IsPublic,
                p.DisplayOrder
            ))
            .FirstOrDefaultAsync();

        if (plan == null)
            return NotFound();

        return Ok(plan);
    }

    /// <summary>
    /// Create new subscription plan
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SubscriptionPlanDto>> Create([FromBody] CreateSubscriptionPlanRequest request)
    {
        var plan = new SubscriptionPlan
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            MonthlyPrice = request.MonthlyPrice,
            YearlyPrice = request.YearlyPrice,
            Currency = request.Currency,
            MaxUsers = request.MaxUsers,
            MaxQuestions = request.MaxQuestions,
            MaxExams = request.MaxExams,
            MaxStorageMB = request.MaxStorageMB,
            IsPublic = true,
            DisplayOrder = await _context.SubscriptionPlans.CountAsync() + 1
        };

        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, new SubscriptionPlanDto(
            plan.Id,
            plan.Code,
            plan.Name,
            plan.Description,
            plan.MonthlyPrice,
            plan.YearlyPrice,
            plan.Currency,
            plan.MaxUsers,
            plan.MaxQuestions,
            plan.MaxExams,
            plan.MaxStorageMB,
            plan.IsPublic,
            plan.DisplayOrder
        ));
    }
}

