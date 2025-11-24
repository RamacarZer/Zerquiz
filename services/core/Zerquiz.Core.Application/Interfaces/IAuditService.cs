namespace Zerquiz.Core.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(Guid tenantId, Guid? userId, string action, string entityName, Guid? entityId, string? changes, string ipAddress, string? userAgent = null);
}

