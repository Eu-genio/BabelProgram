using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public class MarketViewService
{
    private static readonly string[] DefaultMoverSymbols =
    [
        "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AMD", "NFLX", "INTC"
    ];

    private readonly IMarketViewProvider _provider;
    private readonly IMarketChartProvider _charts;
    private readonly IStockSnapshotProvider _snapshots;
    private readonly INewsService _news;

    public MarketViewService(
        IMarketViewProvider provider,
        IMarketChartProvider charts,
        IStockSnapshotProvider snapshots,
        INewsService news)
    {
        _provider = provider;
        _charts = charts;
        _snapshots = snapshots;
        _news = news;
    }

    public Task<IReadOnlyList<MarketQuote>> GetWatchlistAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        return _provider.GetQuotesAsync(symbols, cancellationToken);
    }

    public async Task<IReadOnlyList<MarketQuote>> GetTopMoversAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<MarketQuote> quotes = [];
        try
        {
            quotes = await _provider.GetTopMoversAsync(cancellationToken);
        }
        catch
        {
            // Finnhub may be unavailable — fall back to Yahoo snapshots below.
        }

        if (quotes.Count >= 4)
        {
            return quotes;
        }

        return await GetMoversFromYahooAsync(cancellationToken);
    }

    private async Task<IReadOnlyList<MarketQuote>> GetMoversFromYahooAsync(CancellationToken cancellationToken)
    {
        var quotes = new List<MarketQuote>();

        foreach (var symbol in DefaultMoverSymbols)
        {
            var snapshot = await _snapshots.GetSnapshotAsync(symbol, cancellationToken);
            if (snapshot is null)
            {
                continue;
            }

            quotes.Add(new MarketQuote(
                snapshot.Symbol,
                snapshot.Price,
                snapshot.Change,
                snapshot.ChangePercent,
                DateTime.UtcNow,
                snapshot.Open,
                High: 0m,
                Low: 0m,
                snapshot.PreviousClose));
        }

        return quotes
            .OrderByDescending(q => Math.Abs(q.ChangePercent))
            .Take(6)
            .ToList();
    }

    public Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        return _news.GetNewsAsync(symbols, cancellationToken);
    }

    public Task<MarketChart?> GetChartAsync(string symbol, string range, CancellationToken cancellationToken = default)
    {
        return _charts.GetChartAsync(symbol, range, cancellationToken);
    }

    public Task<IReadOnlyList<SymbolSearchResult>> SearchSymbolsAsync(
        string query,
        int limit = 3,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(PopularSymbolCatalog.Search(query, limit));
    }
}
