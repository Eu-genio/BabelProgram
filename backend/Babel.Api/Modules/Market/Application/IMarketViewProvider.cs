using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public interface IMarketViewProvider
{
    Task<IReadOnlyList<MarketQuote>> GetQuotesAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MarketQuote>> GetTopMoversAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default);
}
