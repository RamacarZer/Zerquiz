using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using Zerquiz.Books.Infrastructure.Persistence;
using Zerquiz.Books.Api.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Zerquiz Books API", Version = "v1" });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("BooksDatabase") 
    ?? "Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_books;Password=books_pass_2024";
builder.Services.AddDbContext<BooksDbContext>(options =>
    options.UseNpgsql(connectionString));

// Health Checks
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database", 
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "db", "sql", "postgresql" })
    .AddCheck("self", () => HealthCheckResult.Healthy("Books service is running"), 
        tags: new[] { "api" });

// Resilience & HTTP
builder.Services.AddSingleton<Zerquiz.Shared.Resilience.ResiliencePolicy>();
builder.Services.AddHttpClient<Zerquiz.Shared.Http.ResilientHttpClient>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database and schema exist
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BooksDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Ensuring Books database schema exists...");
        await context.Database.ExecuteSqlRawAsync("CREATE SCHEMA IF NOT EXISTS books_schema");
        logger.LogInformation("Running Books database migrations...");
        await context.Database.MigrateAsync();
        logger.LogInformation("Books database ready!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the Books database.");
    }
}

// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Books API v1"); });
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Health check endpoints
app.MapHealthChecks("/health", HealthCheckExtensions.GetHealthCheckOptions());
app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("db")
});
app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("api")
});

app.Run();

