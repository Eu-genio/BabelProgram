const base = import.meta.env.VITE_API_BASE_URL; // comes from .env.local

export async function getHealth() {
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error("API error");
    return res.json() as Promise<{ status: string }>;
}
