namespace Babel.Api.Modules.Portfolios.Domain
{
    public class Portfolio
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = "Main Portfolio";
        public decimal CashBalance { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public List<PortfolioHolding> Holdings { get; set; } = new();
    }
}
