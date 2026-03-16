using Babel.Api.Modules.MarketData.Application;
using Babel.Api.Modules.MarketData.Domain;

namespace Babel.Api.Modules.MarketData.Infrastructure;

public class MockMarketDataProvider : IMarketDataProvider
{
    public Task<AssetQuote?> GetQuoteAsync(string symbol, CancellationToken cancellationToken = default)
    {
        var quote = new AssetQuote
        {
            Symbol = symbol.ToUpper(),
            Price = 150m,
            Change = 1.25m,
            ChangePercent = 0.84m,
            RetrievedAtUtc = DateTime.UtcNow
        };

        return Task.FromResult<AssetQuote?>(quote);
    }
}