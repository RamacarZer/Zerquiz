using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;
using System.Linq.Expressions;

namespace Zerquiz.Questions.Infrastructure.Persistence;

public class QuestionsDbContext : DbContext
{
    public QuestionsDbContext(DbContextOptions<QuestionsDbContext> options) : base(options)
    {
    }

    public DbSet<QuestionFormatType> QuestionFormatTypes => Set<QuestionFormatType>();
    public DbSet<QuestionPedagogicalType> QuestionPedagogicalTypes => Set<QuestionPedagogicalType>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionVersion> QuestionVersions => Set<QuestionVersion>();
    public DbSet<QuestionSolution> QuestionSolutions => Set<QuestionSolution>();
    public DbSet<QuestionAsset> QuestionAssets => Set<QuestionAsset>();
    public DbSet<QuestionReview> QuestionReviews => Set<QuestionReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("questions_schema");

        // Apply configurations for BaseEntity properties globally
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).Property<DateTime>("CreatedAt").HasDefaultValueSql("NOW()");
                modelBuilder.Entity(entityType.ClrType).Property<DateTime>("UpdatedAt").HasDefaultValueSql("NOW()");
                modelBuilder.Entity(entityType.ClrType).Property<int>("Version").HasDefaultValue(1);
                modelBuilder.Entity(entityType.ClrType).Property<bool>("IsActive").HasDefaultValue(true);
                modelBuilder.Entity(entityType.ClrType).Property<string[]>("Tags").HasColumnType("text[]");
                modelBuilder.Entity(entityType.ClrType).Property<JsonDocument>("Metadata").HasColumnType("jsonb");
                
                // Soft delete query filter
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, "DeletedAt");
                var condition = Expression.Equal(property, Expression.Constant(null, typeof(DateTime?)));
                var lambda = Expression.Lambda(condition, parameter);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }

        // QuestionFormatType configuration
        modelBuilder.Entity<QuestionFormatType>(entity =>
        {
            entity.ToTable("question_format_types");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ConfigSchema).HasColumnType("jsonb");
        });

        // QuestionPedagogicalType configuration
        modelBuilder.Entity<QuestionPedagogicalType>(entity =>
        {
            entity.ToTable("question_pedagogical_types");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        });

        // Question configuration
        modelBuilder.Entity<Question>(entity =>
        {
            entity.ToTable("questions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.QuestionStatus });
            entity.HasIndex(e => new { e.TenantId, e.SubjectId });
            entity.HasIndex(e => new { e.TenantId, e.TopicId });
            entity.HasIndex(e => new { e.TenantId, e.CurriculumId });
            entity.HasIndex(e => new { e.TenantId, e.Difficulty });
            entity.HasIndex(e => e.PublishedAt);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.QuestionStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Difficulty).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Weight).HasPrecision(5, 2).HasDefaultValue(1.0m);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.FormatType)
                .WithMany()
                .HasForeignKey(e => e.FormatTypeId);
                
            entity.HasOne(e => e.PedagogicalType)
                .WithMany()
                .HasForeignKey(e => e.PedagogicalTypeId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // QuestionVersion configuration
        modelBuilder.Entity<QuestionVersion>(entity =>
        {
            entity.ToTable("question_versions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.QuestionId, e.VersionNumber }).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.Property(e => e.Content).HasColumnType("jsonb").IsRequired();
            entity.Property(e => e.VersionNumber).IsRequired();
            
            entity.HasOne(e => e.Question)
                .WithMany(q => q.Versions)
                .HasForeignKey(e => e.QuestionId);
        });

        // QuestionSolution configuration
        modelBuilder.Entity<QuestionSolution>(entity =>
        {
            entity.ToTable("question_solutions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.QuestionId });
            entity.HasIndex(e => new { e.TenantId, e.AuthorId });
            
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Content).HasColumnType("jsonb").IsRequired();
            entity.Property(e => e.Language).HasMaxLength(10);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Question)
                .WithMany(q => q.Solutions)
                .HasForeignKey(e => e.QuestionId);
        });

        // QuestionAsset configuration
        modelBuilder.Entity<QuestionAsset>(entity =>
        {
            entity.ToTable("question_assets");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.QuestionVersionId });
            entity.HasIndex(e => e.StorageKey);
            
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(500);
            entity.Property(e => e.StorageKey).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Url).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.MimeType).HasMaxLength(100);
            entity.Property(e => e.Position).HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.QuestionVersion)
                .WithMany(qv => qv.Assets)
                .HasForeignKey(e => e.QuestionVersionId);
        });

        // QuestionReview configuration
        modelBuilder.Entity<QuestionReview>(entity =>
        {
            entity.ToTable("question_reviews");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.QuestionId });
            entity.HasIndex(e => new { e.TenantId, e.ReviewerId });
            entity.HasIndex(e => new { e.TenantId, e.ReviewStatus });
            entity.HasIndex(e => e.ReviewedAt);
            
            entity.Property(e => e.ReviewStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Comments).HasMaxLength(2000);
            entity.Property(e => e.ReviewFee).HasPrecision(10, 2);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Question)
                .WithMany(q => q.Reviews)
                .HasForeignKey(e => e.QuestionId);
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

