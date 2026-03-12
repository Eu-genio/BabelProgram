import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getMe } from "../api/authApi";
import type { AuthUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

const [user, setUser] = useState<AuthUser | null>(null);

useEffect(() => {
    if(!token) return;

    getMe(token).then(setUser).catch(() => logout());
}, [token]);

function login(newToken: string){
    localStorage.setItem("token", newToken);
    setToken(newToken);
}

function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
}

return (
    <AuthContext.Provider value = {{ user, token, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
}