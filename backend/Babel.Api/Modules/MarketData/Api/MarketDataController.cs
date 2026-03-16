using Babel.Api.Modules.MarketData.Application;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.MarketData.Api;

[ApiController]
[Route("api/market-data")]
public class MarketDataController : ControllerBase
{
    private readonly MarketDataService _service;

    public MarketDataController(MarketDataService service)
    {
        _service = service;
    }

    [HttpGet("{symbol}/quote")]
    public async Task<IActionResult> GetQuote(string symbol)
    {
        var quote = await _service.GetQuoteAsync(symbol);

        if (quote == null)
            return NotFound();

        return Ok(quote);
    }
}