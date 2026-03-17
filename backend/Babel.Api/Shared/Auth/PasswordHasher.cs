using BCrypt.Net;

namespace Babel.Api.Shared.Auth
{
    public class PasswordHasher
    {
        // Hash a plain‑text password
        public string Hash(string password) =>
            BCrypt.Net.BCrypt.HashPassword(password);

        // Verify a plain‑text password against a stored hash
        public bool Verify(string password, string hash) =>
            BCrypt.Net.BCrypt.Verify(password, hash);
    }
}