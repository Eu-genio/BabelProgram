import { createContext } from "react";

export interface AuthUser {
    id: number; 
    name: string;
    email: string; 
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void; 
}

export const AuthContext = createContext<AuthContextType | null>(null);