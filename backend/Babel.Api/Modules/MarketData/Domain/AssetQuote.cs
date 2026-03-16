namespace Babel.Api.Modules.MarketData.Domain
{
    public class AssetQuote
    {
        public string Symbol { get; set; }
        public decimal Price { get; set; }
        public decimal? Change {  get; set; }
        public decimal? ChangePercent { get; set; }
        public DateTime RetrievedAtUtc { get; set; }

    }
}
