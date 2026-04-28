import type { CreateUserRequest } from "../types/SignUpRequest";
import type { UserResponse } from "../types/UserResponse";
import { resolveApiBase } from "../lib/api/apiBase";

export async function getHealth() {
    const res = await fetch(`${resolveApiBase()}/health`);
    if (!res.ok) throw new Error("API error");
    return res.json() as Promise<{ status: string }>;
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if(!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
}
    
export function getUsers() {
  return http<UserResponse[]>(`${resolveApiBase()}/users`);
}

export async function createUser(payload: CreateUserRequest) {
    return http<UserResponse>(`${resolveApiBase()}/users`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
        });
}

export async function updateUser(id: number, payload: CreateUserRequest) {
    return http<UserResponse>(`${resolveApiBase()}/users/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
}

export function deleteUser(id: number) {
    return http<void>(`${resolveApiBase()}/users/${id}`, { method: "DELETE" });
}
