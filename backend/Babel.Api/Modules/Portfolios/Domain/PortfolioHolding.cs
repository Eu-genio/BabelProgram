namespace Babel.Api.Modules.Portfolios.Domain
{
    public class PortfolioHolding
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public int AssetId { get; set; }
        public decimal Quantity { get; set; }
        public decimal AverageCost { get; set; }
        public Portfolio Portfolio { get; set; } = null!;    }
}
