namespace Zerquiz.Core.Domain.Entities;

/// <summary>
/// Audit log for tracking all important actions in the system
/// AuditLog, BaseEntity'den türemez çünkü kendisi bir audit kaydıdır
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty; // CREATE, UPDATE, DELETE, etc.
    public string EntityName { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string? Changes { get; set; } // JSONB - stores before/after values
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    // Additional tracking fields
    public string? RequestId { get; set; }
    public string? CorrelationId { get; set; }
    public string? Source { get; set; } // web, mobile, api, import
    public string? Metadata { get; set; } // JSONB - Additional context
}


