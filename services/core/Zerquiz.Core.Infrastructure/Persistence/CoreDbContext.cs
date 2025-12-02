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
    
    // Hierarchical Definition System
    public DbSet<DefinitionGroup> DefinitionGroups => Set<DefinitionGroup>();
    public DbSet<DefinitionGroupTranslation> DefinitionGroupTranslations => Set<DefinitionGroupTranslation>();
    public DbSet<Definition> Definitions => Set<Definition>();
    public DbSet<DefinitionTranslation> DefinitionTranslations => Set<DefinitionTranslation>();
    public DbSet<DefinitionRelation> DefinitionRelations => Set<DefinitionRelation>();
    
    // License & Branding System
    public DbSet<LicensePackage> LicensePackages => Set<LicensePackage>();
    public DbSet<TenantLicense> TenantLicenses => Set<TenantLicense>();
    public DbSet<TenantBrandingSettings> TenantBrandingSettings => Set<TenantBrandingSettings>();
    
    // Dynamic Menu System
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<ModuleTranslation> ModuleTranslations => Set<ModuleTranslation>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<MenuItemTranslation> MenuItemTranslations => Set<MenuItemTranslation>();
    public DbSet<MenuPermission> MenuPermissions => Set<MenuPermission>();
    public DbSet<TenantModule> TenantModules => Set<TenantModule>();
    public DbSet<UserModulePermission> UserModulePermissions => Set<UserModulePermission>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<UsageTracking> UsageTrackings => Set<UsageTracking>();
    // TODO: Add SystemFeature and UserPermission entities later

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

        // DefinitionGroup configuration
        modelBuilder.Entity<DefinitionGroup>(entity =>
        {
            entity.ToTable("definition_groups", "core_schema");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.IconName).HasMaxLength(50);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // DefinitionGroupTranslation configuration
        modelBuilder.Entity<DefinitionGroupTranslation>(entity =>
        {
            entity.ToTable("definition_group_translations", "core_schema");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.DefinitionGroupId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            entity.HasOne(e => e.DefinitionGroup)
                .WithMany(dg => dg.Translations)
                .HasForeignKey(e => e.DefinitionGroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Definition configuration
        modelBuilder.Entity<Definition>(entity =>
        {
            entity.ToTable("definitions", "core_schema");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.DefinitionGroupId, e.Code }).IsUnique();
            entity.HasIndex(e => e.ParentDefinitionId);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Value).HasMaxLength(500);
            entity.Property(e => e.IconName).HasMaxLength(50);
            entity.Property(e => e.ColorCode).HasMaxLength(20);
            entity.Property(e => e.ChildIds).HasColumnType("uuid[]");
            
            entity.HasOne(e => e.DefinitionGroup)
                .WithMany(dg => dg.Definitions)
                .HasForeignKey(e => e.DefinitionGroupId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.ParentDefinition)
                .WithMany(d => d.ChildDefinitions)
                .HasForeignKey(e => e.ParentDefinitionId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // DefinitionTranslation configuration
        modelBuilder.Entity<DefinitionTranslation>(entity =>
        {
            entity.ToTable("definition_translations", "core_schema");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.DefinitionId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Value).IsRequired().HasMaxLength(500);
            
            entity.HasOne(e => e.Definition)
                .WithMany(d => d.Translations)
                .HasForeignKey(e => e.DefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // DefinitionRelation configuration
        modelBuilder.Entity<DefinitionRelation>(entity =>
        {
            entity.ToTable("definition_relations", "core_schema");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.SourceDefinitionId, e.TargetDefinitionId, e.RelationType }).IsUnique();
            
            entity.Property(e => e.RelationType).IsRequired().HasMaxLength(50);
            
            entity.HasOne(e => e.SourceDefinition)
                .WithMany(d => d.RelationsAsSource)
                .HasForeignKey(e => e.SourceDefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.TargetDefinition)
                .WithMany(d => d.RelationsAsTarget)
                .HasForeignKey(e => e.TargetDefinitionId)
                .OnDelete(DeleteBehavior.Restrict);
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
            entity.Property(e => e.Features).HasColumnType("text[]"); // string[] for features
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // TenantLicense configuration
        modelBuilder.Entity<TenantLicense>(entity =>
        {
            entity.ToTable("tenant_licenses");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.EndDate);
            entity.HasIndex(e => new { e.TenantId, e.Status });
            
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.BillingPeriod).HasMaxLength(20);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.CustomLimitsJson).HasColumnType("jsonb");
            entity.Property(e => e.CustomFeaturesJson).HasColumnType("jsonb");
            entity.Property(e => e.CurrentUsageJson).HasColumnType("jsonb");
            
            entity.HasOne(e => e.LicensePackage)
                .WithMany(p => p.TenantLicenses)
                .HasForeignKey(e => e.LicensePackageId);
                
            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // TODO: SystemFeature configuration (will be added later)
        // modelBuilder.Entity<SystemFeature>(entity =>
        // {
        //     entity.ToTable("system_features");
        //     entity.HasKey(e => e.Id);
        //     entity.HasIndex(e => e.Code).IsUnique();
        //     entity.HasIndex(e => e.Category);
        //     
        //     entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
        //     entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        //     entity.Property(e => e.Category).HasMaxLength(50);
        //     entity.Property(e => e.Metadata).HasColumnType("jsonb");
        //     entity.Property(e => e.Tags).HasColumnType("text[]");
        //     
        //     entity.HasQueryFilter(e => e.DeletedAt == null);
        // });

        // TenantBrandingSettings configuration
        modelBuilder.Entity<TenantBrandingSettings>(entity =>
        {
            entity.ToTable("tenant_branding_settings");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId).IsUnique();
            entity.HasIndex(e => e.Subdomain).IsUnique();
            entity.HasIndex(e => e.CustomDomain);
            
            entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Subdomain).HasMaxLength(100);
            entity.Property(e => e.CustomDomain).HasMaxLength(255);
            entity.Property(e => e.DefaultLanguage).HasMaxLength(10);
            entity.Property(e => e.DefaultCurrency).HasMaxLength(10);
            entity.Property(e => e.ColorThemeJson).HasColumnType("jsonb");
            entity.Property(e => e.AdvancedSettingsJson).HasColumnType("jsonb");
            entity.Property(e => e.FeatureFlagsJson).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Tenant)
                .WithOne()
                .HasForeignKey<TenantBrandingSettings>(e => e.TenantId);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Invoice configuration
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.ToTable("invoices");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.InvoiceNumber).IsUnique();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.DueDate);
            
            entity.Property(e => e.InvoiceNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.ItemsJson).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId);
                
            entity.HasOne(e => e.License)
                .WithMany()
                .HasForeignKey(e => e.LicenseId);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // UsageTracking configuration
        modelBuilder.Entity<UsageTracking>(entity =>
        {
            entity.ToTable("usage_tracking");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.TrackingDate, e.TrackingHour }).IsUnique();
            entity.HasIndex(e => e.TrackingDate);
            
            entity.Property(e => e.MetricsJson).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId);
        });

        // Module configuration
        modelBuilder.Entity<Module>(entity =>
        {
            entity.ToTable("modules");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.IconName).HasMaxLength(50);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ModuleTranslation configuration
        modelBuilder.Entity<ModuleTranslation>(entity =>
        {
            entity.ToTable("module_translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ModuleId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            entity.HasOne(e => e.Module)
                .WithMany(m => m.Translations)
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuItem configuration
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.ToTable("menu_items");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ModuleId, e.Code }).IsUnique();
            entity.HasIndex(e => e.ParentMenuId);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
            entity.Property(e => e.IconName).HasMaxLength(50);
            entity.Property(e => e.Path).HasMaxLength(500);
            entity.Property(e => e.MenuType).HasMaxLength(20);
            entity.Property(e => e.BadgeText).HasMaxLength(50);
            entity.Property(e => e.BadgeColor).HasMaxLength(20);
            
            entity.HasOne(e => e.Module)
                .WithMany(m => m.MenuItems)
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.ParentMenu)
                .WithMany(m => m.ChildMenus)
                .HasForeignKey(e => e.ParentMenuId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // MenuItemTranslation configuration
        modelBuilder.Entity<MenuItemTranslation>(entity =>
        {
            entity.ToTable("menu_item_translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.MenuItemId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
            entity.Property(e => e.BadgeText).HasMaxLength(50);
            
            entity.HasOne(e => e.MenuItem)
                .WithMany(m => m.Translations)
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuPermission configuration
        modelBuilder.Entity<MenuPermission>(entity =>
        {
            entity.ToTable("menu_permissions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.MenuItemId, e.RoleName }).IsUnique();
            
            entity.Property(e => e.RoleName).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.MenuItem)
                .WithMany(m => m.Permissions)
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TenantModule configuration (already exists, but adding navigation)
        modelBuilder.Entity<TenantModule>(entity =>
        {
            entity.ToTable("tenant_modules");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.ModuleId }).IsUnique();
            
            entity.HasOne(e => e.Module)
                .WithMany(m => m.TenantModules)
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // UserModulePermission configuration
        modelBuilder.Entity<UserModulePermission>(entity =>
        {
            entity.ToTable("user_module_permissions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ModuleId }).IsUnique();
            
            entity.HasOne(e => e.Module)
                .WithMany()
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TODO: UserPermission configuration (will be added later)
        // modelBuilder.Entity<UserPermission>(entity =>
        // {
        //     entity.ToTable("user_permissions");
        //     entity.HasKey(e => e.Id);
        //     entity.HasIndex(e => e.UserId);
        //     entity.HasIndex(e => e.PermissionCode);
        //     entity.HasIndex(e => new { e.UserId, e.PermissionCode });
        //     entity.HasIndex(e => new { e.UserId, e.ResourceType, e.ResourceId });
        //     
        //     entity.Property(e => e.PermissionCode).IsRequired().HasMaxLength(100);
        //     entity.Property(e => e.ResourceType).HasMaxLength(50);
        //     entity.Property(e => e.Metadata).HasColumnType("jsonb");
        //     entity.Property(e => e.Tags).HasColumnType("text[]");
        //     
        //     entity.HasQueryFilter(e => e.DeletedAt == null);
        // });

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
