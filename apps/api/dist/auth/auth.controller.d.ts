import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("../generated/prisma/enums.js").UserRole;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../generated/prisma/enums.js").UserRole;
        };
    }>;
}
