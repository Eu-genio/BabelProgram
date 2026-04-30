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
