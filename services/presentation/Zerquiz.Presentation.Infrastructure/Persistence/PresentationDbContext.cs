using Microsoft.EntityFrameworkCore;
using Zerquiz.Presentation.Domain.Entities;
using PresentationEntity = Zerquiz.Presentation.Domain.Entities.Presentation;

namespace Zerquiz.Presentation.Infrastructure.Persistence;

public class PresentationDbContext : DbContext
{
    public PresentationDbContext(DbContextOptions<PresentationDbContext> options)
        : base(options)
    {
    }

    public DbSet<PresentationEntity> Presentations => Set<PresentationEntity>();
    public DbSet<Slide> Slides => Set<Slide>();
    public DbSet<PresentationSession> PresentationSessions => Set<PresentationSession>();
    public DbSet<SessionAttendee> SessionAttendees => Set<SessionAttendee>();
    public DbSet<SlideInteraction> SlideInteractions => Set<SlideInteraction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Schema
        modelBuilder.HasDefaultSchema("presentation_schema");

        // Presentation
        modelBuilder.Entity<PresentationEntity>(entity =>
        {
            entity.ToTable("presentations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Theme).HasMaxLength(50);
            entity.Property(e => e.LiveCode).HasMaxLength(10);
            
            entity.HasIndex(e => e.LiveCode).IsUnique().HasFilter("\"LiveCode\" IS NOT NULL");
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.HasMany(e => e.Slides)
                .WithOne(s => s.Presentation)
                .HasForeignKey(s => s.PresentationId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Sessions)
                .WithOne(s => s.Presentation)
                .HasForeignKey(s => s.PresentationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Slide
        modelBuilder.Entity<Slide>(entity =>
        {
            entity.ToTable("slides");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).HasConversion<string>().IsRequired();
            entity.Property(e => e.Title).HasMaxLength(300);
            entity.Property(e => e.Transition).HasMaxLength(50);
            
            entity.HasIndex(e => new { e.PresentationId, e.Order });
        });

        // PresentationSession
        modelBuilder.Entity<PresentationSession>(entity =>
        {
            entity.ToTable("presentation_sessions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SessionCode).HasMaxLength(10);
            
            entity.HasIndex(e => e.SessionCode).IsUnique().HasFilter("\"SessionCode\" IS NOT NULL");
            entity.HasIndex(e => e.IsActive);
            
            entity.HasMany(e => e.Attendees)
                .WithOne(a => a.Session)
                .HasForeignKey(a => a.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Interactions)
                .WithOne(i => i.Session)
                .HasForeignKey(i => i.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // SessionAttendee
        modelBuilder.Entity<SessionAttendee>(entity =>
        {
            entity.ToTable("session_attendees");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserName).HasMaxLength(100);
            
            entity.HasIndex(e => new { e.SessionId, e.UserId });
        });

        // SlideInteraction
        modelBuilder.Entity<SlideInteraction>(entity =>
        {
            entity.ToTable("slide_interactions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.InteractionType).HasMaxLength(50);
            
            entity.HasIndex(e => new { e.SessionId, e.SlideId, e.UserId });
        });
    }
}

