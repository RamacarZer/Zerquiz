using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;
using System.Linq.Expressions;

namespace Zerquiz.Grading.Infrastructure.Persistence;

public class GradingDbContext : DbContext
{
    public GradingDbContext(DbContextOptions<GradingDbContext> options) : base(options)
    {
    }

    public DbSet<Response> Responses => Set<Response>();
    public DbSet<ExamResult> ExamResults => Set<ExamResult>();
    public DbSet<QuestionStatistics> QuestionStatistics => Set<QuestionStatistics>();
    public DbSet<Certificate> Certificates => Set<Certificate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("grading_schema");

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

        // Response configuration
        modelBuilder.Entity<Response>(entity =>
        {
            entity.ToTable("responses");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.ExamSessionId });
            entity.HasIndex(e => new { e.TenantId, e.QuestionId });
            entity.HasIndex(e => new { e.TenantId, e.ExamQuestionId });
            entity.HasIndex(e => e.AnsweredAt);
            
            entity.Property(e => e.UserAnswers).HasColumnType("jsonb");
            entity.Property(e => e.Score).HasPrecision(10, 2);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        // ExamResult configuration
        modelBuilder.Entity<ExamResult>(entity =>
        {
            entity.ToTable("exam_results");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ExamId });
            entity.HasIndex(e => e.ExamSessionId).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.EvaluatedAt });
            
            entity.Property(e => e.TotalScore).HasPrecision(10, 2);
            entity.Property(e => e.MaxScore).HasPrecision(10, 2);
            entity.Property(e => e.Percentage).HasPrecision(5, 2);
            entity.Property(e => e.Breakdown).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        // QuestionStatistics configuration
        modelBuilder.Entity<QuestionStatistics>(entity =>
        {
            entity.ToTable("question_statistics");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.QuestionId }).IsUnique();
            entity.HasIndex(e => e.LastUpdated);
            
            entity.Property(e => e.AvgTimeSeconds).HasPrecision(10, 2);
            entity.Property(e => e.DifficultyIndex).HasPrecision(5, 4);
        });

        // Certificate configuration
        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.ToTable("certificates");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.CertificateNumber }).IsUnique();
            entity.HasIndex(e => e.VerifyToken).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.UserId });
            entity.HasIndex(e => e.IssuedAt);
            
            entity.Property(e => e.CertificateNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.VerifyToken).IsRequired().HasMaxLength(100);
            entity.Property(e => e.TemplateId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PdfUrl).HasMaxLength(1000);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.ExamResult)
                .WithMany()
                .HasForeignKey(e => e.ExamResultId);
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
