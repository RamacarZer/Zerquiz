using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Zerquiz.Lessons.Infrastructure.Persistence;
using Zerquiz.Shared.AI.Providers;
using Zerquiz.Shared.AI.Models;
using Zerquiz.Shared.AI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Zerquiz Lessons API", Version = "v1" });
});

// Database
builder.Services.AddDbContext<LessonsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? ""))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LessonsDbContext>();
    try
    {
        await context.Database.EnsureCreatedAsync();
        await context.Database.ExecuteSqlRawAsync("CREATE SCHEMA IF NOT EXISTS lessons_schema");
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lessons API v1"); });

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
