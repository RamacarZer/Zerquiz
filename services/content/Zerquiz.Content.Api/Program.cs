using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using Zerquiz.Content.Infrastructure.Persistence;
using Zerquiz.Content.Infrastructure.Services;
using Zerquiz.Shared.AI.Providers;
using Zerquiz.Shared.AI.Models;
using Zerquiz.Shared.AI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Zerquiz Content API", Version = "v1" });
});

// Database
builder.Services.AddDbContext<ContentDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ContentDatabase")));

// Services
builder.Services.AddScoped<PdfExtractionService>();

// AI Provider
builder.Services.AddHttpClient(); // For LocalLLM provider
builder.Services.AddSingleton<AIProviderFactory>();
builder.Services.AddScoped<IAIProvider>(sp =>
{
    var factory = sp.GetRequiredService<AIProviderFactory>();
    var config = new AIConfig
    {
        Provider = builder.Configuration["AI:Provider"] ?? "openai",
        ApiKey = builder.Configuration["AI:ApiKey"] ?? "",
        Model = builder.Configuration["AI:Model"] ?? "gpt-4o",
        Temperature = double.TryParse(builder.Configuration["AI:Temperature"], out var temp) ? temp : 0.7,
        MaxTokens = int.TryParse(builder.Configuration["AI:MaxTokens"], out var tokens) ? tokens : 2000,
        Endpoint = builder.Configuration["AI:Endpoint"]
    };
    return factory.CreateProvider(config);
});

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
    var context = scope.ServiceProvider.GetRequiredService<ContentDbContext>();
    try
    {
        await context.Database.EnsureCreatedAsync();
        await context.Database.ExecuteSqlRawAsync("CREATE SCHEMA IF NOT EXISTS content_schema");
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// HTTP pipeline
app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Content API v1"); });

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();

