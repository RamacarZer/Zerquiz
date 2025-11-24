using Microsoft.EntityFrameworkCore;
using Zerquiz.Exams.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;
using System.Linq.Expressions;

namespace Zerquiz.Exams.Infrastructure.Persistence;

public class ExamsDbContext : DbContext
{
    public ExamsDbContext(DbContextOptions<ExamsDbContext> options) : base(options)
    {
    }

    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<ExamSection> ExamSections => Set<ExamSection>();
    public DbSet<ExamQuestion> ExamQuestions => Set<ExamQuestion>();
    public DbSet<Booklet> Booklets => Set<Booklet>();
    public DbSet<BookletQuestion> BookletQuestions => Set<BookletQuestion>();
    public DbSet<ExamSession> ExamSessions => Set<ExamSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("exams_schema");

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

        // Exam configuration
        modelBuilder.Entity<Exam>(entity =>
        {
            entity.ToTable("exams");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Status });
            entity.HasIndex(e => new { e.TenantId, e.Mode });
            entity.HasIndex(e => e.ScheduledAt);
            entity.HasIndex(e => e.CurriculumId);
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Mode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Settings).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        // ExamSection configuration
        modelBuilder.Entity<ExamSection>(entity =>
        {
            entity.ToTable("exam_sections");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ExamId, e.DisplayOrder });
            entity.HasIndex(e => e.TenantId);
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ScoringPolicy).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Exam)
                .WithMany(ex => ex.Sections)
                .HasForeignKey(e => e.ExamId);
        });

        // ExamQuestion configuration
        modelBuilder.Entity<ExamQuestion>(entity =>
        {
            entity.ToTable("exam_questions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ExamSectionId, e.DisplayOrder });
            entity.HasIndex(e => new { e.TenantId, e.QuestionId });
            
            entity.Property(e => e.Points).HasPrecision(10, 2);
            entity.Property(e => e.Weight).HasPrecision(5, 2).HasDefaultValue(1.0m);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.ExamSection)
                .WithMany(es => es.Questions)
                .HasForeignKey(e => e.ExamSectionId);
        });

        // Booklet configuration
        modelBuilder.Entity<Booklet>(entity =>
        {
            entity.ToTable("booklets");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ExamId, e.Type });
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            
            entity.Property(e => e.Type).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Settings).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Exam)
                .WithMany(ex => ex.Booklets)
                .HasForeignKey(e => e.ExamId);
        });

        // BookletQuestion configuration
        modelBuilder.Entity<BookletQuestion>(entity =>
        {
            entity.ToTable("booklet_questions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.BookletId, e.DisplayOrder });
            entity.HasIndex(e => e.ExamQuestionId);
            
            entity.Property(e => e.OptionsOrder).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Booklet)
                .WithMany(b => b.Questions)
                .HasForeignKey(e => e.BookletId);
                
            entity.HasOne(e => e.ExamQuestion)
                .WithMany()
                .HasForeignKey(e => e.ExamQuestionId);
        });

        // ExamSession configuration
        modelBuilder.Entity<ExamSession>(entity =>
        {
            entity.ToTable("exam_sessions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ExamId });
            entity.HasIndex(e => new { e.TenantId, e.Status });
            entity.HasIndex(e => e.StartedAt);
            entity.HasIndex(e => e.SubmittedAt);
            
            entity.Property(e => e.Data).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Exam)
                .WithMany(ex => ex.Sessions)
                .HasForeignKey(e => e.ExamId);
                
            entity.HasOne(e => e.Booklet)
                .WithMany()
                .HasForeignKey(e => e.BookletId)
                .OnDelete(DeleteBehavior.SetNull);
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

