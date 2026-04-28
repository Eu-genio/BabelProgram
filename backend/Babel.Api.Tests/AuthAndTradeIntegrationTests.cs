using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Babel.Api.Shared.Persistence;

namespace Babel.Api.Tests;

public class AuthAndTradeIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthAndTradeIntegrationTests(WebApplicationFactory<Program> factory)
    {
        var dbPath = Path.Combine(Path.GetTempPath(), $"babel-test-{Guid.NewGuid():N}.db");

        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Database:Provider"] = "sqlite",
                    ["ConnectionStrings:DefaultConnection"] = $"Data Source={dbPath}",
                    ["Jwt:Key"] = "super-secret-test-key-1234567890",
                    ["Jwt:Issuer"] = "babel-tests",
                    ["Jwt:Audience"] = "babel-tests-clients"
                });
            });
        });

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.EnsureDeleted();
        db.Database.Migrate();
    }

    [Fact]
    public async Task Register_Then_Login_ReturnsToken()
    {
        var client = _factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@example.com";
        const string password = "Password123!";

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            name = "Test User",
            email,
            password
        });

        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);
        Assert.True(await HasToken(registerResponse));

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        Assert.True(await HasToken(loginResponse));
    }

    [Fact]
    public async Task BuyTrade_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/trades/buy", new
        {
            portfolioId = 1,
            symbol = "AAPL",
            quantity = 1
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static async Task<bool> HasToken(HttpResponseMessage response)
    {
        var payload = await response.Content.ReadFromJsonAsync<JsonElement>();
        return payload.TryGetProperty("token", out var tokenValue)
            && !string.IsNullOrWhiteSpace(tokenValue.GetString());
    }
}
