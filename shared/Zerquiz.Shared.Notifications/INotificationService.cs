namespace Zerquiz.Shared.Notifications;

/// <summary>
/// Notification service interface for Email/SMS/Push
/// </summary>
public interface INotificationService
{
    Task<NotificationResult> SendEmailAsync(EmailNotification notification);
    Task<NotificationResult> SendSmsAsync(SmsNotification notification);
    Task<NotificationResult> SendPushAsync(PushNotification notification);
    Task<NotificationResult> SendBulkEmailAsync(List<EmailNotification> notifications);
    Task<NotificationResult> SendTemplatedEmailAsync(string templateName, string toEmail, Dictionary<string, string> variables);
}

public class EmailNotification
{
    public string To { get; set; } = string.Empty;
    public string? Cc { get; set; }
    public string? Bcc { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; } = true;
    public List<EmailAttachment>? Attachments { get; set; }
    public Dictionary<string, string>? Headers { get; set; }
}

public class EmailAttachment
{
    public string FileName { get; set; } = string.Empty;
    public byte[] Content { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = "application/octet-stream";
}

public class SmsNotification
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? SenderId { get; set; }
}

public class PushNotification
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
    public string? Icon { get; set; }
    public string? Sound { get; set; }
}

public class NotificationResult
{
    public bool Success { get; set; }
    public string? MessageId { get; set; }
    public string? Error { get; set; }
    public DateTime SentAt { get; set; }
}

