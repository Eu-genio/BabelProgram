using Babel.Api.Modules.Portfolios.Domain;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Babel.Api.Modules.Portfolios.Infrastructure
{
    public class PortfolioRepository
    {
        private readonly ApplicationDbContext _db; 

        public PortfolioRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Portfolio>> GetByUserIdAsync(int userId)
        {
            return await _db.Portfolios
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<Portfolio?> GetByIdAsync(int id)
        {
            return await _db.Portfolios
                .FirstOrDefaultAsync(x =>  x.Id == id);
        }

        public async Task AddAsync(Portfolio portfolio)
        {
            _db.Portfolios.Add(portfolio);
            await _db.SaveChangesAsync();
        }

        public async Task<Portfolio?> GetByIdForUserAsync(int portfolioId, int userId)
        {
            return await _db.Portfolios
                .FirstOrDefaultAsync(x=> x.Id == portfolioId && x.UserId == userId);
        }

        public async Task<PortfolioHolding?> GetHoldingAsync(int portfolioId, int assetId)
        {
            return await _db.PortfolioHoldings.FirstOrDefaultAsync(x => x.PortfolioId == portfolioId && x.AssetId == assetId);
        }

        public async Task<List<PortfolioHolding>> GetHoldingsAsync(int portfolioId)
        {
            return await _db.PortfolioHoldings.Where(x => x.PortfolioId == portfolioId).ToListAsync();
        }

        public async Task AddHoldingAsync(PortfolioHolding holding)
        {
            await _db.PortfolioHoldings.AddAsync(holding);
        }
        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public void RemoveHolding(PortfolioHolding holding)
        {
            _db.PortfolioHoldings.Remove(holding);
        }
    }
}
