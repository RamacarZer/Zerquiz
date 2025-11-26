using System;
using System.Text.Json;

namespace Zerquiz.Shared.Contracts.Domain;

/// <summary>
/// Profesyonel enterprise sistemler için tam donanımlı base entity
/// </summary>
public abstract class BaseEntity
{
    // Primary Key
    public Guid Id { get; set; } = Guid.NewGuid();

    // Multi-Tenancy
    public Guid? TenantId { get; set; }

    // Audit Trail - Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    // Audit Trail - Users
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public Guid? DeletedBy { get; set; }

    // Status Management
    public bool IsActive { get; set; } = true;
    public string? Status { get; set; }
    public int Version { get; set; } = 1; // Optimistic Concurrency Control

    // Tracking & Analytics
    public string? Source { get; set; } // web, mobile, api, import, etc.
    public JsonDocument? Metadata { get; set; } // JSONB - Flexible data storage
    public string[]? Tags { get; set; } // Array for categorization

    // Request Tracking
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestId { get; set; }
    public string? CorrelationId { get; set; } // For distributed tracing
    
    // Organization & Module Context
    public Guid? OrganizationId { get; set; }
    public Guid? AppId { get; set; } // Application/Module ID
    public Guid? ModuleId { get; set; } // Module/Service ID for tracking

    // Soft Delete Check
    public bool IsDeleted => DeletedAt.HasValue;
}
