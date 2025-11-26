using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zerquiz.Grading.Domain.Entities;
using Zerquiz.Grading.Infrastructure.Persistence;

namespace Zerquiz.Grading.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificatesController : ControllerBase
{
    private readonly GradingDbContext _context;
    private readonly ILogger<CertificatesController> _logger;

    public CertificatesController(GradingDbContext context, ILogger<CertificatesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get user's certificates
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult> GetUserCertificates(Guid userId)
    {
        var certificates = await _context.Certificates
            .Include(c => c.ExamResult)
            .Where(c => c.UserId == userId && !c.IsRevoked)
            .OrderByDescending(c => c.IssuedAt)
            .Select(c => new
            {
                c.Id,
                c.CertificateNumber,
                c.IssuedAt,
                c.Grade,
                c.Score,
                c.PdfUrl,
                c.VerifyUrl,
                c.DownloadCount,
                ExamName = c.ExamResult.ExamName ?? "Exam"
            })
            .ToListAsync();

        return Ok(certificates);
    }

    /// <summary>
    /// Verify certificate (public endpoint)
    /// </summary>
    [HttpGet("verify/{token}")]
    public async Task<ActionResult> Verify(string token)
    {
        var certificate = await _context.Certificates
            .Include(c => c.ExamResult)
            .FirstOrDefaultAsync(c => c.VerifyToken == token);

        if (certificate == null)
            return NotFound(new { valid = false, message = "Certificate not found" });

        if (certificate.IsRevoked)
            return Ok(new
            {
                valid = false,
                revoked = true,
                message = "Certificate has been revoked",
                revokedAt = certificate.RevokedAt,
                reason = certificate.RevocationReason
            });

        // Track verification
        certificate.LastVerifiedAt = DateTime.UtcNow;
        certificate.VerificationCount++;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            valid = true,
            certificateNumber = certificate.CertificateNumber,
            issuedAt = certificate.IssuedAt,
            userId = certificate.UserId,
            grade = certificate.Grade,
            score = certificate.Score,
            verificationCount = certificate.VerificationCount
        });
    }

    /// <summary>
    /// Download certificate PDF
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<ActionResult> Download(Guid id)
    {
        var certificate = await _context.Certificates.FindAsync(id);
        if (certificate == null)
            return NotFound();

        if (certificate.IsRevoked)
            return BadRequest("Certificate has been revoked");

        certificate.DownloadCount++;
        if (certificate.DownloadedAt == null)
            certificate.DownloadedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (string.IsNullOrEmpty(certificate.PdfUrl))
            return NotFound("PDF not generated");

        return Ok(new { url = certificate.PdfUrl, downloadCount = certificate.DownloadCount });
    }
}

