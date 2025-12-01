// TEMPORARY: Disabled due to missing shared library
/*
using Microsoft.AspNetCore.Mvc;
using Zerquiz.Shared.Notifications;

namespace Zerquiz.Core.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(
        INotificationService notificationService,
        ILogger<NotificationsController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    /// <summary>
    /// Send email notification
    /// </summary>
    [HttpPost("email")]
    public async Task<ActionResult> SendEmail([FromBody] SendEmailRequest request)
    {
        try
        {
            var notification = new EmailNotification
            {
                To = request.To,
                Cc = request.Cc,
                Bcc = request.Bcc,
                Subject = request.Subject,
                Body = request.Body,
                IsHtml = request.IsHtml ?? true
            };

            var result = await _notificationService.SendEmailAsync(notification);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new
            {
                messageId = result.MessageId,
                sentAt = result.SentAt,
                message = "Email sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", request.To);
            return StatusCode(500, "Failed to send email");
        }
    }

    /// <summary>
    /// Send SMS notification
    /// </summary>
    [HttpPost("sms")]
    public async Task<ActionResult> SendSms([FromBody] SendSmsRequest request)
    {
        try
        {
            var notification = new SmsNotification
            {
                PhoneNumber = request.PhoneNumber,
                Message = request.Message,
                SenderId = request.SenderId
            };

            var result = await _notificationService.SendSmsAsync(notification);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new
            {
                messageId = result.MessageId,
                sentAt = result.SentAt,
                message = "SMS sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {Phone}", request.PhoneNumber);
            return StatusCode(500, "Failed to send SMS");
        }
    }

    /// <summary>
    /// Send push notification
    /// </summary>
    [HttpPost("push")]
    public async Task<ActionResult> SendPush([FromBody] SendPushRequest request)
    {
        try
        {
            var notification = new PushNotification
            {
                UserId = request.UserId,
                Title = request.Title,
                Body = request.Body,
                Data = request.Data,
                Icon = request.Icon,
                Sound = request.Sound
            };

            var result = await _notificationService.SendPushAsync(notification);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new
            {
                messageId = result.MessageId,
                sentAt = result.SentAt,
                message = "Push notification sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send push notification to user {UserId}", request.UserId);
            return StatusCode(500, "Failed to send push notification");
        }
    }

    /// <summary>
    /// Send bulk email notifications
    /// </summary>
    [HttpPost("email/bulk")]
    public async Task<ActionResult> SendBulkEmail([FromBody] SendBulkEmailRequest request)
    {
        try
        {
            var notifications = request.Recipients.Select(r => new EmailNotification
            {
                To = r,
                Subject = request.Subject,
                Body = request.Body,
                IsHtml = request.IsHtml ?? true
            }).ToList();

            var result = await _notificationService.SendBulkEmailAsync(notifications);

            return Ok(new
            {
                messageId = result.MessageId,
                sentAt = result.SentAt,
                recipientCount = request.Recipients.Count,
                message = "Bulk emails sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send bulk emails");
            return StatusCode(500, "Failed to send bulk emails");
        }
    }

    /// <summary>
    /// Send templated email
    /// </summary>
    [HttpPost("email/template")]
    public async Task<ActionResult> SendTemplatedEmail([FromBody] SendTemplatedEmailRequest request)
    {
        try
        {
            var result = await _notificationService.SendTemplatedEmailAsync(
                request.TemplateName,
                request.To,
                request.Variables
            );

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new
            {
                messageId = result.MessageId,
                sentAt = result.SentAt,
                message = "Templated email sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send templated email using {Template}", request.TemplateName);
            return StatusCode(500, "Failed to send templated email");
        }
    }

    /// <summary>
    /// Send notification based on event (helper endpoint)
    /// </summary>
    [HttpPost("send-by-event")]
    public async Task<ActionResult> SendByEvent([FromBody] SendByEventRequest request)
    {
        try
        {
            // Route to appropriate notification based on event type
            var result = request.EventType switch
            {
                "exam_started" => await SendExamStartedNotification(request.UserId, request.Data),
                "exam_completed" => await SendExamCompletedNotification(request.UserId, request.Data),
                "grade_published" => await SendGradePublishedNotification(request.UserId, request.Data),
                "question_approved" => await SendQuestionApprovedNotification(request.UserId, request.Data),
                "payment_received" => await SendPaymentReceivedNotification(request.UserId, request.Data),
                _ => throw new ArgumentException($"Unknown event type: {request.EventType}")
            };

            return Ok(new { message = $"Notification sent for event: {request.EventType}", result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification for event {EventType}", request.EventType);
            return StatusCode(500, "Failed to send notification");
        }
    }

    // Helper methods for specific notification types
    private async Task<NotificationResult> SendExamStartedNotification(string userId, Dictionary<string, string> data)
    {
        return await _notificationService.SendTemplatedEmailAsync(
            "exam_started",
            data.GetValueOrDefault("email", ""),
            data
        );
    }

    private async Task<NotificationResult> SendExamCompletedNotification(string userId, Dictionary<string, string> data)
    {
        return await _notificationService.SendTemplatedEmailAsync(
            "exam_completed",
            data.GetValueOrDefault("email", ""),
            data
        );
    }

    private async Task<NotificationResult> SendGradePublishedNotification(string userId, Dictionary<string, string> data)
    {
        return await _notificationService.SendTemplatedEmailAsync(
            "grade_published",
            data.GetValueOrDefault("email", ""),
            data
        );
    }

    private async Task<NotificationResult> SendQuestionApprovedNotification(string userId, Dictionary<string, string> data)
    {
        return await _notificationService.SendTemplatedEmailAsync(
            "question_approved",
            data.GetValueOrDefault("email", ""),
            data
        );
    }

    private async Task<NotificationResult> SendPaymentReceivedNotification(string userId, Dictionary<string, string> data)
    {
        return await _notificationService.SendTemplatedEmailAsync(
            "payment_received",
            data.GetValueOrDefault("email", ""),
            data
        );
    }
}
*/

/*
public record SendEmailRequest(string To, string? Cc, string? Bcc, string Subject, string Body, bool? IsHtml);
public record SendSmsRequest(string PhoneNumber, string Message, string? SenderId);
public record SendPushRequest(string UserId, string Title, string Body, Dictionary<string, string>? Data, string? Icon, string? Sound);
public record SendBulkEmailRequest(List<string> Recipients, string Subject, string Body, bool? IsHtml);
public record SendTemplatedEmailRequest(string TemplateName, string To, Dictionary<string, string> Variables);
public record SendByEventRequest(string EventType, string UserId, Dictionary<string, string> Data);
*/