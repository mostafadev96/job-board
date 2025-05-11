import { UserRole } from "../dtos/login.dto";

export type JWTPayload = {
    sub: string;
    email: string,
    role: UserRole,
}