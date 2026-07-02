namespace Babel.Api.Modules.Market.Domain;

public record StockSnapshot(
    string Symbol,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    decimal Open,
    decimal PreviousClose,
    long? Volume,
    long? AverageVolume);
