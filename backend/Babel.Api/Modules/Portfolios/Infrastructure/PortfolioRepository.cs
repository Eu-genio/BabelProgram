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

        public async Task<Portfolio?> GetByIdWithHoldingsAsync(int portfolioId, int userId)
        {
            return await _db.Portfolios.Include(x => x.Holdings).FirstOrDefaultAsync(p => p.Id == portfolioId && p.UserId == userId);
        }

        public async Task<List<PortfolioFollowedSymbol>> GetFollowedSymbolsAsync(int portfolioId)
        {
            return await _db.PortfolioFollowedSymbols
                .Where(x => x.PortfolioId == portfolioId)
                .OrderBy(x => x.FollowedAtUtc)
                .ToListAsync();
        }

        public async Task AddFollowedSymbolAsync(PortfolioFollowedSymbol item)
        {
            await _db.PortfolioFollowedSymbols.AddAsync(item);
        }

        public async Task<PortfolioFollowedSymbol?> GetFollowedSymbolAsync(int portfolioId, int assetId)
        {
            return await _db.PortfolioFollowedSymbols
                .FirstOrDefaultAsync(x => x.PortfolioId == portfolioId && x.AssetId == assetId);
        }

        public void RemoveFollowedSymbol(PortfolioFollowedSymbol item)
        {
            _db.PortfolioFollowedSymbols.Remove(item);
        }

        public async Task DeleteAsync(Portfolio portfolio)
        {
            var follows = await _db.PortfolioFollowedSymbols.Where(x => x.PortfolioId == portfolio.Id).ToListAsync();
            var holdings = await _db.PortfolioHoldings.Where(x => x.PortfolioId == portfolio.Id).ToListAsync();
            _db.PortfolioFollowedSymbols.RemoveRange(follows);
            _db.PortfolioHoldings.RemoveRange(holdings);
            _db.Portfolios.Remove(portfolio);
            await _db.SaveChangesAsync();
        }
    }
}
