using Microsoft.EntityFrameworkCore;
using Zerquiz.Questions.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Servisleri ekle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Zerquiz Questions API", Version = "v1" });
});

// Veritabanı
builder.Services.AddDbContext<QuestionsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// HttpClient for inter-service communication
builder.Services.AddHttpClient();

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

// Auto-migrate database (commented out for now, apply manually if needed)
// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<QuestionsDbContext>();
//     db.Database.Migrate();
// }

// HTTP pipeline ayarla
app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Questions API v1"); });

app.UseCors("AllowAll");
app.UseStaticFiles(); // For serving uploaded assets
app.UseAuthorization();
app.MapControllers();

app.Run();

