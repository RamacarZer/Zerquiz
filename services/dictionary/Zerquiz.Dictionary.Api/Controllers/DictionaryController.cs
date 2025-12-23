using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Zerquiz.Dictionary.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DictionaryController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<DictionaryController> _logger;

    public DictionaryController(IHttpClientFactory httpClientFactory, ILogger<DictionaryController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    /// <summary>
    /// Lookup word definition (external API fallback)
    /// </summary>
    [HttpGet("lookup")]
    public async Task<ActionResult> LookupWord([FromQuery] string word, [FromQuery] string lang = "en")
    {
        try
        {
            if (string.IsNullOrWhiteSpace(word))
                return BadRequest(new { error = "Word is required" });

            // Try external API first
            var definition = await FetchFromExternalAPI(word, lang);
            
            if (definition != null)
                return Ok(definition);

            return NotFound(new { error = "Word not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error looking up word: {Word}", word);
            return StatusCode(500, new { error = "Failed to lookup word" });
        }
    }

    private async Task<object?> FetchFromExternalAPI(string word, string lang)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            
            if (lang == "en")
            {
                // Free Dictionary API
                var response = await client.GetAsync($"https://api.dictionaryapi.dev/api/v2/entries/en/{word}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<JsonElement>(json);
                    
                    if (data.ValueKind == JsonValueKind.Array && data.GetArrayLength() > 0)
                    {
                        var entry = data[0];
                        var meaning = entry.GetProperty("meanings")[0];
                        var definition = meaning.GetProperty("definitions")[0];
                        
                        return new
                        {
                            word,
                            language = lang,
                            pronunciation = entry.TryGetProperty("phonetic", out var phonetic) ? phonetic.GetString() : null,
                            definition = definition.GetProperty("definition").GetString(),
                            partOfSpeech = meaning.GetProperty("partOfSpeech").GetString(),
                            example = definition.TryGetProperty("example", out var ex) ? ex.GetString() : null
                        };
                    }
                }
            }
            else if (lang == "tr")
            {
                // TDK API (Turkish Dictionary)
                var response = await client.GetAsync($"https://sozluk.gov.tr/gts?ara={word}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    // Parse TDK response (simplified)
                    return new
                    {
                        word,
                        language = lang,
                        definition = "TDK definition here (implement parsing)",
                        source = "TDK"
                    };
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "External API call failed for word: {Word}", word);
            return null;
        }
    }
}

