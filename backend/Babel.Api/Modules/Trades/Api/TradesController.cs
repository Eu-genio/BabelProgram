using Babel.Api.Modules.Trades.Application;
using Babel.Api.Modules.Trades.Domain;
using Babel.Api.Shared.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.Trades.Api
{
    [ApiController]
    [Authorize]
    [Route("api/trades")]
    public class TradesController : ControllerBase
    {
        private readonly TradeService _tradeService;

        public TradesController(TradeService tradeService) { _tradeService = tradeService; }

        [HttpPost("buy")]
        public async Task<IActionResult> Buy([FromBody] TradeRequest req)
        {
            var userId = User.GetUserId();
            var trade = await _tradeService.BuyAsync(userId, req.PortfolioId, req.Symbol, req.Quantity);
            return Ok(trade);
        }

        [HttpPost("sell")]
        public async Task<IActionResult> Sell([FromBody] TradeRequest req)
        {
            var userId = User.GetUserId();
            var trade = await _tradeService.SellAsync(userId, req.PortfolioId, req.Symbol, req.Quantity);

            return Ok(trade);
        }
        [HttpGet("portfolio/{portfolioid}")]
        public async Task<ActionResult> GetTrades(int portfolioId)
        {
            var trades = await _tradeService.GetPortfolioTradesAsync(portfolioId);
            return Ok(trades);
        }

        [HttpGet("{id}/value")]
        public async Task<ActionResult> GetPortfolioValue(int id)
        {
            var userId = User.GetUserId();
            var portfolioToEvaluate = await _tradeService.GetPortfolioValueAsync(userId, id);
            return Ok(portfolioToEvaluate);
        }

        public record TradeRequest(int PortfolioId, string Symbol, decimal Quantity);
    }
}
