namespace Babel.Api.Modules.Portfolios.Domain;

public class PortfolioFollowedSymbol
{
    public int Id { get; set; }
    public int PortfolioId { get; set; }
    public int AssetId { get; set; }
    public DateTime FollowedAtUtc { get; set; }
}
