import { resolveApiBase } from "./apiBase";

const API_BASE = resolveApiBase();

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = `API request failed (${res.status})`;

    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Ignore JSON parse errors and keep fallback message.
    }

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:session-expired"));
    }

    throw new ApiError(message, res.status);
  }

  return res.json();
}