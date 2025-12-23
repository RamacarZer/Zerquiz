using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Zerquiz.Shared.Payment;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentProvider _paymentProvider;
    private readonly CoreDbContext _context;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IPaymentProvider paymentProvider,
        CoreDbContext context,
        ILogger<PaymentController> logger)
    {
        _paymentProvider = paymentProvider;
        _context = context;
        _logger = logger;
    }

    public class CreatePaymentRequest
    {
        public Guid TenantId { get; set; }
        public Guid UserId { get; set; }
        public Guid LicensePackageId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public string CustomerEmail { get; set; } = string.Empty;
    }

    /// <summary>
    /// Create payment intent for license purchase
    /// </summary>
    [HttpPost("create-intent")]
    public async Task<ActionResult<PaymentIntent>> CreatePaymentIntent([FromBody] CreatePaymentRequest request)
    {
        try
        {
            // Get license package
            var package = await _context.LicensePackages.FindAsync(request.LicensePackageId);
            if (package == null)
            {
                return NotFound("License package not found");
            }

            // Create payment intent
            var paymentIntent = await _paymentProvider.CreatePaymentIntentAsync(new PaymentRequest
            {
                Amount = request.Amount,
                Currency = request.Currency,
                Description = $"License: {package.Name}",
                CustomerEmail = request.CustomerEmail,
                CustomerId = request.UserId.ToString(),
                Metadata = new Dictionary<string, string>
                {
                    { "tenant_id", request.TenantId.ToString() },
                    { "user_id", request.UserId.ToString() },
                    { "license_package_id", request.LicensePackageId.ToString() }
                }
            });

            // Create invoice record
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                TenantId = request.TenantId,
                UserId = request.UserId,
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                Amount = request.Amount,
                Currency = request.Currency,
                Status = "pending",
                PaymentIntentId = paymentIntent.Id,
                DueDate = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Payment intent created: {PaymentIntentId} for Tenant: {TenantId}", 
                paymentIntent.Id, request.TenantId);

            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment intent");
            return StatusCode(500, new { error = "Failed to create payment intent" });
        }
    }

    /// <summary>
    /// Webhook endpoint for payment provider callbacks
    /// </summary>
    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook()
    {
        try
        {
            var payload = await new StreamReader(Request.Body).ReadToEndAsync();
            var signature = Request.Headers["Stripe-Signature"].ToString();
            var webhookSecret = "whsec_test"; // TODO: Move to config

            // Verify signature
            if (!_paymentProvider.VerifyWebhookSignature(payload, signature, webhookSecret))
            {
                _logger.LogWarning("Invalid webhook signature");
                return Unauthorized();
            }

            // Parse event
            var webhookEvent = _paymentProvider.ParseWebhookEvent(payload);
            _logger.LogInformation("Webhook received: {EventType}, PaymentId: {PaymentId}", 
                webhookEvent.EventType, webhookEvent.PaymentId);

            switch (webhookEvent.EventType)
            {
                case "payment_intent.succeeded":
                    await HandlePaymentSucceeded(webhookEvent.PaymentId);
                    break;

                case "payment_intent.payment_failed":
                    await HandlePaymentFailed(webhookEvent.PaymentId);
                    break;

                case "charge.refunded":
                    await HandlePaymentRefunded(webhookEvent.PaymentId);
                    break;

                default:
                    _logger.LogInformation("Unhandled webhook event type: {EventType}", webhookEvent.EventType);
                    break;
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook");
            return StatusCode(500);
        }
    }

    private async Task HandlePaymentSucceeded(string paymentId)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.PaymentIntentId == paymentId);

        if (invoice == null)
        {
            _logger.LogWarning("Invoice not found for payment: {PaymentId}", paymentId);
            return;
        }

        invoice.Status = "paid";
        invoice.PaidAt = DateTime.UtcNow;
        invoice.UpdatedAt = DateTime.UtcNow;

        // Activate tenant license
        // TODO: Implement license activation logic based on invoice metadata

        await _context.SaveChangesAsync();
        _logger.LogInformation("Payment succeeded: {PaymentId}, Invoice: {InvoiceId}", paymentId, invoice.Id);
    }

    private async Task HandlePaymentFailed(string paymentId)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.PaymentIntentId == paymentId);

        if (invoice == null) return;

        invoice.Status = "failed";
        invoice.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        _logger.LogWarning("Payment failed: {PaymentId}, Invoice: {InvoiceId}", paymentId, invoice.Id);
    }

    private async Task HandlePaymentRefunded(string paymentId)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.PaymentIntentId == paymentId);

        if (invoice == null) return;

        invoice.Status = "refunded";
        invoice.UpdatedAt = DateTime.UtcNow;

        // Deactivate tenant license
        // TODO: Implement license deactivation logic

        await _context.SaveChangesAsync();
        _logger.LogInformation("Payment refunded: {PaymentId}, Invoice: {InvoiceId}", paymentId, invoice.Id);
    }

    /// <summary>
    /// Get payment status
    /// </summary>
    [HttpGet("status/{paymentId}")]
    public async Task<ActionResult<PaymentStatus>> GetPaymentStatus(string paymentId)
    {
        try
        {
            var status = await _paymentProvider.GetPaymentStatusAsync(paymentId);
            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment status: {PaymentId}", paymentId);
            return StatusCode(500, new { error = "Failed to get payment status" });
        }
    }

    /// <summary>
    /// Request refund
    /// </summary>
    [HttpPost("refund/{paymentId}")]
    public async Task<ActionResult<RefundResult>> RequestRefund(string paymentId, [FromBody] RefundRequest request)
    {
        try
        {
            var result = await _paymentProvider.RefundPaymentAsync(paymentId, request.Amount, request.Reason);
            
            if (result.Success)
            {
                await HandlePaymentRefunded(paymentId);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing refund: {PaymentId}", paymentId);
            return StatusCode(500, new { error = "Failed to process refund" });
        }
    }

    public class RefundRequest
    {
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}

