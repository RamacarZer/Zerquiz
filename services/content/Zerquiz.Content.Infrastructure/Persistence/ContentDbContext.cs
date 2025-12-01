using Microsoft.EntityFrameworkCore;
using Zerquiz.Content.Domain.Entities;

namespace Zerquiz.Content.Infrastructure.Persistence;

public class ContentDbContext : DbContext
{
    public ContentDbContext(DbContextOptions<ContentDbContext> options) : base(options)
    {
    }

    public DbSet<ContentItem> ContentItems { get; set; }
    public DbSet<ContentMetadata> ContentMetadata { get; set; }
    public DbSet<GeneratedContent> GeneratedContents { get; set; }
    public DbSet<ContentTemplate> ContentTemplates { get; set; }
    public DbSet<GenerationJob> GenerationJobs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Set schema
        modelBuilder.HasDefaultSchema("content_schema");

        // ContentItem
        modelBuilder.Entity<ContentItem>(entity =>
        {
            entity.ToTable("ContentItems");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.ProcessingStatus);
            entity.HasIndex(e => e.ContentType);
            entity.Property(e => e.Tags).HasColumnType("text[]");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
        });

        // ContentMetadata
        modelBuilder.Entity<ContentMetadata>(entity =>
        {
            entity.ToTable("ContentMetadata");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ContentItemId);
            entity.Property(e => e.KeyConcepts).HasColumnType("text[]");
            entity.HasOne(e => e.ContentItem)
                .WithOne(e => e.ExtractedMetadata)
                .HasForeignKey<ContentMetadata>(e => e.ContentItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // GeneratedContent
        modelBuilder.Entity<GeneratedContent>(entity =>
        {
            entity.ToTable("GeneratedContents");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ContentItemId);
            entity.HasIndex(e => e.GenerationType);
            entity.HasIndex(e => e.GenerationStatus);
            entity.Property(e => e.GeneratedData).HasColumnType("jsonb");
            entity.HasOne(e => e.ContentItem)
                .WithMany(e => e.GeneratedContents)
                .HasForeignKey(e => e.ContentItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ContentTemplate
        modelBuilder.Entity<ContentTemplate>(entity =>
        {
            entity.ToTable("content_templates");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.QuestionTypeCode);
            entity.HasIndex(e => e.IsActive);
            entity.Property(e => e.ValidationRules).HasColumnType("jsonb");
            entity.Property(e => e.ExampleOutput).HasColumnType("jsonb");
        });

        // GenerationJob
        modelBuilder.Entity<GenerationJob>(entity =>
        {
            entity.ToTable("generation_jobs");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ContentItemId);
            entity.HasIndex(e => e.Status);
            entity.Property(e => e.Configuration).HasColumnType("jsonb");
            entity.HasOne(e => e.ContentItem)
                .WithMany()
                .HasForeignKey(e => e.ContentItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

