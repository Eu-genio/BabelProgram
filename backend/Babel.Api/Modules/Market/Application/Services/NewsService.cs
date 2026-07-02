using Babel.Api.Modules.Market.Application.Abstractions;
using Babel.Api.Modules.Market.Application.Helpers;
using Babel.Api.Modules.Market.Domain;
using Babel.Api.Modules.Market.Infrastructure.News;
using Microsoft.Extensions.Caching.Memory;

namespace Babel.Api.Modules.Market.Application.Services;

public class NewsService : INewsService
{
    private readonly IMemoryCache _cache;
    private readonly YahooFinanceNewsProvider _yahoo;
    private readonly MarketauxNewsProvider _marketaux;
    private readonly MarketNewsQuotaTracker _quota;
    private readonly TimeSpan _cacheDuration;
    private readonly int _maxArticles;

    public NewsService(
        IMemoryCache cache,
        YahooFinanceNewsProvider yahoo,
        MarketauxNewsProvider marketaux,
        MarketNewsQuotaTracker quota,
        IConfiguration configuration)
    {
        _cache = cache;
        _yahoo = yahoo;
        _marketaux = marketaux;
        _quota = quota;
        var cacheMinutes = configuration.GetValue("News:CacheMinutes", 30);
        _cacheDuration = TimeSpan.FromMinutes(cacheMinutes);
        _maxArticles = configuration.GetValue("News:MaxArticles", 12);
    }

    public async Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(
        IEnumerable<string> symbols,
        CancellationToken cancellationToken = default)
    {
        var normalized = NewsAggregation.NormalizeSymbols(symbols);
        if (normalized.Count == 0)
        {
            return [];
        }

        var allItems = new List<MarketNewsItem>();

        foreach (var symbol in normalized)
        {
            var symbolItems = await GetOrFetchSymbolNewsAsync(symbol, cancellationToken);
            allItems.AddRange(symbolItems);
        }

        return NewsAggregation.SelectDiverseNews(allItems, _maxArticles);
    }

    private async Task<IReadOnlyList<MarketNewsItem>> GetOrFetchSymbolNewsAsync(
        string symbol,
        CancellationToken cancellationToken)
    {
        var cacheKey = $"market:news:symbol:{symbol}";

        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = _cacheDuration;

            var merged = new List<MarketNewsItem>();

            var yahooItems = await _yahoo.GetNewsForSymbolAsync(symbol, cancellationToken);
            merged.AddRange(yahooItems);

            if (_marketaux.IsConfigured && _quota.TryConsume())
            {
                var marketauxItems = await _marketaux.GetNewsForSymbolAsync(symbol, cancellationToken);
                merged.AddRange(marketauxItems);
            }

            return merged
                .GroupBy(n => n.Url, StringComparer.OrdinalIgnoreCase)
                .Select(g => g.OrderByDescending(n => n.PublishedAtUtc).First())
                .OrderByDescending(n => n.PublishedAtUtc)
                .ToList();
        }) ?? [];
    }
}
