using System.Text.Json;
using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Infrastructure;

public class MarketauxNewsProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public MarketauxNewsProvider(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.marketaux.com/");
        _apiKey = configuration["Marketaux:ApiKey"] ?? string.Empty;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_apiKey);

    public async Task<IReadOnlyList<MarketNewsItem>> GetNewsForSymbolAsync(
        string symbol,
        CancellationToken cancellationToken = default)
    {
        if (!IsConfigured)
        {
            return [];
        }

        var normalized = symbol.Trim().ToUpperInvariant();
        var url =
            $"v1/news/all?symbols={Uri.EscapeDataString(normalized)}&filter_entities=true&language=en&limit=3&api_token={Uri.EscapeDataString(_apiKey)}";

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return [];
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        if (!document.RootElement.TryGetProperty("data", out var dataArray))
        {
            return [];
        }

        var items = new List<MarketNewsItem>();
        foreach (var item in dataArray.EnumerateArray())
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
        var url = item.TryGetProperty("url", out var urlEl) ? urlEl.GetString() : null;
        var source = item.TryGetProperty("source", out var sourceEl) ? sourceEl.GetString() : null;
        var summary = item.TryGetProperty("description", out var descriptionEl) ? descriptionEl.GetString() : null;
        var publishedAtRaw = item.TryGetProperty("published_at", out var publishedEl) ? publishedEl.GetString() : null;

        if (string.IsNullOrWhiteSpace(headline) || string.IsNullOrWhiteSpace(url))
        {
            return null;
        }

        var symbol = fallbackSymbol;
        if (item.TryGetProperty("entities", out var entitiesEl) && entitiesEl.ValueKind == JsonValueKind.Array)
        {
            foreach (var entity in entitiesEl.EnumerateArray())
            {
                if (entity.TryGetProperty("symbol", out var symbolEl))
                {
                    var value = symbolEl.GetString();
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        symbol = value.Trim().ToUpperInvariant();
                        break;
                    }
                }
            }
        }

        var publishedAtUtc = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(publishedAtRaw) &&
            DateTime.TryParse(publishedAtRaw, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out var parsed))
        {
            publishedAtUtc = parsed;
        }

        return new MarketNewsItem(
            Symbol: symbol,
            Headline: headline,
            Source: string.IsNullOrWhiteSpace(source) ? "Marketaux" : source,
            Url: url,
            PublishedAtUtc: publishedAtUtc,
            Summary: string.IsNullOrWhiteSpace(summary) ? null : summary);
    }
}
