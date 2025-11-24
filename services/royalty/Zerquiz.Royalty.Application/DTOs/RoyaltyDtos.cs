namespace Zerquiz.Royalty.Application.DTOs;

public class WorkDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

public class RoyaltySummaryDto
{
    public Guid AuthorId { get; set; }
    public string Period { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public int TransactionCount { get; set; }
}

public class CreatePayoutRequest
{
    public Guid AuthorId { get; set; }
    public decimal Amount { get; set; }
    public string Period { get; set; } = string.Empty;
}

