/** Trim trailing slashes */
function trimTrailingSlashes(path: string): string {
  return path.replace(/\/+$/, "");
}

/**
 * Resolved API prefix: always `{origin}/api` with no trailing slash.
 * Accepts either `http://localhost:5240` or `http://localhost:5240/api` from env.
 */
export function resolveApiBase(): string {
  const raw =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5240";

  let base = trimTrailingSlashes(raw);

  if (!base.endsWith("/api")) {
    base = `${base}/api`;
  }

  return base;
}
