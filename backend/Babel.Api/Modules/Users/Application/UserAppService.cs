using Babel.Api.Modules.Users.Domain;
using Babel.Api.Shared.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace Babel.Api.Modules.Users.Application
{
    public class UserAppService
    {
        private readonly ApplicationDbContext _db;

        public UserAppService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<User> CreateAsync(string email, string name, UserRole role)
        {
            var user = new User
            {
                Email = email,
                Name = name,
                Role = role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }

        public async Task<bool> DeleteByIdAsync(int id)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == id);
            if (user is null) return false;

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<User> UpdateByIdAsync(int id, string name, string email, UserRole role)
        {
            var userToUpdate = await _db.Users.SingleOrDefaultAsync(user => user.Id == id);

            if (userToUpdate is null) return null;

            userToUpdate.Name = name;
            userToUpdate.Email = email;
            userToUpdate.Role = role;

            await _db.SaveChangesAsync(); return userToUpdate;
        }
    }
}
