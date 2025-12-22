using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Zerquiz.Shared.AI.Interfaces;
using Zerquiz.Shared.AI.Models;

namespace Zerquiz.Grading.Api.Controllers;

/// <summary>
/// Writing Assistant - AI-powered writing tools
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WritingAssistantController : ControllerBase
{
    private readonly IAIProvider _aiProvider;
    private readonly ILogger<WritingAssistantController> _logger;

    public WritingAssistantController(
        IAIProvider aiProvider,
        ILogger<WritingAssistantController> logger)
    {
        _aiProvider = aiProvider;
        _logger = logger;
    }

    /// <summary>
    /// Grammar check and correction
    /// POST /api/WritingAssistant/grammar-check
    /// </summary>
    [HttpPost("grammar-check")]
    public async Task<ActionResult> GrammarCheck([FromBody] TextAnalysisRequest request)
    {
        try
        {
            var prompt = new AIPrompt
            {
                SystemMessage = "You are a professional writing assistant specialized in grammar correction.",
                UserMessage = $@"Check and correct grammar errors in the following text. Return JSON format:
{{
  ""correctedText"": ""corrected text"",
  ""errors"": [
    {{
      ""original"": ""error text"",
      ""correction"": ""corrected text"",
      ""type"": ""grammar/spelling/punctuation""
    }}
  ]
}}

Text:
{request.Text}"
            };

            var result = await _aiProvider.GenerateTextAsync(prompt);
            
            if (!result.Success)
                return StatusCode(500, new { error = "AI processing failed", message = result.Error });

            return Ok(new { data = result.Data, tokensUsed = result.TokensUsed });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in grammar check");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Improve clarity and readability
    /// POST /api/WritingAssistant/improve-clarity
    /// </summary>
    [HttpPost("improve-clarity")]
    public async Task<ActionResult> ImproveClarity([FromBody] TextAnalysisRequest request)
    {
        try
        {
            var prompt = new AIPrompt
            {
                SystemMessage = "You are a professional writing coach focused on clarity and readability.",
                UserMessage = $@"Improve the clarity and readability of the following text while maintaining its original meaning. Return JSON:
{{
  ""improvedText"": ""improved version"",
  ""suggestions"": [""suggestion 1"", ""suggestion 2""]
}}

Text:
{request.Text}"
            };

            var result = await _aiProvider.GenerateTextAsync(prompt);
            
            if (!result.Success)
                return StatusCode(500, new { error = "AI processing failed", message = result.Error });

            return Ok(new { data = result.Data, tokensUsed = result.TokensUsed });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in clarity improvement");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Adjust tone
    /// POST /api/WritingAssistant/adjust-tone
    /// </summary>
    [HttpPost("adjust-tone")]
    public async Task<ActionResult> AdjustTone([FromBody] ToneAdjustmentRequest request)
    {
        try
        {
            var prompt = new AIPrompt
            {
                SystemMessage = "You are a professional writing assistant specialized in tone adjustment.",
                UserMessage = $@"Adjust the tone of the following text to be {request.TargetTone}. Return JSON:
{{
  ""adjustedText"": ""text with adjusted tone""
}}

Text:
{request.Text}"
            };

            var result = await _aiProvider.GenerateTextAsync(prompt);
            
            if (!result.Success)
                return StatusCode(500, new { error = "AI processing failed", message = result.Error });

            return Ok(new { data = result.Data, tokensUsed = result.TokensUsed });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in tone adjustment");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Translate text
    /// POST /api/WritingAssistant/translate
    /// </summary>
    [HttpPost("translate")]
    public async Task<ActionResult> Translate([FromBody] TranslationRequest request)
    {
        try
        {
            var prompt = new AIPrompt
            {
                SystemMessage = "You are a professional translator.",
                UserMessage = $@"Translate the following text from {request.SourceLanguage} to {request.TargetLanguage}:

{request.Text}"
            };

            var result = await _aiProvider.GenerateTextAsync(prompt);
            
            if (!result.Success)
                return StatusCode(500, new { error = "AI processing failed", message = result.Error });

            return Ok(new { translatedText = result.Data, tokensUsed = result.TokensUsed });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in translation");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Analyze and grade essay
    /// POST /api/WritingAssistant/analyze-essay
    /// </summary>
    [HttpPost("analyze-essay")]
    public async Task<ActionResult> AnalyzeEssay([FromBody] EssayAnalysisRequest request)
    {
        try
        {
            var result = await _aiProvider.AnalyzeEssayAsync(request.Essay, request.Rubric ?? "");
            
            if (!result.Success || result.Data == null)
                return StatusCode(500, new { error = "AI processing failed", message = result.Error });

            return Ok(new
            {
                analysis = result.Data,
                tokensUsed = result.TokensUsed,
                model = result.Model
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in essay analysis");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }
}

// Request DTOs
public class TextAnalysisRequest
{
    public string Text { get; set; } = string.Empty;
}

public class ToneAdjustmentRequest
{
    public string Text { get; set; } = string.Empty;
    public string TargetTone { get; set; } = "professional"; // professional, casual, formal, friendly
}

public class TranslationRequest
{
    public string Text { get; set; } = string.Empty;
    public string SourceLanguage { get; set; } = "tr";
    public string TargetLanguage { get; set; } = "en";
}

public class EssayAnalysisRequest
{
    public string Essay { get; set; } = string.Empty;
    public string? Rubric { get; set; }
}

