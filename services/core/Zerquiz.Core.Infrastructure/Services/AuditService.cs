using Zerquiz.Core.Application.Interfaces;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Core.Infrastructure.Persistence;

namespace Zerquiz.Core.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly CoreDbContext _context;

    public AuditService(CoreDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(Guid tenantId, Guid? userId, string action, string entityName, Guid? entityId, string? changes, string ipAddress, string? userAgent = null)
    {
        var auditLog = new AuditLog
        {
            TenantId = tenantId,
            UserId = userId,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            Changes = changes,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Timestamp = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }
}

