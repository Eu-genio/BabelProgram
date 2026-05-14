using System.Security.Claims;
using Babel.Api.Modules.Assets.Application;
using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Modules.Users.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.Assets.Api
{
    [ApiController]
    [Authorize]
    [Route("api/assets")]
    public class AssetController : ControllerBase
    {
        private readonly AssetService _service;

        public AssetController(AssetService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<Asset>>> GetAll()
        {
            var assets = await _service.GetAllAsync();
            return Ok(assets);
        }

        [HttpGet("{symbol}")]
        public async Task<ActionResult<Asset>> GetBySymbol(string symbol)
        {
            var asset = await _service.GetBySymbolAsync(symbol);

            if (asset == null)
                return NotFound();

            return Ok(asset);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Asset>>> Search([FromQuery] string query)
        {
            if (query == null)
                return BadRequest("Query is required");

            var result = await _service.SearchAsync(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Asset>> Create(CreateAssetRequest request)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (!string.Equals(role, UserRole.Admin.ToString(), StringComparison.Ordinal))
            {
                return Forbid();
            }

            var asset = await _service.CreateAsync(request.Symbol, request.Name, request.Type, request.Exchange);

            return Ok(asset);
        }

        public record CreateAssetRequest(
            string Symbol, string Name, AssetType Type, string Exchange);
    }
}
