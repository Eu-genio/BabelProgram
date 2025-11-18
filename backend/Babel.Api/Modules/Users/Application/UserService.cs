using Babel.Api.Modules.Users.Domain;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Babel.Api.Modules.Users.Application
{
    public class UserService
    {
        private readonly ApplicationDbContext _db;

        public UserService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<User> CreateAsync(string email, string name, bool isTeacher)
        {
            var user = new User
            {
                Email = email,
                Name = name,
                IsTeacher = isTeacher
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }
    }
}
