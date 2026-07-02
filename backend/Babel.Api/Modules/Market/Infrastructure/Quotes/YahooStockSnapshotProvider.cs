using System.Text.Json;
using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Market.Domain;
using Microsoft.Extensions.Caching.Memory;

namespace Babel.Api.Modules.Market.Infrastructure;

public class YahooStockSnapshotProvider : IStockSnapshotProvider
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public YahooStockSnapshotProvider(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
        _httpClient.BaseAddress = new Uri("https://query1.finance.yahoo.com/");
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("BabelProgram/1.0");
    }

    public async Task<StockSnapshot?> GetSnapshotAsync(string symbol, CancellationToken cancellationToken = default)
    {
        var normalized = symbol.Trim().ToUpperInvariant();
        var cacheKey = $"market:yahoo-snapshot:{normalized}";

        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2);

            var url = $"v8/finance/chart/{normalized}?range=1d&interval=1d";
            using var response = await _httpClient.GetAsync(url, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
            var root = document.RootElement;

            if (!root.TryGetProperty("chart", out var chart) ||
                !chart.TryGetProperty("result", out var results) ||
                results.GetArrayLength() == 0)
            {
                return null;
            }

            var meta = results[0].GetProperty("meta");
            var price = GetDecimal(meta, "regularMarketPrice");
            if (price <= 0m)
            {
                return null;
            }

            var previousClose = GetDecimal(meta, "chartPreviousClose", "previousClose");
            var change = GetDecimal(meta, "regularMarketChange");
            if (change == 0m && previousClose > 0m)
            {
                change = price - previousClose;
            }

            var changePercent = GetDecimal(meta, "regularMarketChangePercent");
            if (changePercent == 0m && previousClose > 0m)
            {
                changePercent = decimal.Round((change / previousClose) * 100m, 2);
            }

            return new StockSnapshot(
                Symbol: normalized,
                Price: price,
                Change: change,
                ChangePercent: changePercent,
                Open: GetDecimal(meta, "regularMarketOpen"),
                PreviousClose: previousClose,
                Volume: GetLong(meta, "regularMarketVolume"),
                AverageVolume: GetLong(meta, "averageDailyVolume10Day", "averageDailyVolume3Month"));
        });
    }

    private static decimal GetDecimal(JsonElement element, params string[] names)
    {
        foreach (var name in names)
        {
            if (element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number)
            {
                return value.GetDecimal();
            }
        }

        return 0m;
    }

    private static long? GetLong(JsonElement element, params string[] names)
    {
        foreach (var name in names)
        {
            if (element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number)
            {
                return value.GetInt64();
            }
        }

        return null;
    }
}
