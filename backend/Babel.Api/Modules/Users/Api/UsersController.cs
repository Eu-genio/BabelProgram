using Babel.Api.Modules.Users.Application;
using Babel.Api.Modules.Users.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Babel.Api.Modules.Users.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserAppService _service;

        public UsersController(UserAppService service)
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
            var user = await _service.CreateAsync(request.Name, request.Email, request.Role);
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteById(int id)
        {
            var userToDelete = await _service.DeleteByIdAsync(id);
            if (!userToDelete) return NotFound();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<User>> UpdateById(int id, UpdateUserRequest request)
        {
            var userToUpdate = await _service.UpdateByIdAsync(id, request.Name, request.Email, request.Role);
            if (userToUpdate != null) { return NotFound(); }
            return Ok(userToUpdate);
        }
    }

    public record CreateUserRequest(string Name, string Email, UserRole Role);
    public record UpdateUserRequest(string Name, string Email, UserRole Role);

}