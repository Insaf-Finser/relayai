import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
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
