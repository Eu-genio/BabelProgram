import type { UserRole } from "./userRole";

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}