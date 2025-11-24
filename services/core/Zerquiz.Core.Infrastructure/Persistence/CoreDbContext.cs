using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;

namespace Zerquiz.Core.Infrastructure.Persistence;

public class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options)
    {
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<SystemDefinition> SystemDefinitions => Set<SystemDefinition>();
    public DbSet<Translation> Translations => Set<Translation>();
    public DbSet<SystemParameter> SystemParameters => Set<SystemParameter>();
    public DbSet<TenantTheme> TenantThemes => Set<TenantTheme>();
    
    // License System
    public DbSet<LicensePackage> LicensePackages => Set<LicensePackage>();
    public DbSet<TenantLicense> TenantLicenses => Set<TenantLicense>();
    public DbSet<SystemFeature> SystemFeatures => Set<SystemFeature>();
    public DbSet<UserPermission> UserPermissions => Set<UserPermission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("core_schema");

        // Tenant configuration
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.ToTable("tenants");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.CustomDomain);
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomDomain).HasMaxLength(255);
            entity.Property(e => e.CompanyName).HasMaxLength(300);
            entity.Property(e => e.TaxNumber).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Website).HasMaxLength(255);
            entity.Property(e => e.SubscriptionStatus).HasMaxLength(50);
            
            entity.Property(e => e.Settings)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<TenantSettings>(v, (JsonSerializerOptions?)null) ?? new TenantSettings()
                );
            
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // AuditLog configuration
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("audit_logs");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => new { e.TenantId, e.Timestamp });
            entity.HasIndex(e => new { e.EntityName, e.EntityId });
            
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Changes).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.IpAddress).HasMaxLength(50);
            entity.Property(e => e.UserAgent).HasMaxLength(500);
        });

        // SystemDefinition configuration
        modelBuilder.Entity<SystemDefinition>(entity =>
        {
            entity.ToTable("system_definitions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Category, e.Code }).IsUnique();
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => new { e.TenantId, e.Category });
            
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            entity.Property(e => e.ConfigurationJson).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Self-referencing relationship for hierarchy
            entity.HasOne(e => e.Parent)
                .WithMany(e => e.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Translation configuration
        modelBuilder.Entity<Translation>(entity =>
        {
            entity.ToTable("translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.EntityType, e.EntityId, e.FieldName, e.LanguageCode }).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.EntityType });
            
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FieldName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // SystemParameter configuration
        modelBuilder.Entity<SystemParameter>(entity =>
        {
            entity.ToTable("system_parameters");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Category, e.Key }).IsUnique();
            entity.HasIndex(e => e.Category);
            
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Key).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DataType).HasMaxLength(20);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // TenantTheme configuration
        modelBuilder.Entity<TenantTheme>(entity =>
        {
            entity.ToTable("tenant_themes");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId).IsUnique(); // One theme per tenant
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PrimaryColor).HasMaxLength(7);
            entity.Property(e => e.SecondaryColor).HasMaxLength(7);
            entity.Property(e => e.FontFamily).HasMaxLength(100);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Navigation to Tenant
            entity.HasOne(e => e.Tenant)
                .WithOne(t => t.Theme)
                .HasForeignKey<TenantTheme>(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // LicensePackage configuration
        modelBuilder.Entity<LicensePackage>(entity =>
        {
            entity.ToTable("license_packages");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.FeaturesJson).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // TenantLicense configuration
        modelBuilder.Entity<TenantLicense>(entity =>
        {
            entity.ToTable("tenant_licenses");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LicenseKey).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.ExpiryDate);
            entity.HasIndex(e => new { e.TenantId, e.IsActive });
            
            entity.Property(e => e.LicenseKey).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomFeaturesJson).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.LicensePackage)
                .WithMany(p => p.TenantLicenses)
                .HasForeignKey(e => e.LicensePackageId);
                
            entity.HasOne(e => e.Tenant)
                .WithMany(t => t.Licenses)
                .HasForeignKey(e => e.TenantId);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // SystemFeature configuration
        modelBuilder.Entity<SystemFeature>(entity =>
        {
            entity.ToTable("system_features");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.HasIndex(e => e.Category);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // UserPermission configuration
        modelBuilder.Entity<UserPermission>(entity =>
        {
            entity.ToTable("user_permissions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.PermissionCode);
            entity.HasIndex(e => new { e.UserId, e.PermissionCode });
            entity.HasIndex(e => new { e.UserId, e.ResourceType, e.ResourceId });
            
            entity.Property(e => e.PermissionCode).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ResourceType).HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-update UpdatedAt and Version for modified entities
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.Version++;
            }
        }
        
        // Handle Tenant updates (doesn't inherit BaseEntity)
        foreach (var entry in ChangeTracker.Entries<Tenant>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.Version++;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
