using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Modules.Assets.Infrastructure;

namespace Babel.Api.Modules.Assets.Application
{
    public class AssetService
    {
        private readonly AssetRepository _repo;

        public AssetService(AssetRepository repo)
        {
            _repo = repo;
        }

        public Task<List<Asset>> GetAllAsync()
        {
            return _repo.GetAllAsync();
        }

        public Task<Asset?> GetBySymbolAsync(string symbol)
        {
            return _repo.GetBySymbolAsync(symbol.ToUpper());
        }

        public async Task<Asset> CreateAsync(string symbol, string name, AssetType type, string exchange)
        {
            var asset = new Asset
            {
                Symbol = symbol.ToUpper(),
                Name = name,
                Type = type,
                Exchange = exchange
            };

            await _repo.AddAsync(asset);

            return asset;
        }
    }
}
