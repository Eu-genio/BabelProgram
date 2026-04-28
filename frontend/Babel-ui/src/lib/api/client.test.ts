import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("throws ApiError with backend error message", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })
    ) as typeof fetch;

    await expect(apiFetch("/auth/login")).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: "ApiError",
        message: "Invalid credentials",
        status: 401,
      })
    );
  });

  it("clears token and emits session-expired event on 401", async () => {
    localStorage.setItem("token", "fake-token");
    const listener = vi.fn();
    window.addEventListener("auth:session-expired", listener);

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    ) as typeof fetch;

    await expect(apiFetch("/portfolios/my")).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem("token")).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener("auth:session-expired", listener);
  });
});
