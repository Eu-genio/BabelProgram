using Babel.Api.Modules.Trades.Domain;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Babel.Api.Modules.Trades.Infrastructure
{
    public class TradeRepository
    {
        private readonly ApplicationDbContext _db;

        public TradeRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Trade trade)
        {
            await _db.Trades.AddAsync(trade);
        }

        public async Task<List<Trade>> GetByPortfolioIdAsync(int portfolioId)
        {
            return await _db.Trades
                .Where(x => x.PortfolioId == portfolioId)
                .OrderByDescending(x => x.ExecutedAtUtc)
                .ToListAsync();
        }

        public async Task<List<Trade>> GetByAssetAsync(int assetId)
        {
            return await _db.Trades
                .Where(x => x.AssetId == assetId)
                .OrderByDescending(x => x.ExecutedAtUtc)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}