using Microsoft.EntityFrameworkCore;
using Zerquiz.Core.Application.Interfaces;
using Zerquiz.Core.Infrastructure.Persistence;
using Zerquiz.Core.Infrastructure.Services;
// TEMPORARY: Disabled due to missing shared libraries
// using Zerquiz.Shared.Storage;
// using Zerquiz.Shared.Notifications;
// using Zerquiz.Shared.Reporting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "Zerquiz Core API", 
        Version = "v1",
        Description = "Multi-Tenant and Audit Management API"
    });
});

// Database
builder.Services.AddDbContext<CoreDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<IAuditService, AuditService>();

// TEMPORARY: Disabled shared services due to missing libraries
/*
// Shared Services
builder.Services.AddSingleton<IStorageService>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<LocalStorageService>>();
    var config = sp.GetRequiredService<IConfiguration>();
    return new LocalStorageService(config);
});
builder.Services.AddSingleton<INotificationService, LocalNotificationService>();
builder.Services.AddSingleton<IReportingService>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<LocalReportingService>>();
    return new LocalReportingService(logger);
});
*/

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
    var context = scope.ServiceProvider.GetRequiredService<CoreDbContext>();
    try
    {
        await context.Database.EnsureCreatedAsync();
        // Create schema if not exists
        await context.Database.ExecuteSqlRawAsync("CREATE SCHEMA IF NOT EXISTS core_schema");
        // TEMPORARY: Skip migration due to pending model changes
        // await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// Configure the HTTP request pipeline
// Swagger her ortamda çalışsın
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Zerquiz Core API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();

