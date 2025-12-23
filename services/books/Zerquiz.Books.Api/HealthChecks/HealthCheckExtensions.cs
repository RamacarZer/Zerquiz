using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Zerquiz.Books.Api.HealthChecks;

public static class HealthCheckExtensions
{
    public static HealthCheckOptions GetHealthCheckOptions()
    {
        return new HealthCheckOptions
        {
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                
                var result = JsonSerializer.Serialize(new
                {
                    status = report.Status.ToString(),
                    timestamp = DateTime.UtcNow,
                    duration = report.TotalDuration,
                    checks = report.Entries.Select(e => new
                    {
                        name = e.Key,
                        status = e.Value.Status.ToString(),
                        description = e.Value.Description,
                        duration = e.Value.Duration,
                        exception = e.Value.Exception?.Message,
                        data = e.Value.Data
                    })
                });

                await context.Response.WriteAsync(result);
            }
        };
    }
}

