using Microsoft.EntityFrameworkCore;
using Zerquiz.Royalty.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;
using System.Linq.Expressions;

namespace Zerquiz.Royalty.Infrastructure.Persistence;

public class RoyaltyDbContext : DbContext
{
    public RoyaltyDbContext(DbContextOptions<RoyaltyDbContext> options) : base(options)
    {
    }

    public DbSet<Work> Works => Set<Work>();
    public DbSet<WorkAuthor> WorkAuthors => Set<WorkAuthor>();
    public DbSet<RoyaltyTransaction> RoyaltyTransactions => Set<RoyaltyTransaction>();
    public DbSet<Payout> Payouts => Set<Payout>();
    public DbSet<ReviewFee> ReviewFees => Set<ReviewFee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("royalty_schema");

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

        // Work configuration
        modelBuilder.Entity<Work>(entity =>
        {
            entity.ToTable("works");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Type });
            entity.HasIndex(e => new { e.TenantId, e.PrimaryAuthorId });
            entity.HasIndex(e => e.CreatedDate);
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        // WorkAuthor configuration
        modelBuilder.Entity<WorkAuthor>(entity =>
        {
            entity.ToTable("work_authors");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.WorkId, e.AuthorId }).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.AuthorId });
            
            entity.Property(e => e.SharePercentage).HasPrecision(5, 2);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Work)
                .WithMany(w => w.Authors)
                .HasForeignKey(e => e.WorkId);
        });

        // RoyaltyTransaction configuration
        modelBuilder.Entity<RoyaltyTransaction>(entity =>
        {
            entity.ToTable("royalty_transactions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.AuthorId, e.AccruedAt });
            entity.HasIndex(e => new { e.TenantId, e.WorkId });
            entity.HasIndex(e => new { e.TenantId, e.TransactionType });
            entity.HasIndex(e => e.ReferenceId);
            
            entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10).HasDefaultValue("TRY");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Work)
                .WithMany(w => w.Transactions)
                .HasForeignKey(e => e.WorkId);
        });

        // Payout configuration
        modelBuilder.Entity<Payout>(entity =>
        {
            entity.ToTable("payouts");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.AuthorId, e.Period });
            entity.HasIndex(e => new { e.TenantId, e.Status });
            entity.HasIndex(e => e.PaidAt);
            
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10).HasDefaultValue("TRY");
            entity.Property(e => e.Period).IsRequired().HasMaxLength(20);
            entity.Property(e => e.PaymentReference).HasMaxLength(200);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        // ReviewFee configuration
        modelBuilder.Entity<ReviewFee>(entity =>
        {
            entity.ToTable("review_fees");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.QuestionReviewId);
            entity.HasIndex(e => new { e.TenantId, e.ReviewerId });
            entity.HasIndex(e => new { e.TenantId, e.Status });
            entity.HasIndex(e => e.PaidAt);
            
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
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
