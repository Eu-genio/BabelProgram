import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { isTokenExpired } from "../features/auth/utils/jwt";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { token } = useAuth();

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}