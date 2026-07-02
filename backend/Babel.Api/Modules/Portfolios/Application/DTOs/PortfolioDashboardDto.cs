namespace Babel.Api.Modules.Portfolios.Application.DTOs;

public class PortfolioDashboardDto
{
    public int PortfolioId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Cash { get; set; }
    public decimal HoldingsValue { get; set; }
    public decimal TotalValue { get; set; }
    public bool HasFollowedSymbols { get; set; }

    public List<SummaryRowDto> Summary { get; set; } = new();
    public List<HoldingsRowDto> Holdings { get; set; } = new();
    public List<TradeDto> Trades { get; set; } = new();
    public List<PortfolioNewsDto> News { get; set; } = new();
}

public class SummaryRowDto
{
    public string Symbol { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public decimal ChangePercent { get; set; }
    public long? Volume { get; set; }
    public long? AverageVolume { get; set; }
    public decimal PreviousClose { get; set; }
    public decimal Open { get; set; }
}

public class HoldingsRowDto
{
    public string Symbol { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public decimal ChangePercent { get; set; }
    public decimal Weight { get; set; }
    public decimal Shares { get; set; }
    public decimal Cost { get; set; }
    public decimal TodaysGain { get; set; }
    public decimal TodaysGainPercent { get; set; }
    public decimal? EstAnnualIncome { get; set; }
    public decimal TotalChange { get; set; }
    public decimal TotalChangePercent { get; set; }
    public decimal Value { get; set; }
}

public class TradeDto
{
    public int Id { get; set; }
    public string Symbol { get; set; } = null!;
    public string Side { get; set; } = null!;
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime ExecutedAtUtc { get; set; }
    public DateTime? QuoteAsOfUtc { get; set; }
}

public class PortfolioNewsDto
{
    public string Symbol { get; set; } = null!;
    public string Headline { get; set; } = null!;
    public string Source { get; set; } = null!;
    public string Url { get; set; } = null!;
    public DateTime PublishedAtUtc { get; set; }
    public string? Summary { get; set; }
}
