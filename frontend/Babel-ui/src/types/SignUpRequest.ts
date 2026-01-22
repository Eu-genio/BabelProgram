import type { UserRole } from "./userRole";

export interface CreateUserRequest {
    name: String;
    email: String;
    role: UserRole;
}