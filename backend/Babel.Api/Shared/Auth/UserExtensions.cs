using System.Security.Claims;

namespace Babel.Api.Shared.Auth;

public static class UserExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdClaim))
            throw new UnauthorizedAccessException("User id claim is missing.");

        if (!int.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("User id claim is invalid.");

        return userId;
    }
}