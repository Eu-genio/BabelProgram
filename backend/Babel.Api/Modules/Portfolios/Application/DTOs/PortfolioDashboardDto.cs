namespace Babel.Api.Modules.Portfolios.Application.DTOs
{
    public class PortfolioDashboardDto
    {
        public int PortfolioId { get; set; }
        public decimal Cash {  get; set; }
        public decimal HoldingsValue { get; set; }
        public decimal TotalValue { get; set; }

        public List<HoldingDto> Holdings { get; set; } = new();
        public List<TradeDto> RecentTrades { get; set; } = new();
    }

    public class HoldingDto
    {
        public string Symbol { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal AverageCost { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal MarketValue { get; set; }
    }

    public class TradeDto
    {
        public int Id { get; set; }
        public string Symbol {  set; get; } = null!;
        public string Side { set; get; } = null!;
        public decimal Quantity {  set; get; }
        public decimal Price { set; get; }
        public DateTime ExecutedAtUtc { set; get; }
        public DateTime? QuoteAsOfUtc { get; set; }
    }
}
