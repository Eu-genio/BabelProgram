using Babel.Api.Modules.Market.Domain;

namespace Babel.Api.Modules.Market.Application;

public interface IStockSnapshotProvider
{
    Task<StockSnapshot?> GetSnapshotAsync(string symbol, CancellationToken cancellationToken = default);
}
