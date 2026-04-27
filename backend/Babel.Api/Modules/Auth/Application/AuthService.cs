using Microsoft.EntityFrameworkCore;
using Babel.Api.Shared.Persistence;
using Babel.Api.Modules.Users.Domain;
using Babel.Api.Shared.Auth;

namespace Babel.Api.Modules.Auth.Application
{
    public class AuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHasher _hasher; 
        private readonly JwtService _jwt;

        public AuthService(ApplicationDbContext db, PasswordHasher hasher, JwtService jwt)
        {
            _db = db;
            _hasher = hasher;
            _jwt = jwt;
        }

        public async Task<string> Register(string name, string email, string password, UserRole role)
        {
            if (await _db.Users.AnyAsync(u => u.Email == email))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = _hasher.Hash(password),
                Role = role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return _jwt.GenerateToken(user);
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
                throw new UnauthorizedAccessException("Invalid credentials");

            if (!_hasher.Verify(password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials");

            return _jwt.GenerateToken(user);
        }
    }
}
