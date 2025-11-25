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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
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
        // Use public schema for simplicity
        // modelBuilder.HasDefaultSchema("questions_schema");

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

        // Seed Data - Removed from here, will use seed controller instead
        // SeedData(modelBuilder);
        
        base.OnModelCreating(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var tenantId = Guid.Parse("00000000-0000-0000-0000-000000000001"); // System tenant
        var now = DateTime.UtcNow;

        // Seed Question Format Types
        var formatTypes = new[]
        {
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                TenantId = tenantId,
                Code = "multiple_choice",
                Name = "Çoktan Seçmeli",
                Description = "Çoktan seçmeli soru formatı (A, B, C, D, E)",
                ConfigSchema = "{\"minOptions\": 2, \"maxOptions\": 5, \"allowMultipleAnswers\": false}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                TenantId = tenantId,
                Code = "true_false",
                Name = "Doğru/Yanlış",
                Description = "İki seçenekli doğru/yanlış sorusu",
                ConfigSchema = "{\"options\": [\"Doğru\", \"Yanlış\"]}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                TenantId = tenantId,
                Code = "fill_blank",
                Name = "Boşluk Doldurma",
                Description = "Metin içindeki boşlukları doldurma sorusu",
                ConfigSchema = "{\"allowMultipleBlanks\": true, \"caseSensitive\": false}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                TenantId = tenantId,
                Code = "matching",
                Name = "Eşleştirme",
                Description = "İki liste arasında eşleştirme yapma",
                ConfigSchema = "{\"minPairs\": 2, \"maxPairs\": 10, \"shuffleOptions\": true}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                TenantId = tenantId,
                Code = "short_answer",
                Name = "Kısa Cevap",
                Description = "Kısa metin cevabı gerektiren soru",
                ConfigSchema = "{\"maxLength\": 500, \"allowMultipleAnswers\": true}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                TenantId = tenantId,
                Code = "essay",
                Name = "Kompozisyon/Açık Uçlu",
                Description = "Uzun metin cevabı gerektiren soru",
                ConfigSchema = "{\"minLength\": 100, \"maxLength\": 5000}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionFormatType
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                TenantId = tenantId,
                Code = "ordering",
                Name = "Sıralama",
                Description = "Öğeleri doğru sıraya dizme",
                ConfigSchema = "{\"minItems\": 2, \"maxItems\": 10}",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            }
        };

        // Seed Pedagogical Types
        var pedagogicalTypes = new[]
        {
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000001"),
                TenantId = tenantId,
                Code = "knowledge",
                Name = "Bilgi",
                Description = "Temel bilgi ve hatırlama düzeyi (Bloom's Taksonomi - Seviye 1)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000002"),
                TenantId = tenantId,
                Code = "comprehension",
                Name = "Kavrama",
                Description = "Anlama ve yorumlama düzeyi (Bloom's Taksonomi - Seviye 2)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000003"),
                TenantId = tenantId,
                Code = "application",
                Name = "Uygulama",
                Description = "Bilgiyi yeni durumlarda kullanma (Bloom's Taksonomi - Seviye 3)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000004"),
                TenantId = tenantId,
                Code = "analysis",
                Name = "Analiz",
                Description = "Bilgiyi parçalara ayırma ve ilişkileri inceleme (Bloom's Taksonomi - Seviye 4)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000005"),
                TenantId = tenantId,
                Code = "synthesis",
                Name = "Sentez",
                Description = "Farklı bilgileri birleştirerek yeni bir bütün oluşturma (Bloom's Taksonomi - Seviye 5)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000006"),
                TenantId = tenantId,
                Code = "evaluation",
                Name = "Değerlendirme",
                Description = "Bilgiyi kriterlere göre yargılama (Bloom's Taksonomi - Seviye 6)",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000007"),
                TenantId = tenantId,
                Code = "reinforcement",
                Name = "Pekiştirme",
                Description = "Öğrenilen bilgiyi güçlendirme sorusu",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            },
            new QuestionPedagogicalType
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000008"),
                TenantId = tenantId,
                Code = "problem_solving",
                Name = "Problem Çözme",
                Description = "Karmaşık problemleri çözme becerisi gerektiren soru",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true,
                Version = 1
            }
        };

        modelBuilder.Entity<QuestionFormatType>().HasData(formatTypes);
        modelBuilder.Entity<QuestionPedagogicalType>().HasData(pedagogicalTypes);
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

