using Babel.Api.Modules.Users.Application;
using Babel.Api.Modules.Users.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Modules.Users.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;

        public UsersController(UserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Create(CreateUserRequest request)
        {
            var user = await _service.CreateAsync(request.Email, request.Name, request.IsTeacher);
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }
    }

    public record CreateUserRequest(string Email, string Name, bool IsTeacher);
}
