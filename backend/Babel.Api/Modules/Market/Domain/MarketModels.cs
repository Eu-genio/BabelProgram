namespace Babel.Api.Modules.Market.Domain;

public record MarketQuote(
    string Symbol,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    DateTime AsOfUtc,
    decimal Open,
    decimal High,
    decimal Low,
    decimal PreviousClose);

public record MarketChartPoint(DateTime TimeUtc, decimal Price);

public record MarketChart(
    string Symbol,
    string Range,
    decimal CurrentPrice,
    decimal Open,
    decimal High,
    decimal Low,
    decimal PreviousClose,
    decimal Change,
    decimal ChangePercent,
    IReadOnlyList<MarketChartPoint> Points);

public record MarketNewsItem(
    string Symbol,
    string Headline,
    string Source,
    string Url,
    DateTime PublishedAtUtc);
