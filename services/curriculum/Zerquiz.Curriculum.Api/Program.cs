using Microsoft.EntityFrameworkCore;
using Zerquiz.Curriculum.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Servisleri ekle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Zerquiz Curriculum API", Version = "v1" });
});

// Veritabanı
builder.Services.AddDbContext<CurriculumDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
    var context = scope.ServiceProvider.GetRequiredService<CurriculumDbContext>();
    try
    {
        await context.Database.EnsureCreatedAsync();
        await context.Database.ExecuteSqlRawAsync("CREATE SCHEMA IF NOT EXISTS curriculum_schema");
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// HTTP pipeline ayarla
app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Curriculum API v1"); });

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();

