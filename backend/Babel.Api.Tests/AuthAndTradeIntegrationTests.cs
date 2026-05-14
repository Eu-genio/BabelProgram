using System.Net;
using System.Net.Http.Headers;
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
    private static HttpClient CreateApiClient(WebApplicationFactory<Program> factory) =>
        factory.CreateClient();

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
                    ["Jwt:Key"] = "THIS_IS_A_VERY_LONG_SECRET_KEY_FOR_JWT_TOKEN_SIGNING_12345",
                    ["Jwt:Issuer"] = "BabelApi",
                    ["Jwt:Audience"] = "BabelApiUsers",
                    ["Testing:DisableHttpsRedirect"] = "true"
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
        var client = CreateApiClient(_factory);
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
        var client = CreateApiClient(_factory);
        var response = await client.PostAsJsonAsync("/api/trades/buy", new
        {
            portfolioId = 1,
            symbol = "AAPL",
            quantity = 1
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Assets_GetAll_WithoutToken_ReturnsUnauthorized()
    {
        var client = CreateApiClient(_factory);
        var response = await client.GetAsync("/api/assets");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ListTrades_ForAnotherUsersPortfolio_ReturnsBadRequest()
    {
        const string password = "Password123!";
        using var clientA = CreateApiClient(_factory);
        using var clientB = CreateApiClient(_factory);

        var email1 = $"user-a-{Guid.NewGuid():N}@example.com";
        Assert.Equal(HttpStatusCode.OK, (await clientA.PostAsJsonAsync("/api/auth/register", new
        {
            name = "User A",
            email = email1,
            password
        })).StatusCode);

        var token1 = await GetTokenFromLogin(clientA, email1, password);
        clientA.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token1);

        var portfolioResponse = await clientA.PostAsJsonAsync("/api/portfolios", new { name = "A portfolio" });
        Assert.Equal(HttpStatusCode.OK, portfolioResponse.StatusCode);
        var portfolioPayload = await portfolioResponse.Content.ReadFromJsonAsync<JsonElement>();
        var portfolioId = portfolioPayload.GetProperty("id").GetInt32();

        var email2 = $"user-b-{Guid.NewGuid():N}@example.com";
        Assert.Equal(HttpStatusCode.OK, (await clientB.PostAsJsonAsync("/api/auth/register", new
        {
            name = "User B",
            email = email2,
            password
        })).StatusCode);

        var token2 = await GetTokenFromLogin(clientB, email2, password);
        clientB.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token2);

        var listResponse = await clientB.GetAsync($"/api/trades/portfolio/{portfolioId}");
        Assert.Equal(HttpStatusCode.BadRequest, listResponse.StatusCode);

        var ownList = await clientA.GetAsync($"/api/trades/portfolio/{portfolioId}");
        Assert.Equal(HttpStatusCode.OK, ownList.StatusCode);
    }

    private static async Task<string> GetTokenFromLogin(HttpClient client, string email, string password)
    {
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password });
        loginResponse.EnsureSuccessStatusCode();
        var payload = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        return payload.GetProperty("token").GetString()!;
    }

    private static async Task<bool> HasToken(HttpResponseMessage response)
    {
        var payload = await response.Content.ReadFromJsonAsync<JsonElement>();
        return payload.TryGetProperty("token", out var tokenValue)
            && !string.IsNullOrWhiteSpace(tokenValue.GetString());
    }
}
