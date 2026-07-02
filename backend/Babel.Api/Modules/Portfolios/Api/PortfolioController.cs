using Babel.Api.Modules.Portfolios.Application;
using Babel.Api.Modules.Portfolios.Application.DTOs;
using Babel.Api.Modules.Portfolios.Domain;
using Babel.Api.Shared.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.Portfolios.Api;

[Authorize]
[ApiController]
[Route("api/portfolios")]
public class PortfolioController : ControllerBase
{
    private readonly PortfolioService _service;

    public PortfolioController(PortfolioService service)
    {
        _service = service;
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<Portfolio>>> GetMyPortfolios()
    {
        var userId = User.GetUserId();
        var portfolios = await _service.GetUserPortfolioAsync(userId);
        return Ok(portfolios);
    }

    [HttpPost]
    public async Task<ActionResult<Portfolio>> Create(CreatePortfolioRequest request)
    {
        var userId = User.GetUserId();
        var portfolio = await _service.CreatePortfolioAsync(userId, request.Name, request.Symbols);
        return Ok(portfolio);
    }

    [HttpPost("{id}/symbols")]
    public async Task<IActionResult> AddSymbols(int id, AddSymbolsRequest request)
    {
        var userId = User.GetUserId();
        await _service.AddFollowedSymbolsAsync(userId, id, request.Symbols);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();
        await _service.DeletePortfolioAsync(userId, id);
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Portfolio>> GetPortfolio(int id)
    {
        var userId = User.GetUserId();
        var portfolio = await _service.GetPortfolioAsync(userId, id);
        return Ok(portfolio);
    }

    [HttpGet("{id}/holdings")]
    public async Task<ActionResult> GetHoldings(int id)
    {
        var userId = User.GetUserId();
        var portfolio = await _service.GetPortfolioAsync(userId, id);
        return Ok(portfolio.Holdings);
    }

    [HttpPost("{id}/deposit")]
    public async Task<ActionResult<Portfolio>> Deposit(int id, DepositRequest request)
    {
        var userId = User.GetUserId();
        var portfolio = await _service.AddCashAsync(userId, id, request.Amount);
        return Ok(portfolio);
    }

    [HttpGet("{id}/dashboard")]
    public async Task<ActionResult<PortfolioDashboardDto>> GetDashboard(int id)
    {
        var userId = User.GetUserId();
        var dashboard = await _service.GetDashboardAsync(userId, id);
        return Ok(dashboard);
    }

    public record CreatePortfolioRequest(string Name, List<string> Symbols);

    public record AddSymbolsRequest(List<string> Symbols);

    public record DepositRequest(decimal Amount);
}
