using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Curriculum.Infrastructure.Persistence;

public class CurriculumDbContext : DbContext
{
    public CurriculumDbContext(DbContextOptions<CurriculumDbContext> options) : base(options)
    {
    }

    public DbSet<EducationModel> EducationModels => Set<EducationModel>();
    public DbSet<Domain.Entities.Curriculum> Curricula => Set<Domain.Entities.Curriculum>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<LearningOutcome> LearningOutcomes => Set<LearningOutcome>();
    public DbSet<Translation> Translations => Set<Translation>();
    
    // Definition System
    public DbSet<DefinitionGroup> DefinitionGroups => Set<DefinitionGroup>();
    public DbSet<DefinitionGroupTranslation> DefinitionGroupTranslations => Set<DefinitionGroupTranslation>();
    public DbSet<Definition> Definitions => Set<Definition>();
    public DbSet<DefinitionTranslation> DefinitionTranslations => Set<DefinitionTranslation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("curriculum_schema");

        // EducationModel configuration
        modelBuilder.Entity<EducationModel>(entity =>
        {
            entity.ToTable("education_models");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Curriculum configuration
        modelBuilder.Entity<Domain.Entities.Curriculum>(entity =>
        {
            entity.ToTable("curricula");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.EducationModelId, e.Year, e.Term });
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Term).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CurriculumVersion).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.EducationModel)
                .WithMany(em => em.Curricula)
                .HasForeignKey(e => e.EducationModelId);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Subject configuration
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.ToTable("subjects");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Topic configuration
        modelBuilder.Entity<Topic>(entity =>
        {
            entity.ToTable("topics");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.SubjectId, e.Code });
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Topics)
                .HasForeignKey(e => e.SubjectId);
                
            entity.HasOne(e => e.ParentTopic)
                .WithMany(t => t.SubTopics)
                .HasForeignKey(e => e.ParentTopicId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // LearningOutcome configuration
        modelBuilder.Entity<LearningOutcome>(entity =>
        {
            entity.ToTable("learning_outcomes");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.HasIndex(e => new { e.CurriculumId, e.SubjectId });
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Curriculum)
                .WithMany(c => c.LearningOutcomes)
                .HasForeignKey(e => e.CurriculumId);
                
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.LearningOutcomes)
                .HasForeignKey(e => e.SubjectId);
                
            entity.HasOne(e => e.Topic)
                .WithMany(t => t.LearningOutcomes)
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.SetNull);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Translation configuration
        modelBuilder.Entity<Translation>(entity =>
        {
            entity.ToTable("translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.EntityType, e.EntityId, e.FieldName, e.LanguageCode })
                .IsUnique();
            
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FieldName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.TranslatedValue).IsRequired();
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ==================== DEFINITION SYSTEM ====================
        
        // DefinitionGroup configuration
        modelBuilder.Entity<DefinitionGroup>(entity =>
        {
            entity.ToTable("definition_groups");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Education Model relationship (optional)
            entity.HasOne(e => e.EducationModel)
                .WithMany()
                .HasForeignKey(e => e.EducationModelId)
                .OnDelete(DeleteBehavior.SetNull);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });
        
        // DefinitionGroupTranslation configuration
        modelBuilder.Entity<DefinitionGroupTranslation>(entity =>
        {
            entity.ToTable("definition_group_translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.DefinitionGroupId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            entity.HasOne(e => e.DefinitionGroup)
                .WithMany(g => g.Translations)
                .HasForeignKey(e => e.DefinitionGroupId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasQueryFilter(e => !e.IsDeleted);
        });
        
        // Definition configuration
        modelBuilder.Entity<Definition>(entity =>
        {
            entity.ToTable("definitions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.GroupKey, e.Code }).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.GroupId });
            entity.HasIndex(e => e.ParentId);
            
            entity.Property(e => e.GroupKey).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            entity.Property(e => e.AltNames).HasColumnType("text[]");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Education Model relationship (optional)
            entity.HasOne(e => e.EducationModel)
                .WithMany()
                .HasForeignKey(e => e.EducationModelId)
                .OnDelete(DeleteBehavior.SetNull);
            
            entity.HasOne(e => e.Group)
                .WithMany(g => g.Definitions)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.Parent)
                .WithMany(d => d.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });
        
        // DefinitionTranslation configuration
        modelBuilder.Entity<DefinitionTranslation>(entity =>
        {
            entity.ToTable("definition_translations");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.DefinitionId, e.LanguageCode }).IsUnique();
            
            entity.Property(e => e.LanguageCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            
            entity.HasOne(e => e.Definition)
                .WithMany(d => d.Translations)
                .HasForeignKey(e => e.DefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasQueryFilter(e => !e.IsDeleted);
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

        return base.SaveChangesAsync(cancellationToken);
    }
}


