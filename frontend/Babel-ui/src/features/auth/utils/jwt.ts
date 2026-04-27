export type AuthUser = {
  userId?: string;
  email?: string;
  role?: string;
};

type JwtPayload = {
  [key: string]: unknown;
};

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

function getNumericClaim(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function getTokenExpiry(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  return getNumericClaim(payload["exp"]);
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (exp === null) return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowInSeconds;
}

export function mapJwtToUser(token: string): AuthUser | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    userId:
      (payload["nameid"] as string | undefined) ??
      (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string | undefined),
    email:
      (payload["email"] as string | undefined) ??
      (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string | undefined),
    role:
      (payload["role"] as string | undefined) ??
      (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string | undefined),
  };
}