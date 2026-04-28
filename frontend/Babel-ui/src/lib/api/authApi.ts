import { apiFetch } from "./client";

type AuthResponse = {
  token: string;
};

type MeResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function login(email: string, password: string) {
    return apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function register(name: string, email: string, password: string) {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export async function getMe() {
    return apiFetch<MeResponse>("/auth/me");
}