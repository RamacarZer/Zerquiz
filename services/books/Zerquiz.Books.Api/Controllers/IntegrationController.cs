using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Zerquiz.Shared.Http;

namespace Zerquiz.Books.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntegrationController : ControllerBase
{
    private readonly ILogger<IntegrationController> _logger;
    private readonly ResilientHttpClient _resilientClient;

    public IntegrationController(
        ILogger<IntegrationController> logger,
        ResilientHttpClient resilientClient)
    {
        _logger = logger;
        _resilientClient = resilientClient;
    }

    /// <summary>
    /// Example: Enriching book with curriculum data (resilient call)
    /// If curriculum service is down, book creation still works
    /// </summary>
    [HttpGet("enrich-with-curriculum/{bookId}")]
    public async Task<IActionResult> EnrichWithCurriculum(Guid bookId)
    {
        try
        {
            // Call curriculum service with fallback
            var curriculumData = await _resilientClient.GetAsync<CurriculumDataDto>(
                $"http://curriculum:5002/api/curriculum/{bookId}",
                fallbackValue: new CurriculumDataDto 
                { 
                    Message = "Curriculum service unavailable",
                    IsFallback = true 
                }
            );

            if (curriculumData?.IsFallback == true)
            {
                _logger.LogWarning("Using fallback curriculum data for book {BookId}", bookId);
                return Ok(new 
                { 
                    bookId, 
                    curriculum = "unavailable", 
                    message = "Book enrichment skipped due to service unavailability" 
                });
            }

            return Ok(new { bookId, curriculum = curriculumData });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enriching book {BookId}", bookId);
            return StatusCode(500, new { error = "Enrichment failed", details = ex.Message });
        }
    }

    /// <summary>
    /// Example: Getting word definition from dictionary service (resilient call)
    /// </summary>
    [HttpGet("word-lookup/{word}")]
    public async Task<IActionResult> LookupWord(string word)
    {
        var definition = await _resilientClient.GetAsync<WordDefinitionDto>(
            $"http://dictionary:5011/api/dictionary/lookup?word={word}",
            fallbackValue: new WordDefinitionDto 
            { 
                Word = word, 
                Definition = "Definition unavailable - dictionary service is down",
                IsFallback = true 
            }
        );

        return Ok(definition);
    }

    /// <summary>
    /// Check health of all dependent services
    /// </summary>
    [HttpGet("health/dependencies")]
    public async Task<IActionResult> CheckDependencies()
    {
        var dependencies = new
        {
            curriculum = await _resilientClient.IsServiceHealthyAsync("http://curriculum:5002"),
            dictionary = await _resilientClient.IsServiceHealthyAsync("http://dictionary:5011"),
            content = await _resilientClient.IsServiceHealthyAsync("http://content:5003"),
            identity = await _resilientClient.IsServiceHealthyAsync("http://identity:5001"),
            timestamp = DateTime.UtcNow
        };

        return Ok(dependencies);
    }

    // DTOs
    public class CurriculumDataDto
    {
        public string? Message { get; set; }
        public bool IsFallback { get; set; }
    }

    public class WordDefinitionDto
    {
        public string Word { get; set; } = string.Empty;
        public string? Definition { get; set; }
        public bool IsFallback { get; set; }
    }
}

