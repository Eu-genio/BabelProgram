namespace Babel.Api.Modules.Trades.Domain
{
    public enum TradeSide { Buy = 0, Sell =1}
    public class Trade
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public int AssetId { get; set; }
        public TradeSide Side { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime ExecutedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
