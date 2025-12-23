using Microsoft.EntityFrameworkCore;
using Zerquiz.Books.Domain.Entities;

namespace Zerquiz.Books.Infrastructure.Persistence;

public class BooksDbContext : DbContext
{
    public BooksDbContext(DbContextOptions<BooksDbContext> options) : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }
    public DbSet<BookChapter> BookChapters { get; set; }
    public DbSet<BookAsset> BookAssets { get; set; }
    public DbSet<BookExport> BookExports { get; set; }
    public DbSet<ReaderProgress> ReaderProgress { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<Highlight> Highlights { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Set schema
        modelBuilder.HasDefaultSchema("books_schema");

        // Book
        modelBuilder.Entity<Book>(entity =>
        {
            entity.ToTable("books");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.BookType);
            entity.HasIndex(e => e.WorkflowStatus);
            entity.HasIndex(e => e.ISBN);
            entity.HasIndex(e => e.PublishedAt);
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.BookType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.WorkflowStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ISBN).HasMaxLength(20);
            entity.Property(e => e.Language).HasMaxLength(10);
            
            entity.Property(e => e.Authors).HasColumnType("text[]");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            
            entity.HasMany(e => e.Chapters)
                .WithOne(e => e.Book)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Assets)
                .WithOne(e => e.Book)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Exports)
                .WithOne(e => e.Book)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // BookChapter
        modelBuilder.Entity<BookChapter>(entity =>
        {
            entity.ToTable("book_chapters");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.ParentChapterId);
            entity.HasIndex(e => e.DisplayOrder);
            entity.HasIndex(e => e.TopicId);
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.LearningOutcomeIds).HasColumnType("text[]");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            
            entity.HasOne(e => e.ParentChapter)
                .WithMany(e => e.SubChapters)
                .HasForeignKey(e => e.ParentChapterId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasMany(e => e.Bookmarks)
                .WithOne(e => e.Chapter)
                .HasForeignKey(e => e.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Highlights)
                .WithOne(e => e.Chapter)
                .HasForeignKey(e => e.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // BookAsset
        modelBuilder.Entity<BookAsset>(entity =>
        {
            entity.ToTable("book_assets");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.ChapterId);
            entity.HasIndex(e => e.AssetType);
            
            entity.Property(e => e.AssetType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.FileKey).IsRequired().HasMaxLength(500);
            entity.Property(e => e.MimeType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
        });

        // BookExport
        modelBuilder.Entity<BookExport>(entity =>
        {
            entity.ToTable("book_exports");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.Format);
            entity.HasIndex(e => e.ExportStatus);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.Property(e => e.Format).IsRequired().HasMaxLength(20);
            entity.Property(e => e.ExportStatus).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ExportSettings).HasColumnType("jsonb");
            entity.Property(e => e.ValidationErrors).HasColumnType("text[]");
        });

        // ReaderProgress
        modelBuilder.Entity<ReaderProgress>(entity =>
        {
            entity.ToTable("reader_progress");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.BookId }).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.LastReadAt);
            
            entity.Property(e => e.ReadingSettings).HasColumnType("jsonb");
        });

        // Bookmark
        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.ToTable("bookmarks");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.ChapterId);
            entity.HasIndex(e => new { e.UserId, e.BookId, e.ChapterId });
            
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Color).HasMaxLength(20);
        });

        // Highlight
        modelBuilder.Entity<Highlight>(entity =>
        {
            entity.ToTable("highlights");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.BookId);
            entity.HasIndex(e => e.ChapterId);
            entity.HasIndex(e => new { e.UserId, e.BookId, e.ChapterId });
            
            entity.Property(e => e.SelectedText).IsRequired();
            entity.Property(e => e.Color).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Style).HasMaxLength(50);
        });
    }
}

