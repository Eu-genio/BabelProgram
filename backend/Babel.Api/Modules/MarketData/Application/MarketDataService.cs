using Babel.Api.Modules.MarketData.Domain;

namespace Babel.Api.Modules.MarketData.Application
{
    public class MarketDataService
    {
        private readonly IMarketDataProvider _provider;

        public MarketDataService(IMarketDataProvider provider)
        {
            _provider = provider;
        }

        public Task<AssetQuote?> GetQuoteAsync(string symbol)
        {
            return _provider.GetQuoteAsync(symbol);
        }
    }
}
