using System.Text.Json;
using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Market.Domain;
using Microsoft.Extensions.Caching.Memory;

namespace Babel.Api.Modules.Market.Infrastructure;

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

    public async Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        EnsureApiKey();
        var normalized = NormalizeSymbols(symbols);
        var cacheKey = $"market:news:{string.Join(",", normalized)}";

        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(90);
            var allItems = new List<MarketNewsItem>();
            var toDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var fromDate = toDate.AddDays(-7);

            foreach (var symbol in normalized)
            {
                var url =
                    $"company-news?symbol={symbol}&from={fromDate:yyyy-MM-dd}&to={toDate:yyyy-MM-dd}&token={_apiKey}";
                using var document = await GetJsonDocumentAsync(url, cancellationToken);

                foreach (var item in document.RootElement.EnumerateArray().Take(6))
                {
                    var headline = item.TryGetProperty("headline", out var h) ? h.GetString() : null;
                    var source = item.TryGetProperty("source", out var s) ? s.GetString() : null;
                    var articleUrl = item.TryGetProperty("url", out var u) ? u.GetString() : null;
                    var unixTime = item.TryGetProperty("datetime", out var dt) ? dt.GetInt64() : 0;

                    if (string.IsNullOrWhiteSpace(headline) || string.IsNullOrWhiteSpace(articleUrl))
                    {
                        continue;
                    }

                    var publishedAtUtc = DateTimeOffset.FromUnixTimeSeconds(unixTime).UtcDateTime;
                    allItems.Add(new MarketNewsItem(
                        Symbol: symbol,
                        Headline: headline,
                        Source: source ?? "Unknown",
                        Url: articleUrl,
                        PublishedAtUtc: publishedAtUtc
                    ));
                }
            }

            return (IReadOnlyList<MarketNewsItem>)allItems
                .OrderByDescending(n => n.PublishedAtUtc)
                .Take(12)
                .ToList();
        }) ?? [];
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

        return new MarketQuote(
            Symbol: symbol,
            Price: current,
            Change: change,
            ChangePercent: changePercent,
            AsOfUtc: DateTime.UtcNow
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

            if (statusCode == 401 || statusCode == 403)
            {
                throw new InvalidOperationException("Market data provider rejected the API key.");
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
