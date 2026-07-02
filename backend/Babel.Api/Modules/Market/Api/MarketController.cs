using Babel.Api.Modules.Market.Application;
using Babel.Api.Modules.Market.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.Market.Api;

[ApiController]
[Authorize]
[Route("api/market")]
public class MarketController : ControllerBase
{
    private readonly MarketViewService _service;

    public MarketController(MarketViewService service)
    {
        _service = service;
    }

    [HttpGet("symbols/search")]
    public async Task<ActionResult<IReadOnlyList<SymbolSearchResult>>> SearchSymbols(
        [FromQuery] string query,
        [FromQuery] int limit = 3,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Ok(Array.Empty<SymbolSearchResult>());
        }

        var cappedLimit = Math.Clamp(limit, 1, 10);
        var results = await _service.SearchSymbolsAsync(query, cappedLimit, cancellationToken);
        return Ok(results);
    }

    [HttpGet("watchlist")]
    public async Task<ActionResult<IReadOnlyList<MarketQuote>>> GetWatchlist([FromQuery] string? symbols, CancellationToken cancellationToken)
    {
        var parsedSymbols = ParseSymbols(symbols, ["AAPL", "MSFT", "TSLA"]);
        var data = await _service.GetWatchlistAsync(parsedSymbols, cancellationToken);
        return Ok(data);
    }

    [HttpGet("movers")]
    public async Task<ActionResult<IReadOnlyList<MarketQuote>>> GetMovers(CancellationToken cancellationToken)
    {
        var data = await _service.GetTopMoversAsync(cancellationToken);
        return Ok(data);
    }

    [HttpGet("news")]
    public async Task<ActionResult<IReadOnlyList<MarketNewsItem>>> GetNews([FromQuery] string? symbols, CancellationToken cancellationToken)
    {
        var parsedSymbols = ParseSymbols(symbols, ["AAPL", "MSFT", "TSLA"]);
        var data = await _service.GetNewsAsync(parsedSymbols, cancellationToken);
        return Ok(data);
    }

    [HttpGet("{symbol}/chart")]
    public async Task<ActionResult<MarketChart>> GetChart(string symbol, [FromQuery] string range = "1D", CancellationToken cancellationToken = default)
    {
        var chart = await _service.GetChartAsync(symbol, range, cancellationToken);
        if (chart is null)
        {
            return NotFound();
        }

        return Ok(chart);
    }

    private static IReadOnlyList<string> ParseSymbols(string? raw, IReadOnlyList<string> fallback)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return fallback;
        }

        var parsed = raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();

        return parsed.Count == 0 ? fallback : parsed;
    }
}
