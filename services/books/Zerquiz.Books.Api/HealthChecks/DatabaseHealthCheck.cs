using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Zerquiz.Books.Infrastructure.Persistence;

namespace Zerquiz.Books.Api.HealthChecks;

/// <summary>
/// Health check for Books database connection
/// </summary>
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly BooksDbContext _context;

    public DatabaseHealthCheck(BooksDbContext context)
    {
        _context = context;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Try to execute a simple query
            await _context.Database.CanConnectAsync(cancellationToken);
            
            var bookCount = await _context.Books.CountAsync(cancellationToken);
            
            return HealthCheckResult.Healthy(
                $"Database is healthy. Books count: {bookCount}",
                new Dictionary<string, object>
                {
                    { "database", "books_schema" },
                    { "bookCount", bookCount },
                    { "timestamp", DateTime.UtcNow }
                });
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                "Database connection failed",
                ex,
                new Dictionary<string, object>
                {
                    { "database", "books_schema" },
                    { "error", ex.Message }
                });
        }
    }
}

