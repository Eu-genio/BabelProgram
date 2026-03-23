using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Babel.Api.Modules.Assets.Infrastructure
{
    public class AssetRepository
    {
        private readonly ApplicationDbContext _db;

        public AssetRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Asset>> GetAllAsync()
        {
            return await _db.Assets
                .Where(a => a.IsActive)
                .OrderBy(a => a.Symbol)
                .ToListAsync();
        }

        public async Task<Asset?> GetBySymbolAsync(string symbol)
        {
            return await _db.Assets
                .FirstOrDefaultAsync(a => a.Symbol == symbol);
        }
        
        public async Task AddAsync(Asset asset)
        {
            _db.Assets.Add(asset);

            await _db.SaveChangesAsync(); 
        }

        public async Task<List<Asset>> SearchAsync(string query)
        {
            query = query.ToUpper();

            return await _db.Assets
                .Where(a =>
                    a.IsActive &&
                    (a.Symbol.Contains(query) ||
                     a.Name.ToUpper().Contains(query)))
                .OrderBy(a => a.Symbol)
                .ToListAsync();
        }

        public async Task<Asset?> GetByIdAsync(int assetId)
        {
            return await _db.Assets.FindAsync(assetId);
        }
    }
}
