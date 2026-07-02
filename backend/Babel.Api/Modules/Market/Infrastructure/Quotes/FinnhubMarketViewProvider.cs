using System.Text.Json;
using Babel.Api.Modules.Market.Application.Abstractions;
using Babel.Api.Modules.Market.Domain;
using Microsoft.Extensions.Caching.Memory;

namespace Babel.Api.Modules.Market.Infrastructure.Quotes;

public class FinnhubMarketViewProvider : IMarketViewProvider
{
    private static readonly string[] DefaultMoverSymbols =
    [
        "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AMD", "NFLX", "INTC"
    ];

    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly string _apiKey;

    public FinnhubMarketViewProvider(HttpClient httpClient, IConfiguration configuration, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
        _httpClient.BaseAddress = new Uri("https://finnhub.io/api/v1/");
        _apiKey = configuration["Finnhub:ApiKey"] ?? string.Empty;
    }

    public async Task<IReadOnlyList<MarketQuote>> GetQuotesAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        EnsureApiKey();
        var normalized = NormalizeSymbols(symbols);
        var cacheKey = $"market:quotes:{string.Join(",", normalized)}";

        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(45);
            var quotes = new List<MarketQuote>();

            foreach (var symbol in normalized)
            {
                var quote = await GetQuoteAsync(symbol, cancellationToken);
                if (quote is not null)
                {
                    quotes.Add(quote);
                }
            }

            return (IReadOnlyList<MarketQuote>)quotes;
        }) ?? [];
    }

    public async Task<IReadOnlyList<MarketQuote>> GetTopMoversAsync(CancellationToken cancellationToken = default)
    {
        EnsureApiKey();
        var quotes = await GetQuotesAsync(DefaultMoverSymbols, cancellationToken);
        return quotes
            .OrderByDescending(q => Math.Abs(q.ChangePercent))
            .Take(6)
            .ToList();
    }

    private async Task<MarketQuote?> GetQuoteAsync(string symbol, CancellationToken cancellationToken)
    {
        var url = $"quote?symbol={symbol}&token={_apiKey}";
        using var document = await GetJsonDocumentAsync(url, cancellationToken);
        var root = document.RootElement;

        var current = root.TryGetProperty("c", out var c) ? c.GetDecimal() : 0m;
        if (current <= 0m)
        {
            return null;
        }

        var change = root.TryGetProperty("d", out var d) ? d.GetDecimal() : 0m;
        var changePercent = root.TryGetProperty("dp", out var dp) ? dp.GetDecimal() : 0m;
        var open = root.TryGetProperty("o", out var o) ? o.GetDecimal() : 0m;
        var high = root.TryGetProperty("h", out var h) ? h.GetDecimal() : 0m;
        var low = root.TryGetProperty("l", out var l) ? l.GetDecimal() : 0m;
        var previousClose = root.TryGetProperty("pc", out var pc) ? pc.GetDecimal() : 0m;

        var asOfUtc = DateTime.UtcNow;
        if (root.TryGetProperty("t", out var tEl) && tEl.ValueKind == JsonValueKind.Number)
        {
            var unix = tEl.GetInt64();
            if (unix > 0)
            {
                asOfUtc = DateTimeOffset.FromUnixTimeSeconds(unix).UtcDateTime;
            }
        }

        return new MarketQuote(
            Symbol: symbol,
            Price: current,
            Change: change,
            ChangePercent: changePercent,
            AsOfUtc: asOfUtc,
            Open: open,
            High: high,
            Low: low,
            PreviousClose: previousClose
        );
    }

    private static List<string> NormalizeSymbols(IEnumerable<string> symbols)
    {
        return symbols
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim().ToUpperInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(12)
            .ToList();
    }

    private void EnsureApiKey()
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            throw new InvalidOperationException("Market data provider is not configured (missing Finnhub API key).");
        }
    }

    private async Task<JsonDocument> GetJsonDocumentAsync(string url, CancellationToken cancellationToken)
    {
        using var response = await _httpClient.GetAsync(url, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var statusCode = (int)response.StatusCode;

            if (statusCode == 401)
            {
                throw new InvalidOperationException(
                    "Finnhub rejected the API key. Set Finnhub:ApiKey via user secrets or the Finnhub__ApiKey environment variable, then restart the API.");
            }

            if (statusCode == 403)
            {
                throw new InvalidOperationException(
                    "Finnhub denied access (403). Your API key may be invalid, expired, or not allowed for this endpoint on your plan.");
            }

            if (statusCode == 429)
            {
                throw new InvalidOperationException("Market data rate limit reached. Please wait a minute and refresh.");
            }

            throw new InvalidOperationException($"Market data provider request failed ({statusCode}).");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        return await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
    }
}
