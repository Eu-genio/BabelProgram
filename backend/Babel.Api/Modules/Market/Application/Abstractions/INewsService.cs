using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public interface INewsService
{
    Task<IReadOnlyList<MarketNewsItem>> GetNewsAsync(
        IEnumerable<string> symbols,
        CancellationToken cancellationToken = default);
}
