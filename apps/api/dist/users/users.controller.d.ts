import { UsersService } from './users.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createAgent(dto: CreateAgentDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("../generated/prisma/enums.js").UserRole;
    }>;
    findAll(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("../generated/prisma/enums.js").UserRole;
    }[]>;
}
