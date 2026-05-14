using Babel.Api.Modules.Auth.Application;
using Babel.Api.Modules.Users.Domain;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Babel.Api.Shared.Persistence;
namespace Babel.Api.Modules.Auth.Api
{

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth)
        {
            _auth = auth;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserMeResponse>> Me([FromServices] ApplicationDbContext db)
        {
            var userId = User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null) 
                return Unauthorized();

            var user = await db.Users.Where(u => u.Id == int.Parse(userId)).Select(u => new UserMeResponse(u.Id, u.Name, u.Email, u.Role)).FirstOrDefaultAsync();

            if (user == null)
                return Unauthorized();
            return Ok(user);
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
        {
            var token = await _auth.Register(
                req.Name,
                req.Email,
                req.Password,
                UserRole.Trader);
            return Ok(new AuthResponse (token));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        {
            var token = await _auth.Login(req.Email, req.Password);

            return Ok(new AuthResponse(token));
        }
    }

    public record RegisterRequest(
        string Name,
        string Email,
        string Password);

    public record LoginRequest(
        string Email,
        string Password);

    public record AuthResponse(string Token);

    public record UserMeResponse( int Id, string Name, string Email, UserRole role);
}
