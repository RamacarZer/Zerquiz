using Microsoft.EntityFrameworkCore;
using Zerquiz.Finance.Domain.Entities;

namespace Zerquiz.Finance.Infrastructure.Persistence;

public class FinanceDbContext : DbContext
{
    public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
    {
    }

    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<SubscriptionPlan> SubscriptionPlans => Set<SubscriptionPlan>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PriceItem> PriceItems => Set<PriceItem>();
    public DbSet<UsageQuota> UsageQuotas => Set<UsageQuota>();
    public DbSet<QuotaUsage> QuotaUsages => Set<QuotaUsage>();
    public DbSet<RevenueSplitRule> RevenueSplitRules => Set<RevenueSplitRule>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Set schema
        modelBuilder.HasDefaultSchema("finance_schema");

        // ========== SUBSCRIPTION PLAN ==========
        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.ToTable("subscription_plans");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.MonthlyPrice).HasPrecision(18, 2);
            entity.Property(e => e.YearlyPrice).HasPrecision(18, 2);
            entity.Property(e => e.Features).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== SUBSCRIPTION ==========
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("subscriptions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.SubscriptionStatus });
            entity.HasIndex(e => e.EndDate);
            
            entity.Property(e => e.SubscriptionStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.BillingCycle).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.MonthlyFee).HasPrecision(18, 2);
            entity.Property(e => e.BillingInfo).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Plan)
                .WithMany(p => p.Subscriptions)
                .HasForeignKey(e => e.PlanId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== PAYMENT ==========
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("payments");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TransactionId).IsUnique();
            entity.HasIndex(e => new { e.TenantId, e.PaymentStatus });
            
            entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PaymentStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.PaymentData).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Subscription)
                .WithMany(s => s.Payments)
                .HasForeignKey(e => e.SubscriptionId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== PRICE ITEM ==========
        modelBuilder.Entity<PriceItem>(entity =>
        {
            entity.ToTable("price_items");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.BasePrice).HasPrecision(18, 2);
            entity.Property(e => e.PricingTiers).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== USAGE QUOTA ==========
        modelBuilder.Entity<UsageQuota>(entity =>
        {
            entity.ToTable("usage_quotas");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.ResourceType, e.SubscriptionId });
            
            entity.Property(e => e.ResourceType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Period).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Subscription)
                .WithMany()
                .HasForeignKey(e => e.SubscriptionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== QUOTA USAGE ==========
        modelBuilder.Entity<QuotaUsage>(entity =>
        {
            entity.ToTable("quota_usages");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.QuotaId, e.RecordedAt });
            
            entity.Property(e => e.UsageDetails).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasOne(e => e.Quota)
                .WithMany(q => q.Usages)
                .HasForeignKey(e => e.QuotaId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ========== REVENUE SPLIT RULE ==========
        modelBuilder.Entity<RevenueSplitRule>(entity =>
        {
            entity.ToTable("revenue_split_rules");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TransactionType, e.EffectiveFrom, e.EffectiveTo });
            
            entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PlatformPercent).HasPrecision(5, 2);
            entity.Property(e => e.TenantPercent).HasPrecision(5, 2);
            entity.Property(e => e.AuthorPercent).HasPrecision(5, 2);
            entity.Property(e => e.ReviewerPercent).HasPrecision(5, 2);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });
    }
}

