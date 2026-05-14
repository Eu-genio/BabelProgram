using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.MarketData.Application;
using Babel.Api.Modules.MarketData.Domain;

namespace Babel.Api.Modules.MarketData.Infrastructure;

/// <summary>
/// Routes portfolio and trade pricing through the same Finnhub-backed <see cref="IMarketViewProvider"/>
/// used by the Market module (shared cache and quote parsing).
/// </summary>
public class MarketViewMarketDataProvider : IMarketDataProvider
{
    private readonly IMarketViewProvider _marketView;

    public MarketViewMarketDataProvider(IMarketViewProvider marketView)
    {
        _marketView = marketView;
    }

    public async Task<AssetQuote?> GetQuoteAsync(string symbol, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(symbol))
        {
            return null;
        }

        var normalized = symbol.Trim().ToUpperInvariant();
        var quotes = await _marketView.GetQuotesAsync(new[] { normalized }, cancellationToken);
        var q = quotes.FirstOrDefault(x =>
            x.Symbol.Equals(normalized, StringComparison.OrdinalIgnoreCase));

        if (q is null)
        {
            return null;
        }

        return new AssetQuote
        {
            Symbol = q.Symbol,
            Price = q.Price,
            Change = q.Change,
            ChangePercent = q.ChangePercent,
            RetrievedAtUtc = q.AsOfUtc
        };
    }
}
