using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Domain.Entities;
using Zerquiz.Curriculum.Infrastructure.Persistence;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/quick-seed")]
public class QuickSeedController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public QuickSeedController(CurriculumDbContext context)
    {
        _context = context;
    }

    [HttpPost("all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var now = DateTime.UtcNow;

            // 1. Education Model
            var eduModelId = Guid.Parse("70000000-0000-0000-0000-000000000001");
            if (!await _context.EducationModels.AnyAsync(e => e.Id == eduModelId))
            {
                _context.EducationModels.Add(new EducationModel
                {
                    Id = eduModelId,
                    TenantId = tenantId,
                    Code = "TR_MEB",
                    Name = "MEB Müfredatı",
                    Country = "Türkiye",
                    Description = "T.C. Milli Eğitim Bakanlığı Müfredatı",
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                });
            }

            // 2. Subjects
            var subjects = new[]
            {
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Matematik", Code = "MAT", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Türkçe", Code = "TUR", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Fen Bilimleri", Code = "FEN", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Name = "İngilizce", Code = "ENG", IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Subject { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Sosyal Bilgiler", Code = "SOS", IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            foreach (var subject in subjects)
            {
                if (!await _context.Subjects.AnyAsync(s => s.Code == subject.Code))
                {
                    _context.Subjects.Add(subject);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Quick seed completed!",
                educationModels = await _context.EducationModels.CountAsync(),
                subjects = await _context.Subjects.CountAsync()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
        }
    }
}

