using BCrypt.Net;

namespace Babel.Api.Modules.Auth.Application
{
    public class PasswordHasher
    {
        public string Hash (string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string hash)
        { 
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
