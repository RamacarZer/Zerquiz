using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using Microsoft.Extensions.Logging;

namespace Zerquiz.Content.Infrastructure.Services;

/// <summary>
/// PDF text extraction service using iText7
/// </summary>
public class PdfExtractionService
{
    private readonly ILogger<PdfExtractionService> _logger;

    public PdfExtractionService(ILogger<PdfExtractionService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Extract text from PDF file
    /// </summary>
    public async Task<string> ExtractTextAsync(string filePath)
    {
        try
        {
            return await Task.Run(() =>
            {
                using var pdfReader = new PdfReader(filePath);
                using var pdfDocument = new PdfDocument(pdfReader);
                
                var text = new System.Text.StringBuilder();
                
                for (int page = 1; page <= pdfDocument.GetNumberOfPages(); page++)
                {
                    var strategy = new LocationTextExtractionStrategy();
                    var pageText = PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page), strategy);
                    text.AppendLine(pageText);
                }
                
                return text.ToString();
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting text from PDF: {FilePath}", filePath);
            throw;
        }
    }

    /// <summary>
    /// Get PDF page count
    /// </summary>
    public int GetPageCount(string filePath)
    {
        try
        {
            using var pdfReader = new PdfReader(filePath);
            using var pdfDocument = new PdfDocument(pdfReader);
            return pdfDocument.GetNumberOfPages();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting page count from PDF: {FilePath}", filePath);
            return 0;
        }
    }
}

