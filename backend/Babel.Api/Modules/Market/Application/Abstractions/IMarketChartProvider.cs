using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public interface IMarketChartProvider
{
    Task<MarketChart?> GetChartAsync(string symbol, string range, CancellationToken cancellationToken = default);
}
