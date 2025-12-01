using Microsoft.EntityFrameworkCore;
using Zerquiz.Lessons.Domain.Entities;

namespace Zerquiz.Lessons.Infrastructure.Persistence;

public class LessonsDbContext : DbContext
{
    public LessonsDbContext(DbContextOptions<LessonsDbContext> options) : base(options)
    {
    }

    public DbSet<LessonPlan> LessonPlans { get; set; }
    public DbSet<LessonActivity> LessonActivities { get; set; }
    public DbSet<LessonTemplate> LessonTemplates { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }
    public DbSet<Worksheet> Worksheets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("lessons");

        // LessonPlan Configuration
        modelBuilder.Entity<LessonPlan>(entity =>
        {
            entity.ToTable("lesson_plans");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Subject).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Grade).HasMaxLength(20);
            entity.Property(e => e.TenantId).IsRequired();
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.GenerationSource).HasMaxLength(20);
            entity.Property(e => e.Objectives).HasColumnType("jsonb");
            entity.Property(e => e.MaterialsNeeded).HasColumnType("jsonb");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CreatedBy);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.TenantId, e.Status, e.CreatedAt });

            entity.HasMany(e => e.Activities)
                .WithOne()
                .HasForeignKey("LessonPlanId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        // LessonActivity Configuration
        modelBuilder.Entity<LessonActivity>(entity =>
        {
            entity.ToTable("lesson_activities");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.LessonPlanId).IsRequired();
            entity.Property(e => e.ActivityType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Instructions).HasColumnType("text");
            entity.Property(e => e.Duration).IsRequired();
            entity.Property(e => e.DisplayOrder).IsRequired();

            entity.HasIndex(e => e.LessonPlanId);
            entity.HasIndex(e => new { e.LessonPlanId, e.DisplayOrder });
        });

        // LessonTemplate Configuration
        modelBuilder.Entity<LessonTemplate>(entity =>
        {
            entity.ToTable("lesson_templates");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Structure).HasColumnType("jsonb");
            entity.Property(e => e.IsSystemReserved).HasDefaultValue(false);

            entity.HasIndex(e => e.Code).IsUnique();
        });

        // Assignment Configuration
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.ToTable("assignments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.TenantId).IsRequired();
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Instructions).HasColumnType("text");
            entity.Property(e => e.AssignmentType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.AttachedResources).HasColumnType("jsonb");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CreatedBy);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.DueDate);
            entity.HasIndex(e => new { e.TenantId, e.Status, e.DueDate });

            entity.HasMany(e => e.Submissions)
                .WithOne()
                .HasForeignKey("AssignmentId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        // AssignmentSubmission Configuration
        modelBuilder.Entity<AssignmentSubmission>(entity =>
        {
            entity.ToTable("assignment_submissions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.AssignmentId).IsRequired();
            entity.Property(e => e.StudentId).IsRequired();
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.SubmissionText).HasColumnType("text");
            entity.Property(e => e.SubmissionFiles).HasColumnType("jsonb");
            entity.Property(e => e.Feedback).HasColumnType("text");
            entity.Property(e => e.RubricScores).HasColumnType("jsonb");
            entity.Property(e => e.SubmittedAt).HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.AssignmentId);
            entity.HasIndex(e => e.StudentId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.AssignmentId, e.StudentId }).IsUnique();
        });

        // Worksheet Configuration
        modelBuilder.Entity<Worksheet>(entity =>
        {
            entity.ToTable("worksheets");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.TenantId).IsRequired();
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.ContentItemId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Instructions).HasColumnType("text");
            entity.Property(e => e.Questions).HasColumnType("jsonb");
            entity.Property(e => e.AnswerKey).HasColumnType("jsonb");
            entity.Property(e => e.Format).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.ContentItemId);
            entity.HasIndex(e => e.CreatedBy);
        });

        // Seed Lesson Templates
        SeedLessonTemplates(modelBuilder);
    }

    private void SeedLessonTemplates(ModelBuilder modelBuilder)
    {
        var templates = new[]
        {
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Code = "5e_model",
                Name = "5E Model",
                Description = "A constructivist teaching approach with 5 phases: Engage, Explore, Explain, Elaborate, and Evaluate.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Engage", duration = 10, description = "Hook students and assess prior knowledge" },
                        new { name = "Explore", duration = 20, description = "Hands-on activities and exploration" },
                        new { name = "Explain", duration = 15, description = "Concept explanation and vocabulary" },
                        new { name = "Elaborate", duration = 20, description = "Apply knowledge to new situations" },
                        new { name = "Evaluate", duration = 10, description = "Assessment and reflection" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Code = "project_based",
                Name = "Project-Based Learning",
                Description = "Students learn by actively engaging in real-world and personally meaningful projects.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Problem Introduction", duration = 45, description = "Present the problem or challenge" },
                        new { name = "Research & Planning", duration = 180, description = "Research and develop project plan" },
                        new { name = "Design & Development", duration = 360, description = "Create and build the project" },
                        new { name = "Presentation", duration = 90, description = "Present findings and projects" },
                        new { name = "Reflection", duration = 45, description = "Reflect on learning and process" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Code = "flipped_classroom",
                Name = "Flipped Classroom",
                Description = "Students learn content at home and apply knowledge through active learning in class.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Pre-class (Video/Reading)", duration = 0, description = "At home: Watch video or read materials" },
                        new { name = "In-class (Active Learning)", duration = 40, description = "Problem-solving and activities" },
                        new { name = "Post-class (Practice)", duration = 0, description = "Homework: Apply and practice" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Code = "traditional",
                Name = "Direct Instruction",
                Description = "Teacher-centered approach with clear explanation and guided practice.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Warm-up/Review", duration = 5, description = "Review previous lesson" },
                        new { name = "Present New Material", duration = 20, description = "Explain new concepts" },
                        new { name = "Guided Practice", duration = 10, description = "Practice with teacher support" },
                        new { name = "Independent Practice", duration = 10, description = "Students work independently" },
                        new { name = "Closure & Assessment", duration = 5, description = "Summary and exit ticket" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                Code = "inquiry_based",
                Name = "Inquiry-Based Learning",
                Description = "Students construct knowledge through asking questions and investigating.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Question Formation", duration = 15, description = "Develop inquiry questions" },
                        new { name = "Investigation", duration = 30, description = "Research and explore" },
                        new { name = "Analysis", duration = 20, description = "Analyze findings" },
                        new { name = "Conclusion", duration = 10, description = "Draw conclusions and share" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                Code = "jigsaw",
                Name = "Jigsaw Cooperative Learning",
                Description = "Students become experts on one part and teach others in a structured group activity.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Home Groups Formation", duration = 5, description = "Form home groups" },
                        new { name = "Expert Groups Study", duration = 20, description = "Study specific topics" },
                        new { name = "Return to Home Groups", duration = 25, description = "Teach others" },
                        new { name = "Assessment", duration = 10, description = "Individual or group assessment" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                Code = "socratic",
                Name = "Socratic Seminar",
                Description = "Dialogue-based learning where students ask and answer questions to explore ideas.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Pre-reading", duration = 0, description = "Homework: Read text" },
                        new { name = "Opening Question", duration = 5, description = "Teacher poses opening question" },
                        new { name = "Discussion", duration = 30, description = "Student-led dialogue" },
                        new { name = "Reflection", duration = 10, description = "Written reflection" }
                    }
                }),
                IsSystemReserved = true
            },
            new LessonTemplate
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000008"),
                Code = "problem_solving",
                Name = "Problem-Solving Workshop",
                Description = "Hands-on approach where students work through real problems with guidance.",
                Structure = System.Text.Json.JsonSerializer.Serialize(new
                {
                    phases = new[]
                    {
                        new { name = "Problem Presentation", duration = 10, description = "Present the problem" },
                        new { name = "Independent Attempt", duration = 15, description = "Try to solve individually" },
                        new { name = "Group Discussion", duration = 20, description = "Discuss strategies" },
                        new { name = "Solution Review", duration = 15, description = "Review and reflect" }
                    }
                }),
                IsSystemReserved = true
            }
        };

        modelBuilder.Entity<LessonTemplate>().HasData(templates);
    }
}
