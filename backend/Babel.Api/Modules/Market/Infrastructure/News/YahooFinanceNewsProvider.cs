using System.Text.Json;
using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Infrastructure.News;

public class YahooFinanceNewsProvider
{
    private readonly HttpClient _httpClient;

    public YahooFinanceNewsProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://query2.finance.yahoo.com/");
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("BabelProgram/1.0");
    }

    public async Task<IReadOnlyList<MarketNewsItem>> GetNewsForSymbolAsync(
        string symbol,
        CancellationToken cancellationToken = default)
    {
        var normalized = symbol.Trim().ToUpperInvariant();
        var url =
            $"v1/finance/search?q={Uri.EscapeDataString(normalized)}&quotesCount=0&newsCount=8&enableFuzzyQuery=false";

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return [];
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        if (!document.RootElement.TryGetProperty("news", out var newsArray))
        {
            return [];
        }

        var items = new List<MarketNewsItem>();
        foreach (var item in newsArray.EnumerateArray())
        {
            var parsed = ParseNewsItem(item, normalized);
            if (parsed is not null)
            {
                items.Add(parsed);
            }
        }

        return items;
    }

    private static MarketNewsItem? ParseNewsItem(JsonElement item, string fallbackSymbol)
    {
        var headline = item.TryGetProperty("title", out var titleEl) ? titleEl.GetString() : null;
        var url = item.TryGetProperty("link", out var linkEl) ? linkEl.GetString() : null;
        var source = item.TryGetProperty("publisher", out var publisherEl) ? publisherEl.GetString() : null;
        var summary = item.TryGetProperty("summary", out var summaryEl) ? summaryEl.GetString() : null;

        if (string.IsNullOrWhiteSpace(headline) || string.IsNullOrWhiteSpace(url))
        {
            return null;
        }

        var symbol = fallbackSymbol;
        if (item.TryGetProperty("relatedTickers", out var tickersEl) && tickersEl.ValueKind == JsonValueKind.Array)
        {
            foreach (var ticker in tickersEl.EnumerateArray())
            {
                var value = ticker.GetString();
                if (!string.IsNullOrWhiteSpace(value))
                {
                    symbol = value.Trim().ToUpperInvariant();
                    break;
                }
            }
        }

        var publishedAtUtc = DateTime.UtcNow;
        if (item.TryGetProperty("providerPublishTime", out var timeEl) && timeEl.ValueKind == JsonValueKind.Number)
        {
            var unix = timeEl.GetInt64();
            if (unix > 0)
            {
                publishedAtUtc = DateTimeOffset.FromUnixTimeSeconds(unix).UtcDateTime;
            }
        }

        return new MarketNewsItem(
            Symbol: symbol,
            Headline: headline,
            Source: string.IsNullOrWhiteSpace(source) ? "Yahoo Finance" : source,
            Url: url,
            PublishedAtUtc: publishedAtUtc,
            Summary: string.IsNullOrWhiteSpace(summary) ? null : summary);
    }
}
