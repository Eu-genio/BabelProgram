import { describe, expect, it } from "vitest";
import { isTokenExpired, parseJwt } from "./jwt";

function createUnsignedJwt(payload: object): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.signature`;
}

describe("jwt utilities", () => {
  it("parses a valid JWT payload", () => {
    const token = createUnsignedJwt({ sub: "1", exp: 9999999999 });
    expect(parseJwt(token)).toMatchObject({ sub: "1", exp: 9999999999 });
  });

  it("treats past exp values as expired", () => {
    const token = createUnsignedJwt({ exp: 1 });
    expect(isTokenExpired(token)).toBe(true);
  });

  it("treats future exp values as not expired", () => {
    const future = Math.floor(Date.now() / 1000) + 300;
    const token = createUnsignedJwt({ exp: future });
    expect(isTokenExpired(token)).toBe(false);
  });
});
