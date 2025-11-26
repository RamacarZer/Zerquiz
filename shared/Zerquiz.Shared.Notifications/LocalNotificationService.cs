using Microsoft.Extensions.Logging;

namespace Zerquiz.Shared.Notifications;

/// <summary>
/// Local notification service (logs to console/file for development)
/// </summary>
public class LocalNotificationService : INotificationService
{
    private readonly ILogger<LocalNotificationService> _logger;

    public LocalNotificationService(ILogger<LocalNotificationService> logger)
    {
        _logger = logger;
    }

    public Task<NotificationResult> SendEmailAsync(EmailNotification notification)
    {
        _logger.LogInformation("📧 [LOCAL EMAIL] To: {To}, Subject: {Subject}", 
            notification.To, notification.Subject);
        _logger.LogInformation("Body: {Body}", 
            notification.IsHtml ? "[HTML Content]" : notification.Body);

        return Task.FromResult(new NotificationResult
        {
            Success = true,
            MessageId = $"local-email-{Guid.NewGuid():N}",
            SentAt = DateTime.UtcNow
        });
    }

    public Task<NotificationResult> SendSmsAsync(SmsNotification notification)
    {
        _logger.LogInformation("📱 [LOCAL SMS] To: {Phone}, Message: {Message}", 
            notification.PhoneNumber, notification.Message);

        return Task.FromResult(new NotificationResult
        {
            Success = true,
            MessageId = $"local-sms-{Guid.NewGuid():N}",
            SentAt = DateTime.UtcNow
        });
    }

    public Task<NotificationResult> SendPushAsync(PushNotification notification)
    {
        _logger.LogInformation("🔔 [LOCAL PUSH] User: {UserId}, Title: {Title}", 
            notification.UserId, notification.Title);
        _logger.LogInformation("Body: {Body}", notification.Body);

        return Task.FromResult(new NotificationResult
        {
            Success = true,
            MessageId = $"local-push-{Guid.NewGuid():N}",
            SentAt = DateTime.UtcNow
        });
    }

    public async Task<NotificationResult> SendBulkEmailAsync(List<EmailNotification> notifications)
    {
        _logger.LogInformation("📧 [LOCAL BULK EMAIL] Sending {Count} emails", notifications.Count);

        foreach (var notification in notifications)
        {
            await SendEmailAsync(notification);
        }

        return new NotificationResult
        {
            Success = true,
            MessageId = $"local-bulk-{Guid.NewGuid():N}",
            SentAt = DateTime.UtcNow
        };
    }

    public Task<NotificationResult> SendTemplatedEmailAsync(
        string templateName, 
        string toEmail, 
        Dictionary<string, string> variables)
    {
        _logger.LogInformation("📧 [LOCAL TEMPLATED EMAIL] Template: {Template}, To: {Email}", 
            templateName, toEmail);
        _logger.LogInformation("Variables: {Variables}", 
            string.Join(", ", variables.Select(kv => $"{kv.Key}={kv.Value}")));

        return Task.FromResult(new NotificationResult
        {
            Success = true,
            MessageId = $"local-template-{Guid.NewGuid():N}",
            SentAt = DateTime.UtcNow
        });
    }
}

