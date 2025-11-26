using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Finance.Application.DTOs;
using Zerquiz.Finance.Domain.Entities;
using Zerquiz.Finance.Infrastructure.Persistence;

namespace Zerquiz.Finance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly FinanceDbContext _context;
    private readonly ILogger<SubscriptionsController> _logger;

    public SubscriptionsController(FinanceDbContext context, ILogger<SubscriptionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all subscriptions (filtered by tenant)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetAll()
    {
        var subscriptions = await _context.Subscriptions
            .Include(s => s.Plan)
            .Select(s => new SubscriptionDto(
                s.Id,
                s.PlanId,
                s.Plan.Name,
                s.StartDate,
                s.EndDate,
                s.SubscriptionStatus,
                s.BillingCycle,
                s.MonthlyFee,
                s.Currency,
                s.AutoRenew
            ))
            .ToListAsync();

        return Ok(subscriptions);
    }

    /// <summary>
    /// Get subscription by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SubscriptionDto>> GetById(Guid id)
    {
        var subscription = await _context.Subscriptions
            .Include(s => s.Plan)
            .Where(s => s.Id == id)
            .Select(s => new SubscriptionDto(
                s.Id,
                s.PlanId,
                s.Plan.Name,
                s.StartDate,
                s.EndDate,
                s.SubscriptionStatus,
                s.BillingCycle,
                s.MonthlyFee,
                s.Currency,
                s.AutoRenew
            ))
            .FirstOrDefaultAsync();

        if (subscription == null)
            return NotFound();

        return Ok(subscription);
    }

    /// <summary>
    /// Create new subscription
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SubscriptionDto>> Create([FromBody] CreateSubscriptionRequest request)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(request.PlanId);
        if (plan == null)
            return BadRequest("Plan not found");

        var monthlyFee = request.BillingCycle == "yearly" ? plan.YearlyPrice / 12 : plan.MonthlyPrice;

        var subscription = new Subscription
        {
            PlanId = request.PlanId,
            StartDate = request.StartDate,
            EndDate = request.BillingCycle == "yearly" 
                ? request.StartDate.AddYears(1) 
                : request.StartDate.AddMonths(1),
            BillingCycle = request.BillingCycle,
            MonthlyFee = monthlyFee,
            Currency = plan.Currency,
            AutoRenew = request.AutoRenew,
            SubscriptionStatus = "trial"
        };

        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = subscription.Id }, new SubscriptionDto(
            subscription.Id,
            subscription.PlanId,
            plan.Name,
            subscription.StartDate,
            subscription.EndDate,
            subscription.SubscriptionStatus,
            subscription.BillingCycle,
            subscription.MonthlyFee,
            subscription.Currency,
            subscription.AutoRenew
        ));
    }

    /// <summary>
    /// Cancel subscription
    /// </summary>
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelSubscriptionRequest request)
    {
        var subscription = await _context.Subscriptions.FindAsync(id);
        if (subscription == null)
            return NotFound();

        subscription.SubscriptionStatus = "cancelled";
        subscription.CancelledAt = DateTime.UtcNow;
        subscription.CancellationReason = request.CancellationReason;
        subscription.AutoRenew = false;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Renew subscription
    /// </summary>
    [HttpPost("{id}/renew")]
    public async Task<IActionResult> Renew(Guid id)
    {
        var subscription = await _context.Subscriptions.FindAsync(id);
        if (subscription == null)
            return NotFound();

        subscription.EndDate = subscription.BillingCycle == "yearly"
            ? subscription.EndDate.AddYears(1)
            : subscription.EndDate.AddMonths(1);
        subscription.SubscriptionStatus = "active";

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

