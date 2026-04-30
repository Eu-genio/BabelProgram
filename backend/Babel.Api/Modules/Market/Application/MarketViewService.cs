using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public class MarketViewService
{
    private readonly IMarketViewProvider _provider;

    public MarketViewService(IMarketViewProvider provider)
    {
        _provider = provider;
    }

    public Task<IReadOnlyList<MarketQuote>> GetWatchlistAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        return _provider.GetQuotesAsync(symbols, cancellationToken);
    }

    public Task<IReadOnlyList<MarketQuote>> GetTopMoversAsync(CancellationToken cancellationToken = default)
    {
        return _provider.GetTopMoversAsync(cancellationToken);
    }

    public Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default)
    {
        return _provider.GetNewsAsync(symbols, cancellationToken);
    }
}
