using Babel.Api.Modules.Assets.Application;
using Babel.Api.Modules.Assets.Infrastructure;
using Babel.Api.Modules.Auth.Application;
using Babel.Api.Modules.MarketData.Application;
using Babel.Api.Modules.MarketData.Infrastructure;
using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Market.Infrastructure;
using Babel.Api.Modules.Portfolios.Application;
using Babel.Api.Modules.Portfolios.Infrastructure;
using Babel.Api.Modules.Trades.Application;
using Babel.Api.Modules.Trades.Infrastructure;
using Babel.Api.Modules.Users.Application;
using Babel.Api.Shared.Auth;
using Babel.Api.Shared.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key not configured");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("JWT Issuer not configured");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("JWT Audience not configured");

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? "Data Source=babel.db"; // fallback simple SQLite file

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

var dbProvider = builder.Configuration["Database:Provider"] ?? "sqlite";
builder.Services.AddMemoryCache();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (dbProvider == "postgres")
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddScoped<UserAppService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<AssetRepository>();
builder.Services.AddScoped<AssetService>();
builder.Services.AddScoped<IMarketDataProvider, MarketViewMarketDataProvider>();
builder.Services.AddScoped<MarketDataService>();
builder.Services.AddHttpClient<IMarketViewProvider, FinnhubMarketViewProvider>();
builder.Services.AddScoped<MarketViewService>();
builder.Services.AddScoped<PortfolioRepository>();
builder.Services.AddScoped<PortfolioService>();
builder.Services.AddScoped<TradeRepository>();
builder.Services.AddScoped<TradeService>();

builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,

        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

var disableHttpsRedirect = app.Configuration.GetValue("Testing:DisableHttpsRedirect", false);

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (ArgumentException ex)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
    }
    catch (InvalidOperationException ex)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
    }
    catch (UnauthorizedAccessException ex)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
    }
    catch (HttpRequestException)
    {
        context.Response.StatusCode = StatusCodes.Status502BadGateway;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "Unable to reach market data provider. Please try again." }));
    }
    catch
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "An unexpected error occurred." }));
    }
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

if (!disableHttpsRedirect)
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();

public partial class Program { }
