const base = import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, password: string) {
    const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({email, password})
    });

    if(!res.ok) throw new Error("Login failed");

    return res.json();
}

export async function getMe(token: string) {
    const res = await fetch(`${base}/api/auth/me`, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
    
    if(!res.ok) throw new Error("Unauthorizaed");

    return res.json(); 
}