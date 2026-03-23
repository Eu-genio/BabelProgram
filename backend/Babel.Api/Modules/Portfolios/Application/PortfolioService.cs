using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Modules.Assets.Infrastructure;
using Babel.Api.Modules.MarketData.Application;
using Babel.Api.Modules.Portfolios.Application.DTOs;
using Babel.Api.Modules.Portfolios.Domain;
    using Babel.Api.Modules.Portfolios.Infrastructure;
using Babel.Api.Modules.Trades.Infrastructure;


namespace Babel.Api.Modules.Portfolios.Application
{
    public class PortfolioService
    {
        private readonly PortfolioRepository _repo;
        private readonly TradeRepository _tradeRepo;
        private readonly AssetRepository _assetRepo;
        private readonly IMarketDataProvider _marketData;
        public PortfolioService(PortfolioRepository repo, TradeRepository tradeRepo, AssetRepository assetRepo, IMarketDataProvider marketData)
        {
            _repo = repo;
            _tradeRepo = tradeRepo;
            _assetRepo = assetRepo;
            _marketData = marketData;
        }
        public async Task<Portfolio> GetPortfolioAsync(int userId, int portfolioId)
        {
            var portfolio = await _repo.GetByIdWithHoldingsAsync(portfolioId, userId);

            if (portfolio == null)
                throw new Exception("Portfolio not found");

            return portfolio;
        }

        public Task<List<Portfolio>> GetUserPortfolioAsync(int userId)
        {
            return _repo.GetByUserIdAsync(userId);
        }

        public async Task<Portfolio> CreatePortfolioAsync(int userId, string name)
        {
            var portfolio = new Portfolio
            {
                UserId = userId,
                Name = name,
                CashBalance = 10000m
            };

            await _repo.AddAsync(portfolio);

            return portfolio;
        }

        public async Task<PortfolioDashboardDto> GetDashboardAsync(int userId, int portfolioId)
        {
            var portfolio = await _repo.GetByIdWithHoldingsAsync(portfolioId, userId)
                ?? throw new Exception("Portfolio not found");

            var trades = await _tradeRepo.GetByPortfolioIdAsync(portfolioId);

            decimal holdingsValue = 0;

            var holdingDtos = new List<HoldingDto>();

            foreach (var h in portfolio.Holdings)
            {
                var asset = await _assetRepo.GetByIdAsync(h.AssetId)
                    ?? throw new Exception("Asset not found");

                var quote = await _marketData.GetQuoteAsync(asset.Symbol);

                var price = quote?.Price ?? 0;
                var marketValue = h.Quantity * price;

                holdingsValue += marketValue;

                holdingDtos.Add(new HoldingDto
                {
                    Symbol = asset.Symbol,
                    Quantity = h.Quantity,
                    AverageCost = h.AverageCost,
                    CurrentPrice = price,
                    MarketValue = marketValue
                });
            }

            var tradeDtos = new List<TradeDto>();

            foreach (var t in trades.Take(10))
            {
                var asset = await _assetRepo.GetByIdAsync(t.AssetId)
                    ?? throw new Exception("Asset not found");

                tradeDtos.Add(new TradeDto
                {
                    Symbol = asset.Symbol,
                    Side = t.Side.ToString(),
                    Quantity = t.Quantity,
                    Price = t.Price,
                    ExecutedAtUtc = t.ExecutedAtUtc
                });
            }

            return new PortfolioDashboardDto
            {
                PortfolioId = portfolio.Id,
                Cash = portfolio.CashBalance,
                HoldingsValue = holdingsValue,
                TotalValue = portfolio.CashBalance + holdingsValue,
                Holdings = holdingDtos,
                RecentTrades = tradeDtos
            };
        }

    }
}
