using Babel.Api.Modules.Assets.Infrastructure;
using Babel.Api.Modules.MarketData.Application;
using Babel.Api.Modules.Portfolios.Domain;
using Babel.Api.Modules.Portfolios.Infrastructure;
using Babel.Api.Modules.Trades.Domain;
using Babel.Api.Modules.Trades.Infrastructure;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Babel.Api.Modules.Trades.Application
{
    public class TradeService
    {
        public readonly PortfolioRepository _portfolioRepo;
        public readonly AssetRepository _assetRepo;
        public readonly TradeRepository _tradeRepo;
        private readonly IMarketDataProvider _marketData;

        public TradeService(PortfolioRepository portfolioRepo, AssetRepository assetRepo, TradeRepository tradeRepo, IMarketDataProvider marketData)
        {
            _portfolioRepo = portfolioRepo;
            _assetRepo = assetRepo;
            _tradeRepo = tradeRepo;
            _marketData = marketData;
        }

        public async Task<Trade> BuyAsync(int userId, int portfolioId, string symbol, decimal quantity)
        {
            if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");

            var portfolio = await _portfolioRepo.GetByIdForUserAsync(portfolioId, userId)
                ?? throw new ArgumentException("Portfolio not found.");

            var asset = await _assetRepo.GetBySymbolAsync(symbol)
                ?? throw new ArgumentException("Asset not found.");

            var quote = await _marketData.GetQuoteAsync(symbol)
                ?? throw new Exception("Prive unavailable.");
            var price = quote.Price;
            var cost = quantity * price;

            if(portfolio.CashBalance <  cost) 
                throw new Exception("Not enough cash.");

            var holding = await _portfolioRepo.GetHoldingAsync(portfolioId, asset.Id); ;

            if(holding is null)
            {
                holding = new PortfolioHolding
                {
                    PortfolioId = portfolioId,
                    AssetId = asset.Id,
                    Quantity = quantity,
                    AverageCost = price,
                };
                await _portfolioRepo.AddHoldingAsync(holding);
            }
            else
            {
                var oldQty = holding.Quantity;
                var oldAvg = holding.AverageCost;

                var newQty = oldQty + quantity;
                var newAvg = ((oldAvg * oldQty) + cost) / newQty; 
                
                holding.Quantity = newQty;
                holding.AverageCost = decimal.Round(newAvg, 2); ;
            }

            portfolio.CashBalance -= cost;
            await _portfolioRepo.SaveChangesAsync();

            var trade = new Trade
            {
                PortfolioId = portfolioId,
                AssetId = asset.Id,
                Side = TradeSide.Buy,
                Quantity = holding.Quantity,
                Price = price,
                TotalAmount = cost
            };

            await _tradeRepo.AddAsync(trade);
            return trade;
        }

        public async Task<Trade> SellAsync(int userId, int portfolioId, string symbol, decimal quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be positive.");

            var portfolio = await _portfolioRepo.GetByIdForUserAsync(portfolioId, userId)
              ?? throw new Exception("Portfolio not found.");

            var asset = _assetRepo.GetBySymbolAsync(symbol)
                ?? throw new Exception("Asset not found.");

            var holding = await _portfolioRepo.GetHoldingAsync(portfolio.Id, asset.Id)
                ?? throw new Exception("Holding not found.");

            if (holding.Quantity < quantity)
                throw new Exception("You do not have enough shares to sell");

            var quote = await _marketData.GetQuoteAsync(symbol)
                ?? throw new Exception("Price unavailable");

            var price = quote.Price;
            var proceeds = quantity * price;

            holding.Quantity -= quantity;
            if(holding.Quantity == 0)
            {
                _portfolioRepo.RemoveHolding(holding);
            }

            portfolio.CashBalance += proceeds;

            var trade = new Trade
            {
                PortfolioId = portfolioId,
                AssetId = asset.Id,
                Side = TradeSide.Sell,
                Quantity = quantity,
                Price = price,
                TotalAmount = proceeds
            };

            await _tradeRepo.AddAsync(trade);
            return trade;

        }
    }
}
