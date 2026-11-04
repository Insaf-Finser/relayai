import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAgent(dto: CreateAgentDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("../generated/prisma/enums.js").UserRole;
    }>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("../generated/prisma/enums.js").UserRole;
    }[]>;
}
