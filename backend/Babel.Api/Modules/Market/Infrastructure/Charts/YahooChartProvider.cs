using System.Text.Json;
using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Market.Domain;
using Microsoft.Extensions.Caching.Memory;

namespace Babel.Api.Modules.Market.Infrastructure;

/// <summary>
/// Historical chart data via Yahoo Finance (Finnhub free tier does not include stock candles).
/// Live quotes still come from Finnhub.
/// </summary>
public class YahooChartProvider : IMarketChartProvider
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly IMarketViewProvider _quotes;

    public YahooChartProvider(HttpClient httpClient, IMemoryCache cache, IMarketViewProvider quotes)
    {
        _httpClient = httpClient;
        _cache = cache;
        _quotes = quotes;
        _httpClient.BaseAddress = new Uri("https://query1.finance.yahoo.com/");
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("BabelProgram/1.0");
    }

    public async Task<MarketChart?> GetChartAsync(string symbol, string range, CancellationToken cancellationToken = default)
    {
        var normalized = symbol.Trim().ToUpperInvariant();
        var normalizedRange = NormalizeRange(range);
        var cacheKey = $"market:yahoo-chart:{normalized}:{normalizedRange}";

        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = normalizedRange == "1D"
                ? TimeSpan.FromMinutes(5)
                : TimeSpan.FromHours(1);

            var quote = (await _quotes.GetQuotesAsync(new[] { normalized }, cancellationToken))
                .FirstOrDefault();
            if (quote is null)
            {
                return null;
            }

            var (yahooRange, interval) = MapRange(normalizedRange);
            var url = $"v8/finance/chart/{normalized}?range={yahooRange}&interval={interval}";
            using var response = await _httpClient.GetAsync(url, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
            var root = document.RootElement;

            if (!root.TryGetProperty("chart", out var chart) ||
                !chart.TryGetProperty("result", out var results) ||
                results.GetArrayLength() == 0)
            {
                return null;
            }

            var result = results[0];
            if (!result.TryGetProperty("timestamp", out var timestamps) ||
                !result.TryGetProperty("indicators", out var indicators) ||
                !indicators.TryGetProperty("quote", out var quoteSeries) ||
                quoteSeries.GetArrayLength() == 0)
            {
                return null;
            }

            var closes = quoteSeries[0].TryGetProperty("close", out var c) ? c : default;
            if (closes.ValueKind != JsonValueKind.Array)
            {
                return null;
            }

            var points = new List<MarketChartPoint>();
            var length = Math.Min(timestamps.GetArrayLength(), closes.GetArrayLength());
            for (var i = 0; i < length; i++)
            {
                if (closes[i].ValueKind == JsonValueKind.Null)
                {
                    continue;
                }

                var close = closes[i].GetDecimal();
                if (close <= 0m)
                {
                    continue;
                }

                var unix = timestamps[i].GetInt64();
                points.Add(new MarketChartPoint(
                    DateTimeOffset.FromUnixTimeSeconds(unix).UtcDateTime,
                    close));
            }

            if (points.Count == 0)
            {
                return null;
            }

            var periodOpen = points[0].Price;
            var periodHigh = points.Max(p => p.Price);
            var periodLow = points.Min(p => p.Price);
            var periodChange = quote.Price - periodOpen;
            var periodChangePercent = periodOpen == 0m ? 0m : (periodChange / periodOpen) * 100m;

            return new MarketChart(
                Symbol: normalized,
                Range: normalizedRange,
                CurrentPrice: quote.Price,
                Open: normalizedRange == "1D" ? quote.Open : periodOpen,
                High: normalizedRange == "1D" ? quote.High : periodHigh,
                Low: normalizedRange == "1D" ? quote.Low : periodLow,
                PreviousClose: quote.PreviousClose,
                Change: normalizedRange == "1D" ? quote.Change : periodChange,
                ChangePercent: normalizedRange == "1D" ? quote.ChangePercent : decimal.Round(periodChangePercent, 2),
                Points: points);
        });
    }

    private static string NormalizeRange(string range) =>
        range.Trim().ToUpperInvariant() switch
        {
            "1W" => "1W",
            "1M" => "1M",
            "3M" => "3M",
            "1Y" => "1Y",
            _ => "1D"
        };

    private static (string Range, string Interval) MapRange(string range) => range switch
    {
        "1W" => ("5d", "1d"),
        "1M" => ("1mo", "1d"),
        "3M" => ("3mo", "1d"),
        "1Y" => ("1y", "1wk"),
        _ => ("1d", "5m")
    };
}
