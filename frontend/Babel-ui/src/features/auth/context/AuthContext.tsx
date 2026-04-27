import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isTokenExpired, mapJwtToUser, type AuthUser } from "../utils/jwt";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  login: (newToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);

  const user = useMemo(() => {
    if (!token) return null;
    return mapJwtToUser(token);
  }, [token]);

  const login = (newToken: string) => {
    if (isTokenExpired(newToken)) {
      localStorage.removeItem("token");
      setToken(null);
      return;
    }

    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    const onSessionExpired = () => {
      setToken(null);
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    return () => window.removeEventListener("auth:session-expired", onSessionExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}