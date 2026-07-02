using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

internal static class NewsAggregation
{
    public static List<string> NormalizeSymbols(IEnumerable<string> symbols, int max = 12)
    {
        return symbols
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim().ToUpperInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(max)
            .ToList();
    }

    public static IReadOnlyList<MarketNewsItem> SelectDiverseNews(IEnumerable<MarketNewsItem> items, int limit)
    {
        var deduped = items
            .GroupBy(n => n.Url, StringComparer.OrdinalIgnoreCase)
            .Select(g => g.OrderByDescending(n => n.PublishedAtUtc).First())
            .OrderByDescending(n => n.PublishedAtUtc)
            .ToList();

        var selected = new List<MarketNewsItem>();
        var usedUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var group in deduped.GroupBy(n => n.Source, StringComparer.OrdinalIgnoreCase))
        {
            var item = group.First();
            if (usedUrls.Add(item.Url))
            {
                selected.Add(item);
            }
        }

        foreach (var item in deduped)
        {
            if (selected.Count >= limit)
            {
                break;
            }

            if (usedUrls.Add(item.Url))
            {
                selected.Add(item);
            }
        }

        return selected
            .OrderByDescending(n => n.PublishedAtUtc)
            .Take(limit)
            .ToList();
    }
}
