using Babel.Api.Modules.MarketData.Domain;

namespace Babel.Api.Modules.MarketData.Application
{
    public interface IMarketDataProvider
    {
        Task<AssetQuote?> GetQuoteAsync(string symbol, CancellationToken cancellation = default);
    }
}
