namespace Babel.Api.Modules.Market.Domain;

public record MarketQuote(
    string Symbol,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    DateTime AsOfUtc);

public record MarketNewsItem(
    string Symbol,
    string Headline,
    string Source,
    string Url,
    DateTime PublishedAtUtc);
