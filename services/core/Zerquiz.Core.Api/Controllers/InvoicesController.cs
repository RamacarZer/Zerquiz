using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoicesController : ControllerBase
{
    private readonly CoreDbContext _context;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(CoreDbContext context, ILogger<InvoicesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/invoices/tenant/{tenantId}
    [HttpGet("tenant/{tenantId}")]
    public async Task<ActionResult<object>> GetTenantInvoices(Guid tenantId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Invoices
            .Where(i => i.TenantId == tenantId && i.DeletedAt == null)
            .OrderByDescending(i => i.InvoiceDate);

        var total = await query.CountAsync();
        var invoices = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                i.InvoiceDate,
                i.DueDate,
                i.BillingPeriodStart,
                i.BillingPeriodEnd,
                i.Subtotal,
                i.TaxRate,
                i.TaxAmount,
                i.TotalAmount,
                i.Currency,
                i.Status,
                i.PaymentMethod,
                i.PaidAt,
                i.ItemsJson
            })
            .ToListAsync();

        return Ok(new
        {
            isSuccess = true,
            data = new
            {
                items = invoices,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize)
            }
        });
    }

    // GET: api/invoices/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetInvoice(Guid id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Tenant)
            .FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);

        if (invoice == null)
            return NotFound(new { isSuccess = false, message = "Invoice not found" });

        return Ok(new
        {
            isSuccess = true,
            data = new
            {
                invoice.Id,
                invoice.TenantId,
                TenantName = invoice.Tenant?.Name,
                invoice.InvoiceNumber,
                invoice.InvoiceDate,
                invoice.DueDate,
                invoice.BillingPeriodStart,
                invoice.BillingPeriodEnd,
                invoice.Subtotal,
                invoice.TaxRate,
                invoice.TaxAmount,
                invoice.TotalAmount,
                invoice.Currency,
                invoice.Status,
                invoice.PaymentMethod,
                invoice.PaidAt,
                invoice.PaymentReference,
                invoice.ItemsJson,
                invoice.Notes
            }
        });
    }

    // POST: api/invoices/generate
    [HttpPost("generate")]
    public async Task<ActionResult<object>> GenerateInvoice([FromBody] GenerateInvoiceRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(request.TenantId);
        if (tenant == null)
            return NotFound(new { isSuccess = false, message = "Tenant not found" });

        // Get the last invoice number
        var lastInvoice = await _context.Invoices
            .Where(i => i.TenantId == request.TenantId)
            .OrderByDescending(i => i.InvoiceNumber)
            .FirstOrDefaultAsync();

        var invoiceNumber = GenerateInvoiceNumber(lastInvoice?.InvoiceNumber);

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            InvoiceNumber = invoiceNumber,
            InvoiceDate = request.InvoiceDate ?? DateTime.UtcNow,
            DueDate = request.DueDate ?? DateTime.UtcNow.AddDays(15),
            BillingPeriodStart = request.BillingPeriodStart,
            BillingPeriodEnd = request.BillingPeriodEnd,
            Subtotal = request.Subtotal,
            TaxRate = request.TaxRate ?? 20, // Default %20 KDV
            TaxAmount = request.Subtotal * (request.TaxRate ?? 20) / 100,
            TotalAmount = request.Subtotal + (request.Subtotal * (request.TaxRate ?? 20) / 100),
            Currency = request.Currency ?? "TRY",
            Status = "pending",
            ItemsJson = request.ItemsJson,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            isSuccess = true,
            message = "Invoice generated successfully",
            data = new
            {
                invoice.Id,
                invoice.InvoiceNumber,
                invoice.TotalAmount,
                invoice.Currency
            }
        });
    }

    // PUT: api/invoices/{id}/mark-paid
    [HttpPut("{id}/mark-paid")]
    public async Task<ActionResult<object>> MarkAsPaid(Guid id, [FromBody] MarkPaidRequest request)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null)
            return NotFound(new { isSuccess = false, message = "Invoice not found" });

        if (invoice.Status == "paid")
            return BadRequest(new { isSuccess = false, message = "Invoice is already paid" });

        invoice.Status = "paid";
        invoice.PaidAt = request.PaymentDate ?? DateTime.UtcNow;
        invoice.PaymentMethod = request.PaymentMethod;
        invoice.PaymentReference = request.PaymentReference;
        invoice.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            isSuccess = true,
            message = "Invoice marked as paid successfully"
        });
    }

    // PUT: api/invoices/{id}/mark-overdue
    [HttpPut("{id}/mark-overdue")]
    public async Task<ActionResult<object>> MarkAsOverdue(Guid id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null)
            return NotFound(new { isSuccess = false, message = "Invoice not found" });

        if (invoice.Status == "paid")
            return BadRequest(new { isSuccess = false, message = "Cannot mark paid invoice as overdue" });

        invoice.Status = "overdue";
        invoice.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            isSuccess = true,
            message = "Invoice marked as overdue"
        });
    }

    // PUT: api/invoices/{id}/cancel
    [HttpPut("{id}/cancel")]
    public async Task<ActionResult<object>> CancelInvoice(Guid id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null)
            return NotFound(new { isSuccess = false, message = "Invoice not found" });

        if (invoice.Status == "paid")
            return BadRequest(new { isSuccess = false, message = "Cannot cancel paid invoice" });

        invoice.Status = "cancelled";
        invoice.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            isSuccess = true,
            message = "Invoice cancelled successfully"
        });
    }

    // GET: api/invoices/tenant/{tenantId}/stats
    [HttpGet("tenant/{tenantId}/stats")]
    public async Task<ActionResult<object>> GetInvoiceStats(Guid tenantId)
    {
        var invoices = await _context.Invoices
            .Where(i => i.TenantId == tenantId && i.DeletedAt == null)
            .ToListAsync();

        var stats = new
        {
            total = invoices.Count,
            pending = invoices.Count(i => i.Status == "pending"),
            paid = invoices.Count(i => i.Status == "paid"),
            overdue = invoices.Count(i => i.Status == "overdue"),
            cancelled = invoices.Count(i => i.Status == "cancelled"),
            totalAmount = invoices.Where(i => i.Status != "cancelled").Sum(i => i.TotalAmount),
            paidAmount = invoices.Where(i => i.Status == "paid").Sum(i => i.TotalAmount),
            pendingAmount = invoices.Where(i => i.Status == "pending").Sum(i => i.TotalAmount),
            overdueAmount = invoices.Where(i => i.Status == "overdue").Sum(i => i.TotalAmount),
            currency = invoices.FirstOrDefault()?.Currency ?? "TRY"
        };

        return Ok(new
        {
            isSuccess = true,
            data = stats
        });
    }

    // Helper method
    private string GenerateInvoiceNumber(string? lastInvoiceNumber)
    {
        var prefix = $"INV-{DateTime.UtcNow.Year}-";
        
        if (string.IsNullOrEmpty(lastInvoiceNumber))
            return $"{prefix}0001";

        // Extract number from last invoice
        var parts = lastInvoiceNumber.Split('-');
        if (parts.Length >= 3 && int.TryParse(parts[2], out int lastNumber))
        {
            var nextNumber = lastNumber + 1;
            return $"{prefix}{nextNumber:D4}";
        }

        return $"{prefix}0001";
    }
}

// DTOs
public record GenerateInvoiceRequest
{
    public Guid TenantId { get; init; }
    public DateTime? InvoiceDate { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime BillingPeriodStart { get; init; }
    public DateTime BillingPeriodEnd { get; init; }
    public decimal Subtotal { get; init; }
    public decimal? TaxRate { get; init; }
    public string? Currency { get; init; }
    public string? ItemsJson { get; init; }
    public string? Notes { get; init; }
}

public record MarkPaidRequest
{
    public DateTime? PaymentDate { get; init; }
    public string? PaymentMethod { get; init; }
    public string? PaymentReference { get; init; }
}

