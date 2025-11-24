using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Application.DTOs;
using Zerquiz.Curriculum.Infrastructure.Persistence;
using Zerquiz.Shared.Contracts.DTOs;

namespace Zerquiz.Curriculum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController : ControllerBase
{
    private readonly CurriculumDbContext _context;

    public SubjectsController(CurriculumDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SubjectDto>>>> GetAll()
    {
        var subjects = await _context.Subjects
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Code = s.Code,
                Name = s.Name,
                DisplayOrder = s.DisplayOrder
            })
            .ToListAsync();

        return Ok(ApiResponse<List<SubjectDto>>.SuccessResult(subjects));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SubjectDto>>> GetById(Guid id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null)
            return NotFound(ApiResponse<SubjectDto>.ErrorResult("Branş bulunamadı"));

        var dto = new SubjectDto
        {
            Id = subject.Id,
            Code = subject.Code,
            Name = subject.Name,
            DisplayOrder = subject.DisplayOrder
        };

        return Ok(ApiResponse<SubjectDto>.SuccessResult(dto));
    }
}

