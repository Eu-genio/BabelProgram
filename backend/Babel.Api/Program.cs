using Babel.Api.Modules.Users.Application;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? "Data Source=babel.db"; // fallback simple SQLite file

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddScoped<UserAppService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.Run();
