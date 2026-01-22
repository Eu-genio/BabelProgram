import type { CreateUserRequest } from "../types/CreateUserRequest"
import type { UserResponse } from "../types/UserResponse";

const base = import.meta.env.VITE_API_BASE_URL; // comes from .env.local

export async function getHealth() {
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error("API error");
    return res.json() as Promise<{ status: string }>;
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if(!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || 'HTTP ${res.status}');
    }
    return res.json() as Promise<T>;
}
    
export function getUsers() {
  return http<UserResponse[]>('${base}/api/users');
}