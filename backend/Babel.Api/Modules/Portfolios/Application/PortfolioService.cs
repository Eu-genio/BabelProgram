using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Modules.Assets.Infrastructure;
using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Portfolios.Application.DTOs;
using Babel.Api.Modules.Portfolios.Domain;
using Babel.Api.Modules.Portfolios.Infrastructure;
using Babel.Api.Modules.Trades.Infrastructure;

namespace Babel.Api.Modules.Portfolios.Application;

public class PortfolioService
{
    private readonly PortfolioRepository _repo;
    private readonly TradeRepository _tradeRepo;
    private readonly AssetRepository _assetRepo;
    private readonly MarketViewService _marketView;
    private readonly IStockSnapshotProvider _snapshots;

    public PortfolioService(
        PortfolioRepository repo,
        TradeRepository tradeRepo,
        AssetRepository assetRepo,
        MarketViewService marketView,
        IStockSnapshotProvider snapshots)
    {
        _repo = repo;
        _tradeRepo = tradeRepo;
        _assetRepo = assetRepo;
        _marketView = marketView;
        _snapshots = snapshots;
    }

    public async Task<Portfolio> GetPortfolioAsync(int userId, int portfolioId)
    {
        var portfolio = await _repo.GetByIdWithHoldingsAsync(portfolioId, userId)
            ?? throw new ArgumentException("Portfolio not found");

        return portfolio;
    }

    public Task<List<Portfolio>> GetUserPortfolioAsync(int userId)
    {
        return _repo.GetByUserIdAsync(userId);
    }

    public async Task<Portfolio> CreatePortfolioAsync(int userId, string name, IReadOnlyList<string> symbols)
    {
        var normalized = NormalizeSymbols(symbols);
        if (normalized.Count == 0)
        {
            throw new ArgumentException("At least one symbol is required to create a portfolio.");
        }

        var portfolio = new Portfolio
        {
            UserId = userId,
            Name = name.Trim(),
            CashBalance = 10000m,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repo.AddAsync(portfolio);

        foreach (var symbol in normalized)
        {
            await FollowSymbolInternalAsync(portfolio.Id, symbol);
        }

        return portfolio;
    }

    public async Task AddFollowedSymbolsAsync(int userId, int portfolioId, IReadOnlyList<string> symbols)
    {
        _ = await _repo.GetByIdForUserAsync(portfolioId, userId)
            ?? throw new ArgumentException("Portfolio not found");

        foreach (var symbol in NormalizeSymbols(symbols))
        {
            await FollowSymbolInternalAsync(portfolioId, symbol);
        }
    }

    public async Task DeletePortfolioAsync(int userId, int portfolioId)
    {
        var portfolio = await _repo.GetByIdForUserAsync(portfolioId, userId)
            ?? throw new ArgumentException("Portfolio not found");

        await _repo.DeleteAsync(portfolio);
    }

    public async Task<Portfolio> AddCashAsync(int userId, int portfolioId, decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount must be positive.");
        }

        var portfolio = await _repo.GetByIdForUserAsync(portfolioId, userId)
            ?? throw new ArgumentException("Portfolio not found");

        portfolio.CashBalance += amount;
        await _repo.SaveChangesAsync();
        return portfolio;
    }

