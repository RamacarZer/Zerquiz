using Microsoft.EntityFrameworkCore;
using Zerquiz.Identity.Domain.Entities;
using Zerquiz.Shared.Contracts.Domain;
using System.Text.Json;

namespace Zerquiz.Identity.Infrastructure.Persistence;

public class IdentityDbContext : DbContext
{
    public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Position> Positions => Set<Position>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("identity_schema");

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Email }).IsUnique();
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.DepartmentId);
            entity.HasIndex(e => e.PositionId);
            
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(20);
            entity.Property(e => e.IdentityNumber).HasMaxLength(20);
            
            entity.Property(e => e.ProfileJson).HasColumnType("jsonb");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Ignore ModuleId from BaseEntity (not in migration)
            entity.Ignore(e => e.ModuleId);
            
            // Relations
            entity.HasOne(e => e.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.Position)
                .WithMany(p => p.Users)
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.PrimaryRole)
                .WithMany()
                .HasForeignKey(e => e.PrimaryRoleId)
                .OnDelete(DeleteBehavior.SetNull);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Role configuration
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
            entity.HasIndex(e => e.TenantId);
            
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Permissions).HasColumnType("text[]");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Ignore ModuleId from BaseEntity (not in migration)
            entity.Ignore(e => e.ModuleId);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // UserRole configuration
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("user_roles");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();
            entity.HasIndex(e => e.TenantId);
            
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Ignore ModuleId from BaseEntity (not in migration)
            entity.Ignore(e => e.ModuleId);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(e => e.UserId);
                
            entity.HasOne(e => e.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(e => e.RoleId);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // RefreshToken configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("refresh_tokens");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.ExpiresAt);
            
            entity.Property(e => e.Token).IsRequired();
            entity.Property(e => e.IpAddress).HasMaxLength(50);
            entity.Property(e => e.UserAgent).HasMaxLength(500);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId);
        });

        // Department configuration
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("departments");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.HasIndex(e => e.ParentDepartmentId);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Ignore ModuleId from BaseEntity (not in migration)
            entity.Ignore(e => e.ModuleId);
            
            entity.HasOne(e => e.ParentDepartment)
                .WithMany(d => d.SubDepartments)
                .HasForeignKey(e => e.ParentDepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // Position configuration
        modelBuilder.Entity<Position>(entity =>
        {
            entity.ToTable("positions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
            entity.HasIndex(e => e.Level);
            
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("text[]");
            
            // Ignore ModuleId from BaseEntity (not in migration)
            entity.Ignore(e => e.ModuleId);
            
            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);
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
