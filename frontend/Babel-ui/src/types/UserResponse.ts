import type { UserRole } from "./UserRole";

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}