    public async Task<PortfolioDashboardDto> GetDashboardAsync(int userId, int portfolioId)
    {
        var portfolio = await _repo.GetByIdWithHoldingsAsync(portfolioId, userId)
            ?? throw new ArgumentException("Portfolio not found");

        await EnsureFollowsFromHoldingsAsync(portfolio);

        var followed = await _repo.GetFollowedSymbolsAsync(portfolioId);
        var trades = await _tradeRepo.GetByPortfolioIdAsync(portfolioId);
        var holdingsByAsset = portfolio.Holdings.ToDictionary(h => h.AssetId);

        var summaryRows = new List<SummaryRowDto>();
        var holdingsRows = new List<HoldingsRowDto>();
        decimal holdingsValue = 0;

        foreach (var follow in followed)
        {
            var asset = await _assetRepo.GetByIdAsync(follow.AssetId)
                ?? throw new ArgumentException("Asset not found");

            var snapshot = await _snapshots.GetSnapshotAsync(asset.Symbol);
            if (snapshot is null)
            {
                continue;
            }

            holdingsByAsset.TryGetValue(asset.Id, out var holding);
            var shares = holding?.Quantity ?? 0m;
            var avgCost = holding?.AverageCost ?? 0m;
            var value = shares * snapshot.Price;
            holdingsValue += value;

            summaryRows.Add(new SummaryRowDto
            {
                Symbol = asset.Symbol,
                Price = snapshot.Price,
                Change = snapshot.Change,
                ChangePercent = snapshot.ChangePercent,
                Volume = snapshot.Volume,
                AverageVolume = snapshot.AverageVolume,
                PreviousClose = snapshot.PreviousClose,
                Open = snapshot.Open
            });

            var todaysGain = shares * snapshot.Change;
            var todaysGainPercent = snapshot.PreviousClose > 0m
                ? decimal.Round((snapshot.Change / snapshot.PreviousClose) * 100m, 2)
                : 0m;
            var totalChange = shares * (snapshot.Price - avgCost);
            var totalChangePercent = avgCost > 0m
                ? decimal.Round(((snapshot.Price - avgCost) / avgCost) * 100m, 2)
                : 0m;

            holdingsRows.Add(new HoldingsRowDto
            {
                Symbol = asset.Symbol,
                Price = snapshot.Price,
                Change = snapshot.Change,
                ChangePercent = snapshot.ChangePercent,
                Shares = shares,
                Cost = avgCost,
                TodaysGain = todaysGain,
                TodaysGainPercent = todaysGainPercent,
                EstAnnualIncome = null,
                TotalChange = totalChange,
                TotalChangePercent = totalChangePercent,
                Value = value
            });
        }

        var totalValue = portfolio.CashBalance + holdingsValue;
        if (totalValue > 0m)
        {
            foreach (var row in holdingsRows)
            {
                row.Weight = decimal.Round((row.Value / totalValue) * 100m, 2);
            }
        }

        var symbols = summaryRows.Select(s => s.Symbol).ToList();
        var news = symbols.Count == 0
            ? []
            : (await _marketView.GetNewsAsync(symbols))
                .Select(n => new PortfolioNewsDto
                {
                    Symbol = n.Symbol,
                    Headline = n.Headline,
                    Source = n.Source,
                    Url = n.Url,
                    PublishedAtUtc = n.PublishedAtUtc,
                    Summary = n.Summary
                })
                .ToList();

        var tradeDtos = new List<TradeDto>();
        foreach (var t in trades)
        {
            var asset = await _assetRepo.GetByIdAsync(t.AssetId)
                ?? throw new ArgumentException("Asset not found");

            tradeDtos.Add(new TradeDto
            {
                Id = t.Id,
                Symbol = asset.Symbol,
                Side = t.Side.ToString(),
                Quantity = t.Quantity,
                Price = t.Price,
                ExecutedAtUtc = t.ExecutedAtUtc,
                QuoteAsOfUtc = t.QuoteAsOfUtc
            });
        }

        return new PortfolioDashboardDto
        {
            PortfolioId = portfolio.Id,
            Name = portfolio.Name,
            Cash = portfolio.CashBalance,
            HoldingsValue = holdingsValue,
            TotalValue = totalValue,
            HasFollowedSymbols = followed.Count > 0,
            Summary = summaryRows,
            Holdings = holdingsRows,
            Trades = tradeDtos,
            News = news
        };
    }

    private async Task FollowSymbolInternalAsync(int portfolioId, string symbol)
    {
        var asset = await EnsureAssetAsync(symbol);
        var existing = await _repo.GetFollowedSymbolAsync(portfolioId, asset.Id);
        if (existing is not null)
        {
            return;
        }

        await _repo.AddFollowedSymbolAsync(new PortfolioFollowedSymbol
        {
            PortfolioId = portfolioId,
            AssetId = asset.Id,
            FollowedAtUtc = DateTime.UtcNow
        });
        await _repo.SaveChangesAsync();
    }

    private async Task<Asset> EnsureAssetAsync(string symbol)
    {
        var normalized = symbol.Trim().ToUpperInvariant();
        var existing = await _assetRepo.GetBySymbolAsync(normalized);
        if (existing is not null)
        {
            return existing;
        }

        var asset = new Asset
        {
            Symbol = normalized,
            Name = normalized,
            Type = AssetType.Stock,
            Exchange = "US",
            Currency = "USD",
            IsActive = true
        };
        await _assetRepo.AddAsync(asset);
        return asset;
    }

    private async Task EnsureFollowsFromHoldingsAsync(Portfolio portfolio)
    {
        var followed = await _repo.GetFollowedSymbolsAsync(portfolio.Id);
        if (followed.Count > 0 || portfolio.Holdings.Count == 0)
        {
            return;
        }

        foreach (var holding in portfolio.Holdings)
        {
            var asset = await _assetRepo.GetByIdAsync(holding.AssetId);
            if (asset is null)
            {
                continue;
            }

            await FollowSymbolInternalAsync(portfolio.Id, asset.Symbol);
        }
    }

    private static List<string> NormalizeSymbols(IEnumerable<string> symbols)
    {
        return symbols
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim().ToUpperInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(24)
            .ToList();
    }
}
